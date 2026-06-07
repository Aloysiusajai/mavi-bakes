import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCakes from "@/components/FeaturedCakes";
import AboutUs from "@/components/AboutUs";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import CustomOrder from "@/components/CustomOrder";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import MouseGlow from "@/components/MouseGlow";
import GSAPAnimations from "@/components/GSAPAnimations";
import PromoBanner from "@/components/PromoBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import DeliveryChecker from "@/components/DeliveryChecker";
import SizeCalculator from "@/components/SizeCalculator";
import Notifications from "@/components/Notifications";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative">
        <Notifications />
        <PromoBanner />
        <MouseGlow />
        <GSAPAnimations />
        <Navbar />
        <Hero />
        <div className="reveal-up">
          <FeaturedCakes />
        </div>
        <div className="reveal-up">
          <AboutUs />
        </div>
        <div className="reveal-up">
          <Gallery />
        </div>
        <div className="reveal-up">
          <Testimonials />
        </div>
        <div className="reveal-up">
          <CustomOrder />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
          <DeliveryChecker />
          <SizeCalculator />
        </div>
        <div className="reveal-up">
          <Contact />
        </div>
        <WhatsAppButton />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
