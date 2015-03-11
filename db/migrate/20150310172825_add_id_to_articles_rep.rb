class AddIdToArticlesRep < ActiveRecord::Migration
  def change
    add_column :articles_reps, :id, :integer
  end
end
