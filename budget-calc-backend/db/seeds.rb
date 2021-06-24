# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Budget.delete_all
User.delete_all
Job.delete_all
Debt.delete_all
Expense.delete_all

budget = Budget.create(priority: "Interest")

husband = User.create(name: "Jerry", income: 4300, budget_id: budget.id)
wife = User.create(name: "Jane", income: 200, budget_id: budget.id)

ontario = Job.create(company: "Ontario Systems", title: "Software Developer", pay_frequency: 2, pay_amount: 1900, user_id: husband.id)
army = Job.create(company: "VA", title: "Disability", pay_frequency: 1, pay_amount:400, user_id: husband.id)
outback = Job.create(company: "Outback", title: "Server", pay_frequency: 4.3, pay_amount:200, user_id: wife.id)

mortgage = Debt.create(name: "Mortgage", balance: 310000.55, interest_rate: 2.75, payment_date: 1, minimum_payment: 1414.02, budget_id: budget.id)
car = Debt.create(name: "Car", balance: 9532.32, interest_rate: 6.2, payment_date: 15, minimum_payment: 322.36, budget_id: budget.id)
electric = Expense.create(name: "Electric", payment_date: 10, minimum_payment: 150.00, budget_id: budget.id)
autoIns = Expense.create(name: "Auto Insurance", payment_date: 16, minimum_payment: 147.67, budget_id: budget.id)