import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/home/home";
import ContactUs from "./Pages/contact-us/contact-us";
import AboutUs from "./Pages/about-us/about-us";
import FAQ from "./Pages/faq/faq";
import Projects from "./Pages/projects/projects";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<ContactUs />} path="/contact-us" />
          <Route element={<AboutUs />} path="/about-us" />
          <Route element={<FAQ />} path="/faq" />
          <Route element={<Projects />} path="/projects" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
