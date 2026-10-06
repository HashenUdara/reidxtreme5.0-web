import Image from "next/image";
import styles from "./Footer.module.css";
import footerLogo from "../../assets/Logo_no_shadow_glowing.png";

export default function Footer() {
  return (
    <footer id="top" className={styles.footer} aria-labelledby="footer-brand">
      <div className={styles.topline} aria-hidden="true">
        <span className={styles.statusIndicator} />
        <span>ENGINEERING THE EXTRAORDINARY</span>
        <span className={styles.toplineRule} />
        <span className={styles.toplineIndex}>RX—05 / 2026</span>
      </div>

      <div className={styles.content}>
        <section className={styles.brand} aria-label="ReidXTREME 5.0">
          <Image
            className={styles.brandLogo}
            id="footer-brand"
            src={footerLogo}
            alt="ReidXTREME 5.0"
            priority
          />
          <p className={styles.tagline}>
            CROSS THE <span className={styles.accent}>CHASM.</span>
            <br />
            BRIDGE THE HORIZONS.
          </p>
          <span className={styles.coordinate}>
            COLOMBO, SRI LANKA <span aria-hidden="true">{"//"}</span> EST. 2026
          </span>
        </section>

        <nav className={styles.navigation} aria-label="Footer navigation">
          <section className={styles.linkGroup} aria-labelledby="organizers-heading">
            <h2 id="organizers-heading">ORGANIZERS</h2>
            <ul>
              <li>
                <a className={styles.organizerAbout} href="#about-reid-xtreme">
                  <span className={styles.organizerLabel}>About</span>
                  <span className={styles.brandWord}>ReidXTREME</span>
                </a>
              </li>
              <li>
                <a className={styles.organizingCommittee} href="#organizing-committee">
                  <span>Organizing</span>
                  <span>Committee</span>
                </a>
              </li>
            </ul>
          </section>

          <section className={styles.linkGroup} aria-labelledby="contact-heading">
            <h2 id="contact-heading">CONTACT</h2>
            <ul>
              <li>
                <a href="mailto:info@reidxtreme.lk">info@reidxtreme.lk</a>
              </li>
              <li>
                <a href="mailto:info@reidxtreme.lk?subject=REID%20XTREME%20Help%20Desk">
                  Help Desk
                </a>
              </li>
            </ul>
          </section>

          <section className={styles.linkGroup} aria-labelledby="social-heading">
            <h2 id="social-heading">SOCIAL LINKS</h2>
            <ul>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  Instagram <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  Facebook <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                  WhatsApp <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </section>
        </nav>
      </div>

      <div className={styles.bottomBar}>
        <span>© 2026 REID XTREME</span>
        <span className={styles.bottomNote}>CROSS THE CHASM. BRIDGE THE HORIZONS.</span>
        <a className={styles.backToTop} href="#top">
          BACK TO TOP <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
