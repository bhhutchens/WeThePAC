class AddArticleIdToPledge < ActiveRecord::Migration
  def change
    add_column :pledges, :article_id, :integer
  end
end
