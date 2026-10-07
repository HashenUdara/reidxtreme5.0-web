import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/nav/SiteNav";
import { Timeline } from "@/components/timeline/Timeline";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/RegistrationForm";
import Prizes from "@/components/Prizes/Prizes";
import SponsorsSection from "./components/SponsorsSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="w-full">
        <Hero />
        <Timeline />
        <Prizes />
        <SponsorsSection />
        <section className={styles.page}>
          <RegistrationForm />
        </section>
      </main>
      {/* No bottom padding: the page ends at the footer's edge. */}
      <div className="px-4 pt-4 md:px-[clamp(1rem,5vw,4.5rem)] md:pt-[clamp(1rem,5vw,4.5rem)]">
        <Footer />
      </div>
    </>
  );
}
