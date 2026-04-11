import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The Mindful Group",
  description: "Our mission, story, and board of directors. Founded in 2019, The Mindful Group builds futures through workforce training in Milwaukee.",
};

const boardMembers = [
  {
    name: "Reginald Reed Jr.",
    role: "Founder & Executive Director",
    expertise: "Workforce Development, Data Analytics, Process Improvement",
    bio: "Founded The Mindful Group and developed innovative workforce models including a zero-tuition training concept. A decade of experience in workforce development. Wisconsin's state-selected expert in career and technical education, consulting for school districts and government agencies in Wisconsin and Tennessee.",
  },
  {
    name: "Regina Flores",
    role: "Board Chair",
    expertise: "Diversity, Equity, and Inclusion",
    bio: "Milwaukee native with leadership roles in public and private sectors. Currently Director of Procurement for Milwaukee County, focused on equitable contracting and transparency.",
  },
  {
    name: "Jiquinna Cohen",
    role: "Vice Chair",
    expertise: "Contract Compliance & Education",
    bio: "Manager of contract compliance at Milwaukee Public Schools. Expertise in youth access to higher education and compliance standards.",
  },
  {
    name: "Zoe Braun",
    role: "Treasurer",
    expertise: "Finance",
    bio: "Owner of Tiger Lily Collective and Board Certified cosmetic tattooist. Background in corporate finance and accounting.",
  },
  {
    name: "Lakesha Jones",
    role: "Development Committee Chair",
    expertise: "Non-Profit Management",
    bio: "20+ years of nonprofit experience. Consultant for Wisconsin nonprofit organizations and educational institutions. Specializes in grant writing and resource development.",
  },
  {
    name: "Ryan Pattee",
    role: "Head of Real Estate",
    expertise: "Real Estate",
    bio: "20+ years in residential, commercial, mixed-use, and governmental real estate. Development work across Milwaukee neighborhoods.",
  },
  {
    name: "Theron Rogers",
    role: "Professional Development",
    expertise: "Training & Development",
    bio: "Managing Partner/Director of Business Development for Prolific Arms LLC. Law enforcement background including Patrol Sergeant, Community Liaison Officer, and State Trooper. Technical Sergeant in U.S. Air Force National Guard with deployments to Afghanistan and Saudi Arabia.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Mission */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-semibold text-primary text-sm uppercase tracking-[0.3em] mb-6">About Us</p>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            Building Futures, <span className="text-primary">Not Just Services</span>
          </h1>
          <p className="text-text-light text-lg max-w-3xl">
            Founded in 2019, The Mindful Group is a 501(c)(3) nonprofit dedicated to fostering economic growth in Milwaukee&apos;s underserved communities through workforce training, holistic support, and direct employment pathways.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading text-text mb-6">Our Story</h2>
              <div className="space-y-4 text-text-light leading-relaxed">
                <p>The Mindful Group was born from a simple observation: traditional workforce development programs treat training as the finish line, when it&apos;s actually just the starting point.</p>
                <p>We built something different — an integrated model that combines career training with the wraparound support people actually need: child care, transportation, housing, and mental health services. When you remove the barriers, people don&apos;t just complete training — they launch careers.</p>
                <p>Since 2018, we&apos;ve trained 525+ people with a 90% graduation rate and 85% job placement. We charge zero tuition. We partner with community leaders, schools, and businesses. And we&apos;re part of a larger ecosystem — House Reed — engineered specifically to reverse urban poverty.</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-6">By The Numbers</h3>
              <div className="space-y-4">
                {[
                  { stat: "525+", label: "People Trained" },
                  { stat: "90%", label: "Graduation Rate" },
                  { stat: "85%", label: "Job Placement Rate" },
                  { stat: "$0", label: "Tuition Charged" },
                  { stat: "2019", label: "Year Founded" },
                  { stat: "5+", label: "Programs Offered" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-4 border-b border-border-light pb-3">
                    <span className="text-primary text-2xl font-heading w-20">{s.stat}</span>
                    <span className="text-text-light text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board */}
      <section id="board" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-semibold text-primary text-sm uppercase tracking-[0.3em] mb-6">Leadership</p>
          <h2 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-4">
            Board of <span className="text-primary">Directors</span>
          </h2>
          <p className="text-text-light text-lg max-w-3xl mb-16">
            Diverse. Experienced. Passionate. Professionals spanning multiple industries, ages, ethnicities, and backgrounds — united by a commitment to community impact.
          </p>

          <div className="space-y-6">
            {boardMembers.map((m) => (
              <div key={m.name} className="border border-border-light hover:border-primary/30 p-8 transition-all duration-300 bg-white rounded-lg">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-xl font-heading text-text">
                      {m.name === "Reginald Reed Jr." ? (
                        <a href="https://reginald-reed-site.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{m.name}</a>
                      ) : (
                        m.name
                      )}
                    </h3>
                    <p className="text-primary text-sm mt-1">{m.role}</p>
                    <p className="text-text-light/60 text-xs mt-2 uppercase tracking-wider">{m.expertise}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-text-light leading-relaxed">{m.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-semibold text-primary text-sm uppercase tracking-[0.3em] mb-6">The Ecosystem</p>
          <h2 className="text-3xl md:text-4xl font-heading text-text leading-tight mb-8">
            Part of <span className="text-primary">House Reed</span>
          </h2>
          <p className="text-text-light text-lg max-w-3xl mb-12">
            The Mindful Group is the training engine of House Reed — an integrated ecosystem of enterprises engineered to reverse urban poverty in Milwaukee.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: "The Mindful Group", role: "Workforce Training", type: "501(c)(3)" },
              { name: "Mindful Staffing", role: "Employment Pipeline", type: "For-Profit" },
              { name: "Mindful Measures", role: "REIGN Workforce OS", type: "Technology" },
              { name: "Nana's Cozy Corner", role: "Childcare", type: "Childcare" },
              { name: "Cozy Cruisers", role: "Transportation", type: "Transport" },
            ].map((e) => (
              <div key={e.name} className="border border-border-light p-6 text-center bg-white rounded-lg">
                <p className="text-text text-sm font-heading mb-1">{e.name}</p>
                <p className="text-text-light text-xs mb-2">{e.role}</p>
                <span className="text-[10px] uppercase tracking-[0.2em] border border-border-light text-primary/60 px-2 py-0.5">{e.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
