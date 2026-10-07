// Cuts the timeline bridge pieces out of the two reference renders in Assets/.
//
//   node scripts/slice-bridges.mjs
//
// The lower span in bridge_disconnected.jpg is the upper span mirrored and
// shifted by (MIRROR_DX, MIRROR_DY), and bridge_connected.jpeg is the same
// picture with a curved deck added on the right. So one span image and one
// connector image are enough: the timeline mirrors them on alternate rows.
//
// Each span is split into a core and two end caps. A connector covers the
// same pixels as the caps it meets, so the timeline swaps caps for connector
// and the join never shows two copies of the deck end.
//
// Outputs: public/timeline/*.png and components/timeline/bridgeGeometry.ts.
// All geometry is in source pixels of bridge_disconnected.jpg.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(root, "public/timeline");
const GEOMETRY_FILE = join(root, "components/timeline/bridgeGeometry.ts");

// Found by cross-correlating the mirrored upper span against the lower one.
const MIRROR_DX = -372;
const MIRROR_DY = 1675;
// First empty row band between the two spans.
const SPLIT_Y = 1706;
// Only differences inside this box belong to the connector; elsewhere the
// two renders differ by resampling noise alone.
const CONNECTOR_BOX = { x0: 1800, y0: 1250, x1: Infinity, y1: 2600 };
// Pieces are exported at this fraction of the source size.
const EXPORT_SCALE = 0.75;

mkdirSync(OUT_DIR, { recursive: true });

const disconnected = sharp(join(root, "Assets/bridge_disconnected.jpg"));
const { width: W, height: H } = await disconnected.metadata();
const dis = await disconnected.removeAlpha().raw().toBuffer();
const con = await sharp(join(root, "Assets/bridge_connected.jpeg"))
  .resize(W, H, { kernel: "lanczos3" })
  .removeAlpha()
  .raw()
  .toBuffer();

const N = W * H;
const brightness = (rgb, i) =>
  Math.max(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]) / 255;
const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// The renders are light on black, so brightness doubles as coverage.
// The floor drops JPEG noise in the black background.
const coverage = (rgb) => {
  const a = new Float32Array(N);
  for (let i = 0; i < N; i++) a[i] = smoothstep(0.03, 0.08, brightness(rgb, i)) * brightness(rgb, i);
  return a;
};
const disAlpha = coverage(dis);
const conAlpha = coverage(con);

async function blur(values, sigma) {
  const bytes = Buffer.alloc(N);
  for (let i = 0; i < N; i++) bytes[i] = Math.round(Math.min(1, values[i]) * 255);
  const out = await sharp(bytes, { raw: { width: W, height: H, channels: 1 } })
    .blur(sigma)
    .extractChannel(0)
    .raw()
    .toBuffer();
  return Float32Array.from(out, (v) => v / 255);
}

// Connector mask: where the connected render differs, grown and feathered so
// it fully covers the deck ends it replaces.
const changed = new Float32Array(N);
for (let y = CONNECTOR_BOX.y0; y < CONNECTOR_BOX.y1; y++) {
  for (let x = CONNECTOR_BOX.x0; x < W; x++) {
    const i = y * W + x;
    changed[i] = Math.abs(brightness(con, i) - brightness(dis, i)) * 4;
  }
}
const softChanged = await blur(changed, 10);
const core = new Float32Array(N);
for (let i = 0; i < N; i++) core[i] = smoothstep(0.08, 0.2, softChanged[i]);
const grown = await blur(core, 24);
const connectorMask = Float32Array.from(grown, (v) => Math.min(1, v * 2.2));

// Upper span pixel p sits at G(p) in the lower span.
const mirrorIndex = (x, y) => {
  const mx = W - 1 - x + MIRROR_DX;
  const my = y + MIRROR_DY;
  return mx < 0 || mx >= W || my < 0 || my >= H ? -1 : my * W + mx;
};

const spanCore = new Float32Array(N);
const endCap = new Float32Array(N);
const startCap = new Float32Array(N);
for (let y = 0; y < SPLIT_Y; y++) {
  // The glow halo runs into the image top and into the gap below the span.
  const edgeFade = smoothstep(0, 24, y) * smoothstep(SPLIT_Y, SPLIT_Y - 40, y);
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const a = disAlpha[i] * edgeFade;
    if (!a) continue;
    const end = connectorMask[i];
    const j = mirrorIndex(x, y);
    const start = j < 0 ? 0 : connectorMask[j];
    spanCore[i] = a * (1 - end) * (1 - start);
    endCap[i] = a * end;
    // The render crops the deck at the left image edge. Dissolve it instead,
    // so an unjoined end reads as unfinished rather than cut.
    startCap[i] = a * start * smoothstep(0, 160, x);
  }
}

const connector = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const x = i % W;
  // Same for the curve's glow at the right image edge.
  connector[i] = conAlpha[i] * connectorMask[i] * smoothstep(W, W - 40, x);
}

function bounds(alpha, minAlpha = 0.004) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (alpha[y * W + x] <= minAlpha) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

// Unpremultiply against black: the stored colour times alpha gives back the
// render's pixel, so additive blending reproduces the original image.
async function writePiece(name, rgb, alpha, rect) {
  const pixels = Buffer.alloc(rect.w * rect.h * 4);
  for (let y = 0; y < rect.h; y++) {
    for (let x = 0; x < rect.w; x++) {
      const i = (rect.y + y) * W + rect.x + x;
      const o = (y * rect.w + x) * 4;
      const a = alpha[i];
      const level = brightness(rgb, i);
      for (let c = 0; c < 3; c++) {
        pixels[o + c] = level > 0 ? Math.min(255, Math.round(rgb[i * 3 + c] / level)) : 0;
      }
      pixels[o + 3] = Math.round(a * 255);
    }
  }
  const width = Math.round(rect.w * EXPORT_SCALE);
  const height = Math.round(rect.h * EXPORT_SCALE);
  await sharp(pixels, { raw: { width: rect.w, height: rect.h, channels: 4 } })
    .resize(width, height, { kernel: "lanczos3" })
    .png({ compressionLevel: 9, palette: false })
    .toFile(join(OUT_DIR, `${name}.png`));
  return { src: `/timeline/${name}.png`, ...rect, width, height };
}

const pieces = {
  span: await writePiece("span", dis, spanCore, bounds(spanCore)),
  spanStart: await writePiece("span-start", dis, startCap, bounds(startCap)),
  spanEnd: await writePiece("span-end", dis, endCap, bounds(endCap)),
  connector: await writePiece("connector", con, connector, bounds(connector)),
};

// Outline of the whole span, for hit-testing: per column band, the highest
// and lowest solid line.
function outline(alpha, band = 48) {
  const top = [];
  const bottom = [];
  for (let x0 = 0; x0 < W; x0 += band) {
    let lo = H;
    let hi = -1;
    for (let y = 0; y < SPLIT_Y; y++) {
      for (let x = x0; x < Math.min(W, x0 + band); x++) {
        if (alpha[y * W + x] < 0.35) continue;
        if (y < lo) lo = y;
        if (y > hi) hi = y;
      }
    }
    if (hi < 0) continue;
    const cx = Math.min(W - 1, x0 + band / 2);
    top.push([cx, lo]);
    bottom.push([cx, hi]);
  }
  return [...top, ...bottom.reverse()];
}

const fullSpan = disAlpha.map((a, i) => (i < SPLIT_Y * W ? a : 0));
const hitOutline = outline(fullSpan);

const rect = ({ src, x, y, w, h, width, height }) =>
  `{ src: "${src}", x: ${x}, y: ${y}, w: ${w}, h: ${h}, width: ${width}, height: ${height} }`;

writeFileSync(
  GEOMETRY_FILE,
  `// Generated by scripts/slice-bridges.mjs. Do not edit by hand.
// Units are source pixels of Assets/bridge_disconnected.jpg.

export type Piece = {
  src: string;
  /** Position and size in the source frame. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Size of the exported image. */
  width: number;
  height: number;
};

/** Source frame width. Mirroring is about its centre line. */
export const FRAME_WIDTH = ${W};
/** Each following span is the previous one mirrored, then moved by this much. */
export const MIRROR_DX = ${MIRROR_DX};
export const MIRROR_DY = ${MIRROR_DY};

export const SPAN: Piece = ${rect(pieces.span)};
export const SPAN_START: Piece = ${rect(pieces.spanStart)};
export const SPAN_END: Piece = ${rect(pieces.spanEnd)};
export const CONNECTOR: Piece = ${rect(pieces.connector)};

/** Span silhouette as [x, y] points, for hover hit areas. */
export const SPAN_OUTLINE: [number, number][] = ${JSON.stringify(hitOutline)};
`,
);

console.log(pieces);
