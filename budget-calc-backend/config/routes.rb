Rails.application.routes.draw do
  get '/budgets' => 'budgets#index'
  get '/budgets/:id' => 'budgets#show'
  patch '/budgets/:id' => 'budgets#update'

  get '/users' => 'users#index'
  post '/users' => 'users#create'
  delete '/users/:id' => 'users#delete'

  post '/jobs' => 'jobs#create'
  delete '/jobs/:id' => 'jobs#delete'

  get '/expenses' => 'expenses#index'
  post '/expenses' => 'expenses#create'
  delete '/expenses/:id' => 'expenses#delete'

  get '/debts' => 'debts#index'
  post '/debts' => 'debts#create'
  delete '/debts/:id' => 'debts#delete'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
