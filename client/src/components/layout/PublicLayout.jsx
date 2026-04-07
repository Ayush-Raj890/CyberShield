import Navbar from "./Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />
      <main className="flex-1 page-stack">
        {children}
      </main>
      <footer className="page-section bg-white/90 dark:bg-neutral-900/90">
        <div className="container-page py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">CyberShield</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">Practical cyber defense for people, teams, and communities.</p>
          </div>
          <div className="flex items-center gap-5 text-sm text-neutral-600 dark:text-neutral-300">
            <a href="/security-docs" className="hover:text-primary-600 dark:hover:text-primary-100 transition-colors">Security Docs</a>
            <a href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-100 transition-colors">Privacy</a>
            <a href="/contact-soc" className="hover:text-primary-600 dark:hover:text-primary-100 transition-colors">Contact SOC</a>
          </div>
        </div>
      </footer>
    </div>
  );
}