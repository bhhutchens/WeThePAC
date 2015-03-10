class Article < ActiveRecord::Base
  validates :url, uniqueness: true
  has_many :pledges
  belongs_to :rep
end
