import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero/Hero";
import ProductArchiveCard from "./components/ProductArchiveCard/ProductArchiveCard";
import AboutUsSect from "./components/AboutUsSect/AboutUsSect";
import DecorArchivesSect from "./components/DecorArchivesSect/DecorArchivesSect";
import Testimonial from "./components/testimonial/Testimonial";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DecorArchivesSect />
      <AboutUsSect />
      <Testimonial/>
    </>
  );
}
