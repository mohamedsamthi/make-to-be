import { Link } from 'react-router-dom'
import { FiTarget, FiHeart, FiShield, FiSend } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'
import Footer from '../../components/layout/Footer'

export default function AboutPage() {
  return (
    <div className="pt-24 sm:pt-28 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[var(--color-primary)] py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-black font-[var(--font-family-heading)] mb-6 leading-tight">
              Reinventing Your <br />
              <span className="gradient-text">Style Journey</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Welcome to <span className="text-[var(--color-accent)] font-bold">Make To Be</span>. 
              We are more than just a shop; we are a destination for premium fashion, 
              luxury timepieces, and accessories that define who you are.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 font-[var(--font-family-heading)]">Our Story</h2>
            <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                Founded in Kalmunai, Sri Lanka, Make To Be started with a simple vision: to bring the finest global styles to our local community. We believe that everyone deserves to look and feel premium without compromise.
              </p>
              <p>
                We handpick every item in our collection—from the intricate details of our designer dresses to the precision engineering of our watches. Our commitment to quality is what makes us "Make To Be".
              </p>
            </div>
          </div>
          <div className="glass rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 gradient-accent opacity-10 group-hover:opacity-20 transition-all duration-700" />
            <div className="relative z-10 grid grid-cols-2 gap-6">
              {[
                { icon: <FiTarget size={24} />, title: "Vision", desc: "Leading the fashion industry in Sri Lanka." },
                { icon: <FiHeart size={24} />, title: "Passion", desc: "We love what we do and it shows in our gear." },
                { icon: <FiShield size={24} />, title: "Trust", desc: "100% Authentic products guaranteed." },
                { icon: <FiSend size={24} />, title: "Goal", desc: "Making premium fashion accessible to all." }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl glass-light">
                  <div className="text-[var(--color-accent)] mb-3">{item.icon}</div>
                  <h4 className="font-bold mb-1 text-sm">{item.title}</h4>
                  <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="gradient-accent rounded-[2rem] p-10 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black mb-8 font-[var(--font-family-heading)]">Our Mission</h2>
            <p className="text-lg sm:text-xl leading-relaxed opacity-90">
              "To empower individuals to express their unique identity through curated, 
              high-quality fashion and accessories that combine timeless elegance with modern trends."
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
