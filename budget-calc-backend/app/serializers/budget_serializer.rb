class BudgetSerializer
  def initialize(budget_object)
    @budget = budget_object
  end

  def to_serialized_json
    information = {
      include: {
        users: {
          only: [:id, :name, :income],
          include: {
            jobs: {
              # only: [:company, :pay_frequency, :pay_amount]
              except: [:created_at, :updated_at]
            }
          },
          except: [:created_at, :updated_at]
        }, 
        debts: {
          # only: [:name, :balance, :minimum_payment]
          except: [:created_at, :updated_at]
        },
        expenses: {
          # only: [:name, :minimum_payment]
          except: [:created_at, :updated_at]
        }
      },
      except: [:created_at, :updated_at]
    }
    @budget.to_json(information)
  end
end
