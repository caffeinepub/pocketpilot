import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetExpenses() {
  const { actor, isFetching } = useActor();
  return useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      if (!actor) return [];
      const expenses = await actor.getExpenses();
      // Sort by date descending (newest first)
      return [...expenses].sort((a, b) => b.date.localeCompare(a.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      amount,
      date,
    }: {
      title: string;
      amount: number;
      date: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addExpense(title, amount, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
