import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/nav/SiteNav";
import { Timeline } from "@/components/timeline/Timeline";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/RegistrationForm";
import Prizes from "@/components/Prizes/Prizes";
import SponsorsSection from "@/app/components/SponsorsSection";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="w-full">
        <Hero />
        <Timeline />
        <Prizes />
        <SponsorsSection />
        {/* The body already draws the grid; this adds only the glow from above. */}
        <div className="grid min-h-screen [place-items:safe_center] bg-[radial-gradient(ellipse_at_50%_0%,rgb(36_117_82/0.16),transparent_42rem)] p-3 sm:p-[clamp(1rem,5vw,3rem)]">
          <RegistrationForm />
        </div>
      </main>
      <div className="p-4 md:p-[clamp(1rem,5vw,4.5rem)]">
        <Footer />
      </div>
    </>
  );
}
