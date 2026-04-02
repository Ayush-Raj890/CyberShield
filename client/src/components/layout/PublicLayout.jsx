import Navbar from "./Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white/90">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">CyberShield</p>
            <p className="text-sm text-slate-600">Practical cyber defense for people, teams, and communities.</p>
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-600">
            <a href="/security-docs" className="hover:text-slate-900 transition-colors">Security Docs</a>
            <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="/contact-soc" className="hover:text-slate-900 transition-colors">Contact SOC</a>
          </div>
        </div>
      </footer>
    </div>
  );
}