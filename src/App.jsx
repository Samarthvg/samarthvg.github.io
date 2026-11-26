import { MotionConfig } from 'framer-motion'
import Cursor from './components/Cursor'
import Petals from './components/Petals'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import OffTheClock from './components/OffTheClock'
import Contact from './components/Contact'

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(110%_60%_at_72%_0%,rgb(var(--c-accent)/0.07),transparent_65%)]" />
      <div className="grain absolute inset-0 mix-blend-overlay" />
      <Petals />
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <Cursor />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <OffTheClock />
        <Contact />
      </main>
    </MotionConfig>
  )
}

