class User < ApplicationRecord
  belongs_to :budget
  has_many :jobs

  def income
    income = 0
    self.jobs.each{ |job| 
      income += job.pay_frequency.to_f * job.pay_amount.to_f
    }
    income
  end
end
