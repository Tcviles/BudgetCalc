class DebtsController < ApplicationController
  def index
    debts = Debt.sortByPriority("Interest")
    render json: DebtSerializer.new(debts).to_serialized_json
  end
  
  def create
    budget = Budget.find_by(id: params[:budgetId])
    if !!budget
      name = params[:name]
      minimumPayment = params[:minimumPayment] 
      paymentDate = params[:paymentDate]
      balance = params[:balance]
      interestRate = params[:interestRate]
      newDebt = Debt.create(name: name, minimum_payment:minimumPayment, payment_date:paymentDate, balance:balance, interest_rate:interestRate, budget_id: budget.id)
      render json: DebtSerializer.new(newDebt).to_serialized_json
    end
  end  

  def update
    debt = Debt.find_by(id: params[:id])
    payment = params[:paymentAmt].to_f
    debt.balance -= payment
    if params[:lastPaid] == "today"
      debt.last_paid = Date.today.to_s(:short)
    end
    debt.save
    render json: DebtSerializer.new(debt).to_serialized_json
  end

  def delete
    debt = Debt.find_by(id: params[:id])
    debt.destroy

    render json: UserSerializer.new(debt).to_serialized_json
  end
end
