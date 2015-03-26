class Article < ActiveRecord::Base
  validates :url, :title, :excerpt, uniqueness: true
  
  has_many :pledges

  has_many :articles_reps
  has_many :reps, :through => :articles_reps

  after_validation :check_errors


  def check_errors
    if self.errors.any?
      puts "THERE WERE ERRORS WITH ARTICLE CREATION OR POSSIBLY DUPLICATE ARTICLE"
      puts self.reps
    else
      puts "NO ERRORS w/ ARTICLE CREATION"
    end
  end
end
