import BlogsSect from "./components/blogsSect/BlogsSect";
import FilterSect from "./components/filterSect/MobileFilterSect";
import WeblogHero from "./components/weblogHero/WeblogHero";

export default function Weblog() {
  return (
    <>
      <WeblogHero />
      <BlogsSect />
    </>
  );
}
