namespace :jobs do
  desc "TODO"
  task scrape_articles: :environment do
    ArticleJob.new.async.perform("scrape_article")
  end

end
