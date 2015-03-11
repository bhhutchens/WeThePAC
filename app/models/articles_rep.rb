class ArticlesRep < ActiveRecord::Base
  belongs_to :rep
  belongs_to :article

  # unique pair -- rep_id and article_id
  validates_uniqueness_of :rep_id, :scope => [:article_id]
end

