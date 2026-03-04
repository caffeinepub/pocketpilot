import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  IndianRupee,
  Loader2,
  Plus,
  Receipt,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddExpense,
  useDeleteExpense,
  useGetExpenses,
} from "../hooks/useQueries";
import { formatINR } from "../utils/format";

export default function ExpenseSection() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const { data: expenses, isLoading } = useGetExpenses();
  const addExpense = useAddExpense();
  const deleteExpense = useDeleteExpense();

  const total = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const parsedAmount = Number.parseFloat(amount);

    if (!trimmedTitle) {
      toast.error("Please enter an expense title");
      return;
    }
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      await addExpense.mutateAsync({
        title: trimmedTitle,
        amount: parsedAmount,
        date: today,
      });
      setTitle("");
      setAmount("");
      toast.success("Expense added");
    } catch {
      toast.error("Failed to save expense");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteExpense.mutateAsync(id);
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Expense */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="font-display text-base font-semibold">Add Expense</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="expense-title"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Title
            </Label>
            <Input
              id="expense-title"
              data-ocid="expense.title.input"
              type="text"
              placeholder="e.g. Groceries, Electricity Bill..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={addExpense.isPending}
              className="bg-background/50 border-border/70 focus:border-primary placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="expense-amount"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Amount (₹)
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="expense-amount"
                data-ocid="expense.amount.input"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                disabled={addExpense.isPending}
                className="pl-8 bg-background/50 border-border/70 focus:border-primary placeholder:text-muted-foreground/50 font-mono"
              />
            </div>
          </div>

          <Button
            type="submit"
            data-ocid="expense.add_button"
            disabled={addExpense.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-2.5 transition-all"
          >
            {addExpense.isPending ? (
              <span
                data-ocid="expense.loading_state"
                className="flex items-center justify-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Expense List */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Receipt className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="font-display text-base font-semibold">All Expenses</h2>
        </div>

        {isLoading ? (
          <div data-ocid="expense.loading_state" className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="w-8 h-8 rounded-lg bg-muted/40" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-2/5 bg-muted/40" />
                  <Skeleton className="h-3 w-1/4 bg-muted/30" />
                </div>
                <Skeleton className="h-4 w-20 bg-muted/40" />
              </div>
            ))}
          </div>
        ) : !expenses || expenses.length === 0 ? (
          <div
            data-ocid="expense.empty_state"
            className="text-center py-8 text-muted-foreground"
          >
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No expenses yet. Add one above.</p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {expenses.map((expense, index) => (
                <motion.div
                  key={expense.id.toString()}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  data-ocid={`expense.item.${index + 1}`}
                  className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {expense.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground/60">
                        {expense.date}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-sm font-semibold text-foreground flex-shrink-0">
                    {formatINR(expense.amount)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ocid={`expense.delete_button.${index + 1}`}
                    onClick={() => handleDelete(expense.id)}
                    disabled={deleteExpense.isPending}
                    className="w-8 h-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 flex-shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all"
                    aria-label={`Delete ${expense.title}`}
                  >
                    {deleteExpense.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Total */}
            <div className="flex items-center justify-between pt-3 mt-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Total
              </p>
              <p className="font-mono font-bold text-base text-primary">
                {formatINR(total)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
