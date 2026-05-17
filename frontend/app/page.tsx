import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-gray-950 text-lg">
            AE
          </div>
          <span className="text-xl font-bold tracking-tight">Aegis</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-32 max-w-5xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative">
          <div className="text-7xl mb-6">🛡️</div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Aegis
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl font-semibold text-gray-200">
            The AI Firewall for Enterprise Agents
          </p>
          <p className="mt-4 text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            One proxy URL. Total visibility. Zero blind spots. Route your AI agent traffic through
            Aegis and get real-time security inspection, threat blocking, and compliance audit trails.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 font-semibold text-sm tracking-wide hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-lg border border-gray-700 text-gray-300 font-medium text-sm hover:border-gray-500 hover:text-white transition-all"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 pb-28 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-center text-gray-500 mb-14 text-sm">Three steps to secure your AI agents</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Register Your Agent",
              desc: "Create an agent, get a unique proxy URL and API key.",
            },
            {
              step: "2",
              title: "Swap One Line of Code",
              desc: "Point your agent's LLM base URL to Aegis proxy.",
            },
            {
              step: "3",
              title: "Watch & Protect",
              desc: "See all traffic, threats blocked, costs tracked in real-time.",
            },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-gray-950 font-bold text-lg">
                {s.step}
              </div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-28 max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-14">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "🦞",
              title: "Deep Packet Inspection",
              desc: "Lobster Trap DPI proxy inspects every prompt and response for injections, PII leaks, and data exfiltration.",
              border: "border-red-500/20",
            },
            {
              icon: "⚡",
              title: "Real-time Threat Detection",
              desc: "13 ingress + 2 egress security rules with instant blocking and alerting.",
              border: "border-amber-500/20",
            },
            {
              icon: "📊",
              title: "Agent Monitoring Dashboard",
              desc: "Live SSE-powered dashboard showing all agent activity, token costs, and security events.",
              border: "border-emerald-500/20",
            },
            {
              icon: "📋",
              title: "Audit & Compliance",
              desc: "Full audit trail of every interaction. Export logs for SOC2, HIPAA, and GDPR compliance.",
              border: "border-blue-500/20",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`rounded-xl border ${f.border} bg-gray-900/60 backdrop-blur p-6 hover:bg-gray-800/60 transition-all hover:-translate-y-1`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 pb-28 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">Pricing</h2>
        <p className="text-center text-gray-500 mb-14 text-sm">Simple, transparent pricing for every team size</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Starter",
              price: "$99",
              period: "/mo",
              features: ["5 agents", "10K requests/mo", "Basic policies", "Email alerts"],
              highlight: false,
            },
            {
              name: "Pro",
              price: "$299",
              period: "/mo",
              features: ["25 agents", "100K requests/mo", "Custom policies", "Slack integration", "Priority support"],
              highlight: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "",
              features: ["Unlimited agents", "On-prem deployment", "SOC2 compliance", "SLA", "Dedicated support"],
              highlight: false,
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-8 flex flex-col ${
                tier.highlight
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-gray-800 bg-gray-900/40"
              }`}
            >
              <h3 className="text-lg font-bold text-white">{tier.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                <span className="text-gray-500 text-sm">{tier.period}</span>
              </div>
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tier.highlight
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 hover:from-emerald-400 hover:to-cyan-400"
                    : "border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                }`}
              >
                Get Started
              </Link>
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
              <span className="text-sm font-semibold text-gray-300">Google Gemini 2.0 Flash</span>
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

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 text-center text-xs text-gray-600">
        Built for TechEx Intelligent Enterprise Solutions Hackathon 2026
      </footer>
    </div>
  );
}
