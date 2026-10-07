import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/nav/SiteNav";
import Footer from "../components/Footer";
import RegistrationForm from "../components/RegistrationForm";
import Prizes from "../components/Prizes/Prizes";
import SponsorsSection from "./components/SponsorsSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="w-full flex-1">
        <Hero />
        <div className={`page-shell w-full ${styles.page || ""}`}>
          <RegistrationForm />
          <Prizes />
          <SponsorsSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
