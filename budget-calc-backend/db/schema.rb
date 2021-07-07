# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_06_21_231238) do

  create_table "budgets", force: :cascade do |t|
    t.string "priority"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "debts", force: :cascade do |t|
    t.string "name"
    t.string "last_paid"
    t.integer "payment_date"
    t.float "balance"
    t.float "interest_rate"
    t.float "minimum_payment"
    t.integer "budget_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["budget_id"], name: "index_debts_on_budget_id"
  end

  create_table "expenses", force: :cascade do |t|
    t.string "name"
    t.string "last_paid"
    t.integer "payment_date"
    t.float "minimum_payment"
    t.integer "budget_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["budget_id"], name: "index_expenses_on_budget_id"
  end

  create_table "jobs", force: :cascade do |t|
    t.string "company"
    t.string "title"
    t.float "pay_frequency"
    t.float "pay_amount"
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_jobs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.float "income"
    t.integer "budget_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["budget_id"], name: "index_users_on_budget_id"
  end

  add_foreign_key "debts", "budgets"
  add_foreign_key "expenses", "budgets"
  add_foreign_key "jobs", "users"
  add_foreign_key "users", "budgets"
end
