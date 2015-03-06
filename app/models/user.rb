class User < ActiveRecord::Base
  has_many :pledges
end
