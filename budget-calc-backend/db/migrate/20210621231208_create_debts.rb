class CreateDebts < ActiveRecord::Migration[6.1]
  def change
    create_table :debts do |t|
      t.string :name
      t.string :last_paid
      t.integer :payment_date
      t.float :balance
      t.float :interest_rate
      t.float :minimum_payment
      t.references :budget, null: false, foreign_key: true

      t.timestamps
    end
  end
end
