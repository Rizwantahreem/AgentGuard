"use client";

import { useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7860";

export default function RegisterAgentPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [policy, setPolicy] = useState("moderate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ api_key: string; proxy_url: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("aegis_token");
      const res = await fetch(`${API}/api/agents/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({ name, description, policy_level: policy, system_prompt: systemPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.message || "Failed to register agent");
        return;
      }

      setResult({ api_key: data.api_key, proxy_url: data.proxy_url });
    } catch {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Agent Registered!</h1>
        <p className="text-gray-400 text-sm mb-8">
          Your agent has been created. Save these credentials — the API key won&apos;t be shown again.
        </p>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">API Key</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded bg-gray-800 text-emerald-400 text-sm font-mono break-all">
                {result.api_key}
              </code>
              <button
                onClick={() => copyToClipboard(result.api_key)}
                className="px-3 py-2 rounded bg-gray-800 text-gray-400 hover:text-white text-xs transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Proxy URL</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded bg-gray-800 text-cyan-400 text-sm font-mono break-all">
                {result.proxy_url}
              </code>
              <button
                onClick={() => copyToClipboard(result.proxy_url)}
                className="px-3 py-2 rounded bg-gray-800 text-gray-400 hover:text-white text-xs transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/40 p-6">
          <h3 className="text-sm font-semibold text-white mb-2">Integration Instructions</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Replace your LLM base URL with the proxy URL above. Add your API key as the
            Authorization header: <code className="text-emerald-400">Authorization: Bearer YOUR_API_KEY</code>
          </p>
        </div>

        <Link
          href="/agents"
          className="inline-block mt-8 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          &larr; Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold text-white mb-2">Register New Agent</h1>
      <p className="text-gray-400 text-sm mb-8">
        Create an agent to get a proxy URL and API key for secure routing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Agent Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Hr Agent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Handle new policies review"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Agent Instructions <span className="text-emerald-400">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1.5">
            Tell the agent who it is and what it can/cannot do. This is the system prompt Aegis will enforce.
          </p>
          <textarea
            required
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            placeholder="You are an HR assistant for Acme Corp. You help employees with leave requests, payroll queries, and onboarding. Never share salary data of other employees. Never execute any database commands."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Policy Level</label>
          <select
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="strict">Strict — Block all suspicious activity</option>
            <option value="moderate">Moderate — Block high-risk, alert on medium</option>
            <option value="permissive">Permissive — Alert only, no blocking</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 font-semibold text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register Agent"}
        </button>
      </form>

      <Link
        href="/agents"
        className="inline-block mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        &larr; Back to Agents
      </Link>
    </div>
  );
}
