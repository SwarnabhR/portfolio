import { createClient } from 'next-sanity'
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import CommentsSection from "./components/sections/CommentsSection";
import FAQ from "./components/sections/FAQ";
import { Analytics } from '@vercel/analytics/next';
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import Work from "./components/sections/Work";
import Playground from "./components/sections/Playground";
import SpotifyWidget from "./components/ui/SpotifyWidget";

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-24',
  useCdn: true,
})

export default async function Home() {
  const [faqs, services] = await Promise.all([
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
      <Playground />
      <Services items={services.length ? services : undefined} />
      <FAQ items={faqs.length ? faqs : undefined} />
      <Contact />
      <CommentsSection />
      <Analytics />
    </>
  )
}
