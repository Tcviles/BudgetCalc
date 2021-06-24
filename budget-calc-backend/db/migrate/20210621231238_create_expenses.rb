class CreateExpenses < ActiveRecord::Migration[6.1]
  def change
    create_table :expenses do |t|
      t.string :name
      t.string :payment_date
      t.string :minimum_payment
      t.references :budget, null: false, foreign_key: true

      t.timestamps
    end
  end
end
