import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/nav/SiteNav";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="page-shell w-full flex-1">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
