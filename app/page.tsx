// app/page.tsx

import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import { Analytics } from '@vercel/analytics/next';
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import Testimonials from "./components/sections/Testimonials";
import Work from "./components/sections/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Testimonials />
      <Services />
      <Contact />
      <Analytics />
    </>
  )
}