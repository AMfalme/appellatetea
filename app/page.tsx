"use client";


import React, { useState } from 'react';

export default function AppellateTeaHomepage() {
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && suggestion) {
      setSubmitted(true);
      setEmail('');
      setSuggestion('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-serif selection:bg-red-100 selection:text-red-900">
      {/* Top Banner / Micro Info */}
      <div className="border-b border-black py-1 px-4 text-center text-xs uppercase tracking-widest text-neutral-600 flex justify-between items-center max-w-7xl mx-auto">
        <span>Digital Publication // Schema: DigitalPublication</span>
        <span className="hidden md:inline">Operating Hours: 24/7 Digital Access</span>
        <span>Global Edition</span>
      </div>

      {/* Main Masthead Header */}
      <header className="text-center py-12 px-4 border-b-4 border-double border-black max-w-7xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase font-serif mb-4 text-black">
          Appellate Tea
        </h1>
        <p className="text-md md:text-lg italic max-w-2xl mx-auto text-neutral-800 font-sans tracking-wide">
          "A legal and policy blog dissecting Supreme Court cases and social development through a refreshing storytelling lens."
        </p>
        
        {/* Newspaper Meta Bar */}
        <div className="mt-8 pt-4 border-t border-black flex flex-wrap justify-between items-center text-xs uppercase font-sans tracking-wider text-neutral-700">
          <div>Vol. I • No. 1</div>
          <div className="font-bold text-crimson text-red-700">INTELLIGENT SANCTUARY FOR THE DISCERNING AUDIENCE</div>
          <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-black">
        
        {/* Left Column: Flagship Deep Dives (6 Cols) */}
        <section className="lg:col-span-6 lg:border-r lg:border-black lg:pr-8">
          <div className="border-b border-black pb-2 mb-6">
            <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-red-700">Flagship Analysis & Deep Dives</h2>
          </div>
          
          <article className="mb-8">
            <span className="text-xs uppercase font-sans tracking-wider text-neutral-500">Supreme Court Decisions</span>
            <h3 className="text-3xl md:text-4xl font-bold leading-tight mt-1 mb-3 hover:text-red-700 cursor-pointer transition-colors">
              The Human Heartbeat Beneath the Gavel: Dissecting Recent Judicial Precedents
            </h3>
            <p className="text-neutral-700 leading-relaxed text-md mb-4">
              Stripping away the impenetrable jargon of the courtroom to reveal the anthropological realities shaping the highest court's latest rulings. We bridge the gap between dense academic discourse and accessible narrative analysis.
            </p>
            <span className="text-xs font-sans font-semibold underline cursor-pointer hover:text-red-700">Read the Essay →</span>
          </article>

          <hr className="border-neutral-200 my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article>
              <span className="text-xs uppercase font-sans tracking-wider text-neutral-500">Parliamentary Bills</span>
              <h4 className="text-xl font-bold mt-1 mb-2 hover:text-red-700 cursor-pointer">Analyzing Legislative Trends & Social Evolution</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                A granular evaluation of proposed parliamentary structures and their long-term implications on modern legal landscapes.
              </p>
            </article>
            <article>
              <span className="text-xs uppercase font-sans tracking-wider text-neutral-500">African Development</span>
              <h4 className="text-xl font-bold mt-1 mb-2 hover:text-red-700 cursor-pointer">Commentary on Post-Colonial Constitutionalism</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Where the structural weight of legislative decisions meets the nuanced perspective of global social philosophy.
              </p>
            </article>
          </div>
        </section>

        {/* Center Column: Opinions & Philosophy (3 Cols) */}
        <section className="lg:col-span-3 lg:border-r lg:border-black lg:pr-6">
          <div className="border-b border-black pb-2 mb-6">
            <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-red-700">Social Philosophy</h2>
          </div>
          
          <div className="space-y-6">
            <article className="pb-6 border-b border-neutral-200">
              <h4 className="text-lg font-bold leading-snug hover:text-red-700 cursor-pointer">The Intersection of Law & Everyday Life</h4>
              <p className="text-neutral-600 text-sm mt-2">
                Delivered with the confidence of a seasoned observer and the clarity of a modern intellectual.
              </p>
            </article>
            <article className="pb-6 border-b border-neutral-200">
              <h4 className="text-lg font-bold leading-snug hover:text-red-700 cursor-pointer">Preparing for High-Stakes Judicial Appointments</h4>
              <p className="text-neutral-600 text-sm mt-2">
                Essential strategic insights designed specifically for lawyers, researchers, and legal journalists requiring deep contextual mapping.
              </p>
            </article>
            <article>
              <h4 className="text-lg font-bold leading-snug hover:text-red-700 cursor-pointer">Minimalist Aesthetics & The Power of Words</h4>
              <p className="text-neutral-600 text-sm mt-2">
                Why our editorial framework rejects modern digital noise to prioritize pure, unadulterated analytical value.
              </p>
            </article>
          </div>
        </section>

        {/* Right Column: About, Transparency & Inquiry Form (3 Cols) */}
        <section className="lg:col-span-3 space-y-8">
          <div>
            <div className="border-b border-black pb-2 mb-4">
              <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-red-700">Our Manifesto</h2>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed italic">
              Appellate Tea is an authoritative digital publication transforming dense judicial proceedings into refreshing storytelling journeys. We provide open transparency in legal analysis for a global community.
            </p>
            <div className="mt-2 text-xs uppercase font-sans font-bold text-neutral-900">Pricing Model: Free Access</div>
          </div>

          <div className="bg-neutral-50 p-4 border border-black">
            <h3 className="text-xs uppercase font-sans font-bold tracking-widest text-red-700 mb-2">Reader Inquiry & Submission Form</h3>
            <p className="text-xs text-neutral-600 mb-4 font-sans">
              Have a legal development, supreme court ruling, or parliamentary bill you want analyzed? Submit your questions below.
            </p>
            
            {submitted ? (
              <div className="text-xs bg-green-50 border border-green-800 text-green-800 p-3 font-sans">
                ✓ Thank you. Your inquiry has been logged in accordance with our transparent reader policy.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 font-sans">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-neutral-700">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-400 focus:border-black focus:outline-none rounded-none text-black" 
                    placeholder="reader@appellatetea.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-neutral-700">Topic Suggestion / Question</label>
                  <textarea 
                    rows={3}
                    required
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-400 focus:border-black focus:outline-none rounded-none text-black resize-none" 
                    placeholder="Inquire about recent legislative trends..."
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-red-700 text-xs uppercase font-bold tracking-widest py-2 transition-colors duration-200 rounded-none"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          <div>
            <div className="border-b border-black pb-2 mb-2">
              <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-red-700">Keywords of Scope</h2>
            </div>
            <div className="flex flex-wrap gap-1 font-sans text-[11px] text-neutral-600">
              {['Supreme Court decisions', 'policy analysis', 'African development', 'social philosophy', 'judicial appointments', 'legal journalism'].map((tag) => (
                <span key={tag} className="bg-neutral-100 px-2 py-0.5 border border-neutral-200">#{tag}</span>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Editorial Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 font-sans text-xs text-neutral-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="font-bold text-black font-serif text-sm">Appellate Tea</p>
          <p>© {new Date().getFullYear()} Appellate Tea. Open Transparency in Legal Analysis Policy.</p>
        </div>
        <div className="flex flex-col md:text-right text-xs gap-1">
          <div>Editorial Desk: <a href="mailto:appellatetea@gmail.com" className="underline hover:text-red-700">appellatetea@gmail.com</a></div>
          <div>Reader Correspondence: <a href="mailto:reader@appellatetea.com" className="underline hover:text-red-700">reader@appellatetea.com</a></div>
        </div>
      </footer>
    </div>
  );
}