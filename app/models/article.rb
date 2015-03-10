class Article < ActiveRecord::Base
  validates :url, uniqueness: true
  has_many :pledges

  has_many :articles_reps
  has_many :reps, :through => :articles_reps

  after_validation :check_errors


  def check_errors
    if self.errors.any?
      puts "THERE WERE ERRORS w/ ARTICLE CREATION"
      puts self.reps
    else
      puts "NO ERRORS w/ ARTICLE CREATION"
    end
  end
end
