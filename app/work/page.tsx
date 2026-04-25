import Work from '@/components/sections/Work'
import CommentsSection from '@/components/sections/CommentsSection'

export const metadata = {
  title: 'Work — S. Roy',
  description: 'Experience, projects, and tech stack of S. Roy — quant developer.',
}

export default function WorkPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 80 }}>
      <Work />
      <CommentsSection />
    </main>
  )
}
