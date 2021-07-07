class CreateJobs < ActiveRecord::Migration[6.1]
  def change
    create_table :jobs do |t|
      t.string :company
      t.string :title
      t.float :pay_frequency
      t.float :pay_amount
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
