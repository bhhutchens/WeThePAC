class Pledge < ActiveRecord::Base
  belongs_to :rep
  belongs_to :user
end
