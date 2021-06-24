class Budget < ApplicationRecord
  has_many :users
  has_many :debts
  has_many :expenses
  has_many :jobs, through: :users
end
