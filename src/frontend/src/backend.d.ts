import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Expense {
    id: ExpenseId;
    title: string;
    date: string;
    amount: number;
}
export type ExpenseId = bigint;
export interface backendInterface {
    addExpense(title: string, amount: number, date: string): Promise<Expense>;
    deleteExpense(id: ExpenseId): Promise<void>;
    getExpenses(): Promise<Array<Expense>>;
}
