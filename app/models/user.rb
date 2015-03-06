class User < ActiveRecord::Base
  has_many :pledges

  def fulfilled_pledge_cnt
    self.pledges.where(fulfilled: true).count
  end

  def pledge_cnt
    self.pledges.count
  end

  def tweet(tweet)
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['API_KEY']
      config.consumer_secret     = ENV['API_SECRET']
      config.access_token        = oauth_token
      config.access_token_secret = oauth_secret
    end
    client.update(tweet)
  end

end
