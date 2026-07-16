import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/home/home";
import ContactUs from "./Pages/contact-us/contact-us";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<ContactUs />} path="/contact-us" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
