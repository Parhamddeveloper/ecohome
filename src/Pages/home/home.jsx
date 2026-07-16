import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Navbar from "../../components/Header/Header";
import Hero from "./components/Hero/Hero";
import ProductArchiveCard from "./components/ProductArchiveCard/ProductArchiveCard";
import Footer from "../../components/Footer/Footer";
import AboutUsSect from "./components/AboutUsSect/AboutUsSect";
import DecorArchivesSect from "./components/DecorArchivesSect/DecorArchivesSect";
import Testimonial from "./components/testimonial/Testimonial";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <DecorArchivesSect />
      <AboutUsSect />
      <Testimonial/>
      <Footer />
    </>
  );
}
