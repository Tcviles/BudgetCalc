class JobSerializer
  def initialize(job)
    @job = job
  end

  def to_serialized_json
    information = {
      # include: {
      #   jobs: {
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
    @job.to_json(information)
  end 
end
