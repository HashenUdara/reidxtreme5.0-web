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
      <main className={`page-shell w-full flex-1 ${styles.page || ""}`}>
        <Hero />
        <RegistrationForm />
        <Prizes />
        <SponsorsSection />
      </main>
      <Footer />
    </>
  );
}
