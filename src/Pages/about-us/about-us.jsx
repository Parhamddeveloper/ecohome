import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import AboutHero from "./components/AboutHero/AboutHero";
import OurGoalsSect from "./components/OurGoalsSect/OurGoalsSect";
import OurTeam from "./components/OurTeam/OurTeam";

export default function AboutUs() {
  return (
    <>
      <Header />
      <AboutHero />
      <OurGoalsSect/>
      <OurTeam/>
      <Footer />
    </>
  );
}
