import CalorieCalculator from "./components/CalorieCalculator";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Questions from "./components/Questions";
import CTA from "./components/CTA";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <div className="bg-background md:pb-5 pb-10">
        <CalorieCalculator />
      </div>
      <Testimonials />
      <Pricing />
      <Questions />
      <CTA />
      <Footer />
    </>
  );
}
