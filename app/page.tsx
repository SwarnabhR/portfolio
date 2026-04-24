// app/page.tsx

import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import Work from "./components/sections/Work";

export default function Home() {
  return (
    <>
      <Hero></Hero>
      <About></About>
      <Work></Work>
      <Services></Services>
      <Contact></Contact>
      <Footer></Footer>
    </>
  )
}