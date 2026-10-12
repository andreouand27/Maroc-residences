import Apartments from './components/Apartments'
import Contact from './components/Contact'
import Features from './components/Features'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Project from './components/Project'

export default function App() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Hero />
      <main>
        <Project />
        <Apartments />
        <Features />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
