class RemoveIdFromArticlesRep < ActiveRecord::Migration
  def change
    remove_column :articles_reps, :id, :integer
  end
end
