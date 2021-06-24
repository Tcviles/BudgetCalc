class UsersController < ApplicationController
  def create
    budget = Budget.find_by(id: params[:budgetId])
    if budget.users.size > 4
      render json: {error: "can not add anymore people"}
    else
      name = params[:name]
      jobs = []
      newUser = User.create(name: name, jobs: jobs, budget_id: budget.id)
      render json: UserSerializer.new(newUser).to_serialized_json
    end
  end

  def delete
    user = User.find_by(id: params[:id])
    user.destroy

    render json: UserSerializer.new(user).to_serialized_json
  end
end
