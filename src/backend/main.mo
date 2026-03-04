import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";



actor {
  type ExpenseId = Nat;
  type Expense = {
    id : ExpenseId;
    title : Text;
    amount : Float;
    date : Text;
  };

  var nextExpenseId : ExpenseId = 0;
  let expenses = Map.empty<ExpenseId, Expense>();

  public shared ({ caller }) func addExpense(title : Text, amount : Float, date : Text) : async Expense {
    let id = nextExpenseId;
    let expense : Expense = {
      id;
      title;
      amount;
      date;
    };

    expenses.add(id, expense);
    nextExpenseId += 1;
    expense;
  };

  public query ({ caller }) func getExpenses() : async [Expense] {
    expenses.values().toArray();
  };

  public shared ({ caller }) func deleteExpense(id : ExpenseId) : async () {
    expenses.remove(id);
  };
};
