import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Bot,
  BookOpenText,
  MessagesSquare,
  Lock,
  UserCog,
  Search,
  UserPlus,
  FileText,
  Eye,
  MessageSquare,
} from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import FeatureCard from "../../components/ui/FeatureCard";

const howToUseCards = [
  {
    icon: Search,
    title: "1. Explore Public Modules",
    description: "Open AI Detector and Knowledge Hub to identify suspicious wording, fake urgency, and spoofed links.",
    href: "/ai",
  },
  {
    icon: UserPlus,
    title: "2. Secure Your Account",
    description: "Register, complete OTP email verification, and activate protected reporting with account-linked history.",
    href: "/register",
  },
  {
    icon: FileText,
    title: "3. Take Action",
    description: "File incidents with evidence, follow status updates, and help strengthen shared threat awareness.",
    href: "/create-report",
  },
];

const platformFeatures = [
  {
    icon: ShieldAlert,
    title: "Incident Reporting",
    description: "Report phishing, scam, fraud, or harassment events with optional anonymity and evidence uploads.",
    href: "/create-report",
  },
  {
    icon: Bot,
    title: "AI Threat Detection",
    description: "Analyze suspicious text and messages with fast SAFE/SUSPICIOUS/MALICIOUS threat classification.",
    href: "/ai",
  },
  {
    icon: BookOpenText,
    title: "Knowledge Hub",
    description: "Read vetted cybersecurity guidance on phishing, account safety, and secure digital habits.",
    href: "/articles",
  },
  {
    icon: MessagesSquare,
    title: "Community Forum Access",
    description: "Join moderated discussions, ask incident-response questions, and share prevention strategies.",
    href: "/forum",
  },
  {
    icon: Lock,
    title: "Privacy-first Handling",
    description: "Sensitive reports are protected with encryption-backed storage and admin-only handling workflows.",
    href: "/reports",
  },
  {
    icon: UserCog,
    title: "Admin Moderation",
    description: "Active moderation and role controls keep the platform trustworthy, safe, and abuse-resistant.",
    href: "/admin",
  },
];

const forumAccessCards = [
  {
    icon: UserPlus,
    title: "1. Register + Verify OTP",
    description: "Create account and verify your email to unlock community access.",
    href: "/register",
  },
  {
    icon: Eye,
    title: "2. Visit Forum",
    description: "Open /forum from navbar or dashboard to read all posts publicly.",
    href: "/forum",
  },
  {
    icon: MessageSquare,
    title: "3. Post and Reply",
    description: "Login is required for creating posts and replies, while reading remains public.",
    href: "/login",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-200 px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-200/70 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />

        <div className="relative container-page grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <p className="uppercase tracking-[0.24em] text-blue-700 text-xs mb-4 font-semibold">
              Cybersecurity Made Simple
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-slate-900 mb-5">
              CyberShield
            </h1>
            <p className="text-slate-700 md:text-lg leading-relaxed max-w-2xl">
              A practical cybersecurity platform to report phishing, scam, and account-compromise incidents,
              triage suspicious messages with AI, and follow trusted response playbooks before threats escalate.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs sm:text-sm">
              {[
                "Phishing and scam detection",
                "Evidence-backed incident reports",
                "Community threat awareness",
              ].map((signal) => (
                <span key={signal} className="rounded-full border border-blue-200 bg-white/80 px-3 py-1 font-medium text-blue-800">
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn btn-primary animate-fade-up" style={{ animationDelay: "120ms" }} onClick={() => navigate("/login")}>
                Get Started
              </button>
              <button className="btn btn-secondary animate-fade-up" style={{ animationDelay: "220ms" }} onClick={() => navigate("/ai")}>
                Try AI Detector
              </button>
              <button
                className="px-1 py-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors animate-fade-up"
                style={{ animationDelay: "320ms" }}
                onClick={() => navigate("/articles")}
              >
                Explore Knowledge Hub
              </button>
            </div>
          </div>

          <div className="grid gap-4 animate-fade-in" style={{ animationDelay: "180ms" }}>
            <div className="rounded-2xl border border-blue-100 bg-white/90 shadow-sm p-5 animate-fade-up" style={{ animationDelay: "220ms" }}>
              <p className="text-xs uppercase tracking-wide text-blue-600 mb-1">Step 1</p>
              <h3 className="font-bold text-slate-900">Use Public Tools</h3>
              <p className="text-sm text-slate-600 mt-1">
                Start with AI Scam Detector and Knowledge Hub to scan links, SMS, and social messages without login.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white/90 shadow-sm p-5 animate-fade-up" style={{ animationDelay: "320ms" }}>
              <p className="text-xs uppercase tracking-wide text-blue-600 mb-1">Step 2</p>
              <h3 className="font-bold text-slate-900">Register and Verify</h3>
              <p className="text-sm text-slate-600 mt-1">
                Create an account, complete OTP verification, and unlock secure report tracking and updates.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white/90 shadow-sm p-5 animate-fade-up" style={{ animationDelay: "420ms" }}>
              <p className="text-xs uppercase tracking-wide text-blue-600 mb-1">Step 3</p>
              <h3 className="font-bold text-slate-900">Report, Track, and Collaborate</h3>
              <p className="text-sm text-slate-600 mt-1">
                Submit incidents with screenshots or links, monitor moderation status, and share prevention tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: "OTP Verified Accounts", desc: "Email ownership checks" },
            { title: "AI Threat Triage", desc: "Quick SAFE/SUSPICIOUS/MALICIOUS" },
            { title: "Moderated Community", desc: "Abuse-resistant discussions" },
            { title: "Evidence Upload Support", desc: "Screenshots and URLs accepted" },
          ].map((item, index) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3 animate-fade-up"
              style={{ animationDelay: `${120 + index * 100}ms` }}
            >
              <p className="text-sm font-semibold text-slate-800">{item.title}</p>
              <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-3">How To Use CyberShield</h2>
        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
          Follow this simple flow to move from awareness to action in under 5 minutes.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {howToUseCards.map((item, index) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              href={item.href}
              delay={index * 90}
            />
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 px-6 py-14">
        <div className="container-page">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-10">Platform Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {platformFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                href={feature.href}
                delay={index * 90}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-2">How To Access The Community Forum</h2>
          <p className="text-slate-600 mb-4 text-sm">
            The forum is available at /forum with public viewing and authenticated posting for incident insights.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {forumAccessCards.map((item, index) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                href={item.href}
                delay={index * 90}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => navigate("/register")}>Create Account</button>
            <button className="btn btn-secondary" onClick={() => navigate("/login")}>Login</button>
            <button className="btn btn-secondary" onClick={() => navigate("/forum")}>Open Forum</button>
          </div>
        </div>
      </section>

      <section className="px-6 pb-14 text-center">
        <div className="container-page">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Start Protecting Yourself Today</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Take the first step now: analyze suspicious content instantly or activate your account for complete reporting and tracking.
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
        </div>
      </section>
    </PublicLayout>
  );
}
