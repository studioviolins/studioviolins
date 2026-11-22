import Contact from "@/components/contact/Contact";
import Credentials from "@/components/credentials/Credentials";
import Faq from "@/components/faq/Faq";
import Hero from "@/components/hero/Hero";
import InstrumentExplorer from "@/components/instrument/InstrumentExplorer";
import MeetNick from "@/components/meet-nick/MeetNick";
import Pricing from "@/components/pricing/Pricing";
import BusinessJsonLd from "@/components/seo/BusinessJsonLd";
import SiteFooter from "@/components/site-footer/SiteFooter";
import SiteHeader from "@/components/site-header/SiteHeader";
import Testimonials from "@/components/testimonials/Testimonials";

export default function Home() {
  return (
    <>
      <BusinessJsonLd />
      <SiteHeader overHero />
      <main>
        <Hero />
        <Credentials />
        <Testimonials />
        <InstrumentExplorer />
        <Pricing />
        <MeetNick />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
