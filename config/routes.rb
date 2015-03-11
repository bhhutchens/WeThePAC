Rails.application.routes.draw do

  get 'tweets/new'

  get 'tweets/create'

  get 'welcome/index'

  get 'twitter/login' => 'twitters#login'
  post 'sessions/logout' => 'sessions#destroy'

  # a route that requires a special ENV key and seeds the database with the reps' image urls
  get "seed" => "seed#seed"
  match "/auth/twitter/callback" => "sessions#create", via: [:get, :post]

  get 'welcome/search' => "welcome#zip_rep_search"

  get '/about' => 'welcome#about'

  resources :users do
    resources :pledges
  end
  resources :reps do
    resources :pledges
  end
  resources :tweets, only: [:new, :create]

  # articles
  resources :articles
  get 'api/articles' => 'api#get_articles'
  get 'api/articles/:id' => 'api#get_article'
  get 'api/articles/:id/pledges' => 'api#get_pledges_by_article'
  get 'api/articles/:id/pledges/positive' => 'api#get_positive_pledges_by_article'
  get 'api/articles/:id/pledges/negative' => 'api#get_negative_pledges_by_article'
  get 'api/reps/:rep_id/articles' => "api#reps_articles"


  root 'welcome#index'

  controller 'api' do
    match '*unmatched_route', :to => 'api#route_options', via: [:options]
  end
  # api calls to get rep and user jsons
  get 'api/reps/:id' => 'api#show_rep'
  get 'api/users/:id' => 'api#show_user'
  post 'api/pledges/' => 'api#post_pledge'
  put 'api/pledges' => 'api#update_pledge'

  get 'api/users/:user_id/pledges' => 'api#user_pledges'
  get 'api/users/:user_id/unfulfilled' => 'api#user_unfulfilled_pledges'
  get 'api/reps/:rep_id/pledges' => 'api#rep_pledges'
  get 'api/activity_feed' => 'api#activity_feed'
  post 'api/reps/search' => 'api#reps_search'

  post 'api/tweets/' => 'api#create_tweet'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
