import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ContactHero from "./components/ContactHero/ContactHero";
import ContactInfosSect from "./components/ContactInfosSect/ContactInfosSect";
import FormSect from "./components/FormSect/FormSect";

export default function ContactUs() {
  return (
    <>
      <Header />
      <ContactHero />
      <FormSect />
      <ContactInfosSect />
      <Footer/>
    </>
  );
}
