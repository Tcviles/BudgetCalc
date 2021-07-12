# README

Built using Rails 6.1.3.2

To run, clone this repo, cd into budget-calc-backend and run "rails s".
Open budget-calc-frontend/index.html in your browser.

TODO List:
V1
- Update an individual users income as jobs are added.
- Update total income as users are added.
- Order expense cards by Budget Priority (Debts first, then Expenses)
- Update Styling.

V2
- Ability to update Income information (Pay Raise for example)
- Ability to type "Weekly" or "BiWeekly" in the NewIncomeForm
- Implement Plan section
- - Show the primary expense to pay off based on budget priority
- - Calculate and show the amount of interest paid per month
- - Section of card or cards due date is next.

V3
- Authentication
- Plan
- - Show what bill to pay with what Income in order to have leftover cash be even per week.
- - - Example (VA Pays 400 once per month on the 1st, should go towards a bill less than but close to 400$ near the first of the month.)

V4
- Ability to have multiple budgets
