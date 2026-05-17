import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-gray-950 text-lg">
            AG
          </div>
          <span className="text-xl font-bold tracking-tight">AgentGuard</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Dashboard &rarr;
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-28 max-w-5xl mx-auto">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <span className="inline-block mb-6 px-4 py-1.5 text-xs font-medium tracking-widest uppercase rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
            Enterprise Agent Control Center
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AgentGuard
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Real-time Observability &amp; Security for Enterprise AI Agents
          </p>
          <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto">
            Monitor every agent interaction, inspect network traffic with deep packet analysis,
            detect threats in real-time, and maintain full audit compliance — all from a single pane of glass.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 font-semibold text-sm tracking-wide hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Enter Dashboard
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-lg border border-gray-700 text-gray-300 font-medium text-sm hover:border-gray-500 hover:text-white transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-24 max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">Core Capabilities</h2>
        <p className="text-center text-gray-500 mb-14 max-w-lg mx-auto text-sm">
          End-to-end visibility into your AI agent fleet with enterprise-grade security controls.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "🦞",
              title: "Deep Packet Inspection",
              subtitle: "Lobster Trap",
              desc: "Intercept and analyze every network call your agents make. Full payload visibility with intelligent threat scoring.",
              color: "from-red-500/20 to-orange-500/20",
              border: "border-red-500/20",
            },
            {
              icon: "🛡️",
              title: "Real-time Threat Detection",
              subtitle: "Gemini-Powered",
              desc: "AI-driven analysis flags prompt injection, data exfiltration, unauthorized access, and anomalous agent behavior instantly.",
              color: "from-amber-500/20 to-yellow-500/20",
              border: "border-amber-500/20",
            },
            {
              icon: "📊",
              title: "Agent Monitoring Dashboard",
              subtitle: "Live Metrics",
              desc: "Track active agents, request volumes, latency, error rates, and threat levels through an intuitive real-time interface.",
              color: "from-emerald-500/20 to-cyan-500/20",
              border: "border-emerald-500/20",
            },
            {
              icon: "📋",
              title: "Audit & Compliance Logs",
              subtitle: "Full Traceability",
              desc: "Immutable audit trails for every agent action. Export-ready reports for SOC2, HIPAA, and enterprise compliance needs.",
              color: "from-blue-500/20 to-purple-500/20",
              border: "border-blue-500/20",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`group relative rounded-xl border ${f.border} bg-gray-900/60 backdrop-blur p-6 hover:bg-gray-800/60 transition-all hover:-translate-y-1`}
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-0.5">{f.title}</h3>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {f.subtitle}
                </span>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Powered By */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur p-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-8">
            Powered By
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold">
                G
              </div>
              <span className="text-sm font-semibold text-gray-300">Google Gemini</span>
              <span className="text-xs text-gray-500">AI Threat Analysis</span>
            </div>
            <div className="hidden sm:block w-px h-16 bg-gray-800" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl">
                🦞
              </div>
              <span className="text-sm font-semibold text-gray-300">Veea Lobster Trap</span>
              <span className="text-xs text-gray-500">Deep Packet Inspection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 pb-20 max-w-4xl mx-auto text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-5">
          Tech Stack
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Next.js 14", "FastAPI", "Gemini 2.0", "Lobster Trap", "Tailwind CSS", "Python"].map(
            (tech) => (
              <span
                key={tech}
                className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-800 text-gray-400 bg-gray-900/50"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 text-center text-xs text-gray-600">
        AgentGuard &mdash; Enterprise Agent Control Center &middot; Built for Hackathon 2026
      </footer>
    </div>
  );
}
