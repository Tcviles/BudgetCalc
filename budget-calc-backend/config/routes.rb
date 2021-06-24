Rails.application.routes.draw do
  get '/budgets' => 'budgets#index'
  get '/budgets/:id' => 'budgets#show'
  get '/users' => 'users#index'
  get '/users/:id' => 'users#show'
  get '/jobs' => 'jobs#index'
  get '/jobs/:id' => 'jobs#show'
  post '/jobs' => 'jobs#create'
  delete '/jobs/:id' => 'jobs#delete'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
