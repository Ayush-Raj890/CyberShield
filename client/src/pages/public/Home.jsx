import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white px-6 py-20 md:py-28">
        <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.25em] text-cyan-200 text-xs mb-4">
              Cybersecurity Made Simple
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
              CyberShield
            </h1>
            <p className="text-slate-100/90 md:text-lg leading-relaxed max-w-2xl">
              A guided security platform to report cyber incidents, analyze suspicious
              messages with AI, learn from verified resources, and contribute to a
              trusted community.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn btn-primary" onClick={() => navigate("/login")}>
                Get Started
              </button>
              <button className="btn" onClick={() => navigate("/ai")}>
                Try AI Detector
              </button>
              <button className="btn" onClick={() => navigate("/articles")}>
                Explore Knowledge Hub
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur p-5">
              <p className="text-xs uppercase tracking-wide text-cyan-100 mb-1">Step 1</p>
              <h3 className="font-bold">Use Public Tools</h3>
              <p className="text-sm text-slate-100/90 mt-1">
                Start with AI Scam Detector and Knowledge Hub without login.
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur p-5">
              <p className="text-xs uppercase tracking-wide text-cyan-100 mb-1">Step 2</p>
              <h3 className="font-bold">Register and Verify</h3>
              <p className="text-sm text-slate-100/90 mt-1">
                Create an account and verify email with OTP to unlock reporting features.
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur p-5">
              <p className="text-xs uppercase tracking-wide text-cyan-100 mb-1">Step 3</p>
              <h3 className="font-bold">Report, Track, and Collaborate</h3>
              <p className="text-sm text-slate-100/90 mt-1">
                Submit incidents, monitor status, and engage with the community roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-black text-center mb-3">How To Use CyberShield</h2>
        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
          Follow this simple flow to move from awareness to action in under 5 minutes.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="card">
            <h3 className="font-semibold mb-2">1. Explore Public Modules</h3>
            <p className="text-sm text-slate-600">
              Open AI Detector and Knowledge Hub to assess threats and learn prevention techniques.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">2. Secure Your Account</h3>
            <p className="text-sm text-slate-600">
              Register, complete OTP email verification, then login to activate private tools.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">3. Take Action</h3>
            <p className="text-sm text-slate-600">
              File incidents with evidence, track updates, and contribute to collective defense.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">Platform Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="card">
              <h3 className="font-semibold mb-2">Incident Reporting</h3>
              <p className="text-sm text-slate-600">
                Report phishing, scams, or harassment with optional anonymity and evidence uploads.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">AI Threat Detection</h3>
              <p className="text-sm text-slate-600">
                Analyze suspicious content with quick SAFE/SUSPICIOUS/MALICIOUS classification.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Knowledge Hub</h3>
              <p className="text-sm text-slate-600">
                Read vetted cybersecurity guidance and community-submitted educational articles.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Community Forum Access</h3>
              <p className="text-sm text-slate-600">
                Join live community discussions, ask questions, and share threat prevention tips.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Privacy-first Handling</h3>
              <p className="text-sm text-slate-600">
                Sensitive reports are protected with encryption and admin-only handling workflows.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Admin Moderation</h3>
              <p className="text-sm text-slate-600">
                Strong moderation keeps the ecosystem trustworthy, safe, and abuse-resistant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="card border-l-4 border-l-blue-600">
          <h2 className="text-2xl font-black mb-2">How To Access The Community Forum</h2>
          <p className="text-slate-600 mb-4 text-sm">
            The forum is now available at `/forum` with public viewing and authenticated posting.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold mb-1">1. Register + Verify OTP</p>
              <p className="text-slate-600">Create account and verify your email to unlock community access.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold mb-1">2. Visit Forum</p>
              <p className="text-slate-600">Open `/forum` from navbar or dashboard to read all posts publicly.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold mb-1">3. Post and Reply</p>
              <p className="text-slate-600">Login is required for creating posts and replies, while reading stays public.</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => navigate("/register")}>Create Account</button>
            <button className="btn" onClick={() => navigate("/login")}>Login</button>
            <button className="btn" onClick={() => navigate("/forum")}>Open Forum</button>
          </div>
        </div>
      </section>

      <section className="px-6 pb-14 text-center">
        <h2 className="text-3xl font-black mb-4">Start Protecting Yourself Today</h2>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Take the first step now: analyze suspicious content instantly or activate your account for full protection.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => navigate("/ai")}>
            Try AI Detector
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Create Account
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/articles")}>
            Read Security Guides
          </button>
        </div>
      </section>
    </div>
  );
}
