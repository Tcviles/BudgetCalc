class BudgetsController < ApplicationController
  def index
    budgets = Budget.all
    render json: BudgetSerializer.new(budgets).to_serialized_json
  end

  def show
    budget = Budget.find_by(id: params[:id])
    render json: BudgetSerializer.new(budget).to_serialized_json
  end

  def update
    budget = Budget.find_by(id: params[:id])
    budget.priority = params[:priority]
    budget.save
    render json: BudgetSerializer.new(budget).to_serialized_json
  end
end
