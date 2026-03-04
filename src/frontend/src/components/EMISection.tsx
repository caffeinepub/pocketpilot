import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, Calendar, IndianRupee, Percent } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { formatINR } from "../utils/format";

interface EMIResult {
  emi: number;
  totalPayable: number;
  totalInterest: number;
  principal: number;
}

export default function EMISection() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [result, setResult] = useState<EMIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateEMI = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const P = Number.parseFloat(principal);
    const annualRate = Number.parseFloat(rate);
    const N = Number.parseInt(months, 10);

    if (!P || Number.isNaN(P) || P <= 0) {
      setError("Enter a valid principal amount");
      return;
    }
    if (!annualRate || Number.isNaN(annualRate) || annualRate <= 0) {
      setError("Enter a valid annual interest rate");
      return;
    }
    if (!N || Number.isNaN(N) || N <= 0) {
      setError("Enter a valid number of months");
      return;
    }

    const R = annualRate / 12 / 100;
    const powerTerm = (1 + R) ** N;
    const emi = (P * R * powerTerm) / (powerTerm - 1);
    const totalPayable = emi * N;
    const totalInterest = totalPayable - P;

    setResult({ emi, totalPayable, totalInterest, principal: P });
  };

  const principalPct = result
    ? (result.principal / result.totalPayable) * 100
    : 0;
  const interestPct = result
    ? (result.totalInterest / result.totalPayable) * 100
    : 0;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Calculator className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="font-display text-base font-semibold">EMI Calculator</h2>
      </div>

      <form onSubmit={calculateEMI} className="space-y-3">
        {/* Principal */}
        <div className="space-y-1.5">
          <Label
            htmlFor="emi-principal"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Principal Amount (₹)
          </Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              id="emi-principal"
              data-ocid="emi.principal.input"
              type="number"
              placeholder="e.g. 500000"
              value={principal}
              onChange={(e) => {
                setPrincipal(e.target.value);
                setResult(null);
                setError(null);
              }}
              min="1"
              className="pl-8 bg-background/50 border-border/70 focus:border-primary placeholder:text-muted-foreground/50 font-mono"
            />
          </div>
        </div>

        {/* Rate */}
        <div className="space-y-1.5">
          <Label
            htmlFor="emi-rate"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Annual Interest Rate (%)
          </Label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              id="emi-rate"
              data-ocid="emi.rate.input"
              type="number"
              placeholder="e.g. 8.5"
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
                setResult(null);
                setError(null);
              }}
              min="0.01"
              max="100"
              step="0.01"
              className="pl-8 bg-background/50 border-border/70 focus:border-primary placeholder:text-muted-foreground/50 font-mono"
            />
          </div>
        </div>

        {/* Months */}
        <div className="space-y-1.5">
          <Label
            htmlFor="emi-months"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Loan Tenure (Months)
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              id="emi-months"
              data-ocid="emi.months.input"
              type="number"
              placeholder="e.g. 60"
              value={months}
              onChange={(e) => {
                setMonths(e.target.value);
                setResult(null);
                setError(null);
              }}
              min="1"
              step="1"
              className="pl-8 bg-background/50 border-border/70 focus:border-primary placeholder:text-muted-foreground/50 font-mono"
            />
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          data-ocid="emi.calculate_button"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-2.5 transition-all"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Calculate EMI
        </Button>
      </form>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            key="emi-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            data-ocid="emi.result.card"
            className="mt-5"
          >
            <Separator className="mb-5 bg-border/50" />

            {/* Monthly EMI hero */}
            <div className="text-center mb-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                Monthly EMI
              </p>
              <p className="font-display text-4xl font-bold text-primary tracking-tight">
                {formatINR(result.emi)}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                for {months} months
              </p>
            </div>

            {/* Breakdown grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted/20 rounded-xl p-3 border border-border/40">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Total Payable
                </p>
                <p className="font-mono font-bold text-sm text-foreground">
                  {formatINR(result.totalPayable)}
                </p>
              </div>
              <div className="bg-muted/20 rounded-xl p-3 border border-border/40">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Total Interest
                </p>
                <p className="font-mono font-bold text-sm text-foreground">
                  {formatINR(result.totalInterest)}
                </p>
              </div>
            </div>

            {/* Visual breakdown bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 rounded-full overflow-hidden bg-muted/30 flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${principalPct}%` }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="h-full rounded-l-full bg-primary"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${interestPct}%` }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="h-full rounded-r-full"
                  style={{ background: "oklch(0.62 0.22 280)" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Principal {principalPct.toFixed(1)}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ background: "oklch(0.62 0.22 280)" }}
                  />
                  Interest {interestPct.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
