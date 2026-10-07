import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/nav/SiteNav";
import { Timeline } from "@/components/timeline/Timeline";
import Footer from "../components/Footer";
import RegistrationForm from "../components/RegistrationForm";
import Prizes from "../components/Prizes/Prizes";
import SponsorsSection from "./components/SponsorsSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="w-full">
        <Hero />
        <Timeline />
        <section className={styles.page}>
          <RegistrationForm />
        </section>
        <Prizes />
        <SponsorsSection />
      </main>
      <div className="page-shell">
        <Footer />
      </div>
    </>
  );
}
