class Article < ActiveRecord::Base

  has_many :pledges

  has_many :articles_reps
  has_many :reps, :through => :articles_reps

  after_validation :check_errors

  after_create :get_bitly


  def check_errors
    if self.errors.any?
      puts "THERE WERE ERRORS WITH ARTICLE CREATION OR POSSIBLY DUPLICATE ARTICLE"
      puts self.reps
    else
      puts "NO ERRORS w/ ARTICLE CREATION"
    end
  end

  def get_bitly
    response = HTTParty.get("https://api-ssl.bitly.com/v3/shorten?access_token=#{ENV['BITLY_TOKEN']}&longUrl=#{self.url}")

    self.bitly = response['data']['url']
    self.save
  end
end
