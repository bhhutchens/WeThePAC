class Rep < ActiveRecord::Base
  has_many :pledges

  has_many :articles_reps
  has_many :articles, :through => :articles_reps
end

