class Article < ActiveRecord::Base
  validates :url, uniqueness: true
  has_many :pledges

  has_many :articles_reps
  has_many :reps, :through => :articles_reps
end
