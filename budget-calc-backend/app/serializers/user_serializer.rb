class UserSerializer
  def initialize(user)
    @user = user
  end

  def to_serialized_json
    information = {
      # include: {
      #   users: {
      #     only: [:name, :income],
      #     include: {
      #       jobs: {
      #         only: [:company, :pay_frequency, :pay_amount]
      #       }
      #     }
      #   }, 
      #   debts: {
      #     only: [:name, :balance, :minimum_payment]
      #   },
      #   expenses: {
      #     only: [:name, :minimum_payment]
      #   }
      # },
      except: [:created_at, :updated_at]
    }
    @user.to_json(information)
  end
end
