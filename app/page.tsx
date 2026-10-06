import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/nav/SiteNav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
      </main>
    </>
  );
}
