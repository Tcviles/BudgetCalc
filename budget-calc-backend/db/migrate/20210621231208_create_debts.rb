class CreateDebts < ActiveRecord::Migration[6.1]
  def change
    create_table :debts do |t|
      t.string :name
      t.string :balance
      t.string :interest_rate
      t.string :payment_date
      t.string :minimum_payment
      t.references :budget, null: false, foreign_key: true

      t.timestamps
    end
  end
end
