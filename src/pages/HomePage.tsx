import { Hero } from '../components/sections/Hero'
import { BrandStatement } from '../components/sections/BrandStatement'
import { SignatureFragrance } from '../components/sections/SignatureFragrance'
import { HorizontalCollection } from '../components/sections/HorizontalCollection'
import { SurpriseReveal } from '../components/sections/SurpriseReveal'
import { FinalCTA } from '../components/sections/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <SignatureFragrance />
      <HorizontalCollection />
      <SurpriseReveal />
      <FinalCTA />
    </>
  )
}
