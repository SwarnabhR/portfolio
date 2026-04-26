import { createClient } from 'next-sanity'
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import CommentsSection from "./components/sections/CommentsSection";
import FAQ from "./components/sections/FAQ";
import { Analytics } from '@vercel/analytics/next';
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import Testimonials from "./components/sections/Testimonials";
import Work from "./components/sections/Work";
import SpotifyWidget from "./components/ui/SpotifyWidget";

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-24',
  useCdn: true,
})

export default async function Home() {
  const [testimonials, faqs, services] = await Promise.all([
    client.fetch<{ quote: string; name: string; role: string; date: string }[]>(
      `*[_type == "testimonial"] | order(order asc) { quote, name, role, date }`
    ),
    client.fetch<{ question: string; answer: string }[]>(
      `*[_type == "faqItem"] | order(order asc) { question, answer }`
    ),
    client.fetch<{ title: string; description: string }[]>(
      `*[_type == "service"] | order(order asc) { title, description }`
    ),
  ])

  return (
    <>
      <SpotifyWidget />
      <Hero />
      <About />
      <Work />
      <Testimonials items={testimonials.length ? testimonials : undefined} />
      <Services items={services.length ? services : undefined} />
      <FAQ items={faqs.length ? faqs : undefined} />
      <Contact />
      <CommentsSection />
      <Analytics />
    </>
  )
}
