import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/home/home";
import ContactUs from "./Pages/contact-us/contact-us";
import AboutUs from "./Pages/about-us/about-us";
import Account from "./Pages/account/Account";
import Dashboard from "./Pages/account/Dashboard";
import EditProfile from "./Pages/account/EditProfile";
import FAQ from "./Pages/faq/faq";
import Projects from "./Pages/projects/projects";
import ProjectDetails from "./Pages/projects/ProjectDetails";
import Layout from "./Layout";
import Weblog from "./Pages/weblog/Weblog";
import SessionProvider from "./context/SessionProvider";
function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route element={<ContactUs />} path="/contact-us" />
            <Route element={<AboutUs />} path="/about-us" />
            <Route element={<Account />} path="/account" />
            <Route element={<EditProfile />} path="/edit-profile" />
            <Route element={<FAQ />} path="/faq" />
            <Route element={<Projects />} path="/projects" />
            <Route element={<ProjectDetails />} path="/projects/:id" />
            <Route element={<Weblog />} path="/weblogs" />
            <Route element={<ProjectDetails article />} path="/weblogs/:id" />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
