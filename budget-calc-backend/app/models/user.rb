class User < ApplicationRecord
  belongs_to :budget
  has_many :jobs
end
