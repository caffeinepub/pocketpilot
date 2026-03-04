import { Toaster } from "@/components/ui/sonner";
import { Wallet } from "lucide-react";
import { motion } from "motion/react";
import AffiliateSection from "./components/AffiliateSection";
import EMISection from "./components/EMISection";
import ExpenseSection from "./components/ExpenseSection";

export default function App() {
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gradient leading-none tracking-tight">
              PocketPilot
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track expenses. Plan smarter.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content — single scrolling page */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ExpenseSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <EMISection />
        </motion.div>
      </main>

      {/* Affiliate + Footer */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-6">
        <AffiliateSection />
      </div>

      <footer className="border-t border-border/40 py-4">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear}. Built with{" "}
            <span className="text-destructive">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
