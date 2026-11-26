import Link from "next/link";

const sections = [
  {
    title: "1. How AI writes",
    items: [
      { href: "/labs/tokens", name: "Next-word machine", text: "Predict one word at a time and turn the temperature up." },
      { href: "/labs/context", name: "Context window", text: "Watch old messages fall out of reach." },
    ],
  },
  {
    title: "2. Prompt and design",
    items: [
      { href: "/labs/style", name: "Name that style", text: "Learn the words that describe a good layout." },
      { href: "/labs/prompt", name: "Prompt Lab", text: "Build a structured prompt and copy it." },
    ],
  },
  {
    title: "3. Build and test",
    items: [
      { href: "/live-build", name: "Live build", text: "Follow along: spec, prompt, test, break, fix." },
      { href: "/labs/break-it", name: "Break my app", text: "Find the bugs, then prompt the fix." },
    ],
  },
  {
    title: "4. Your turn",
    items: [
      { href: "/labs/missions", name: "Mission cards", text: "Pick a small project that fits your major." },
      { href: "/sprint", name: "Sprint timer", text: "30 minutes, three rounds." },
      { href: "/review", name: "Review checklist", text: "Check it before you share it." },
    ],
  },
];

export default function Home() {
  return (
    <>
      <section className="py-10 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-mint">Workshop</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          The art of building with AI
        </h1>
        <p className="mt-4 max-w-xl text-lg text-mute">Everything you need today is on this site.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/vote" className="btn">Join the live vote</Link>
          <Link href="/setup" className="btn-ghost">Get set up</Link>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">{section.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <Link key={item.href} href={item.href} className="card transition hover:border-mint">
                <h3 className="font-semibold text-mint">{item.name}</h3>
                <p className="mt-1 text-sm text-mute">{item.text}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-16 flex gap-5 border-t border-line pt-5 text-sm text-mute">
        <Link href="/join" className="hover:text-white">QR codes</Link>
        <Link href="/screen" className="hover:text-white">Projector screen</Link>
        <Link href="/host" className="hover:text-white">Presenter</Link>
      </footer>
    </>
  );
}
