class RemoveRepIdFromArticles < ActiveRecord::Migration
  def change
    remove_column :articles, :rep_id, :integer
  end
end
