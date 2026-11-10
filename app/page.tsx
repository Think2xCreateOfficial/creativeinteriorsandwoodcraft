import HeroFilm from "@/components/sections/HeroFilm";
import About from "@/components/sections/About";
import OurApproach from "@/components/sections/OurApproach";
import InteriorsGallery from "@/components/sections/InteriorsGallery";
import OurWorks from "@/components/sections/OurWorks";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <main id="content">
      {/* Section 01: Hero film & scroll-motion showcase */}
      <HeroFilm />

      {/* Section 02: About section (Reference 1) */}
      <About />

      {/* Section 03: Our Approach (Reference 2) */}
      <OurApproach />

      {/* Section 04: What We Do / Services (Preserved UI/UX + 10 Services) */}
      <InteriorsGallery />

      {/* Section 05: Our Works / Video Portfolio (Reference 3) */}
      <OurWorks />

      {/* Section 06: Testimonials & Google Reviews (Reference 4) */}
      <Testimonials />

      {/* Section 07: Studio Location & Enquiry Submission */}
      <Contact />
      
      {/* Section 08: Frequently Asked Questions (Reference 5) */}
      <Faq />
    </main>
  );
}
