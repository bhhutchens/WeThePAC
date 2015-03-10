class Rep < ActiveRecord::Base
  has_many :pledges
  has_many :articles
end

