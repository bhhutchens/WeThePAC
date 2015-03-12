# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path
Rails.application.config.assets.precompile += %w( users.js )
Rails.application.config.assets.precompile += %w( reps.js )
Rails.application.config.assets.precompile += %w( tweet.js )
Rails.application.config.assets.precompile += %w( welcome.js )
Rails.application.config.assets.precompile += %w( articles.js )
Rails.application.config.assets.precompile += %w( header-search-bar.js )
Rails.application.config.assets.precompile += %w( curtains.js )

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
