class ArticlesRep < ActiveRecord::Base
  belongs_to :rep
  belongs_to :article
end

