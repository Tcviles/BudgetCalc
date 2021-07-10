class ExpensesController < ApplicationController
  def index
    expenses = Expense.all
    render json: ExpenseSerializer.new(expenses).to_serialized_json
  end

  def create
    budget = Budget.find_by(id: params[:budgetId])
    if !!budget
      name = params[:name]
      minimumPayment = params[:minimumPayment] 
      paymentDate = params[:paymentDate]
      newExpense = Expense.create(name: name, minimum_payment:minimumPayment, payment_date:paymentDate, budget_id: budget.id)
      render json: ExpenseSerializer.new(newExpense).to_serialized_json
    end
  end

  # TODO: add check if payment was already made for today.
  def update
    expense = Expense.find_by(id: params[:id])
    if params[:lastPaid] == "today"
      expense.last_paid = Date.today.to_s(:short)
    end
    expense.save
    render json: ExpenseSerializer.new(expense).to_serialized_json
  end

  def delete
    expense = Expense.find_by(id: params[:id])
    expense.destroy

    render json: ExpenseSerializer.new(expense).to_serialized_json
  end
end
