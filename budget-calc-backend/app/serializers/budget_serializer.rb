class BudgetSerializer
  def initialize(budget_object)
    @budget = budget_object
  end

  def to_serialized_json
    information = {
      include: {
        users: {
          only: [:id, :name],
          include: {
            jobs: {
              # only: [:company, :pay_frequency, :pay_amount]
            }
          }
        }, 
        debts: {
          # only: [:name, :balance, :minimum_payment]
        },
        expenses: {
          # only: [:name, :minimum_payment]
        }
      },
      except: [:created_at, :updated_at]
    }
    @budget.to_json(information)
  end
end
