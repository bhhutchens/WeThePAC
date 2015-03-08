Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV["API_KEY"], ENV["API_SECRET"],
  {
    :secure_image_url => 'true',
    :image_size => 'original',
    :authorize_params => {
      :force_login => 'true',
      :lang => 'en'
    }
  }
end
