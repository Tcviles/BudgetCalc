Rails.application.routes.draw do
  get '/budgets' => 'budgets#index'
  get '/budgets/:id' => 'budgets#show'
  patch '/budgets/:id' => 'budgets#update'

  get '/users' => 'users#index'
  get '/users/:id' => 'users#show'
  post '/users' => 'users#create'
  delete '/users/:id' => 'users#delete'

  get '/jobs' => 'jobs#index'
  get '/jobs/:id' => 'jobs#show'
  post '/jobs' => 'jobs#create'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
