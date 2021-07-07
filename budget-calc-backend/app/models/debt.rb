class Debt < ApplicationRecord
  belongs_to :budget

  def self.sortByPriority(priority)
    if priority == "Interest"
      return self.all.sort_by {|debt| debt.interest_rate}
    end
    if priority == "Payment"
      puts Date.today
      return self.all.sort_by {|debt| debt.balance.to_f}
    end
  end
end
