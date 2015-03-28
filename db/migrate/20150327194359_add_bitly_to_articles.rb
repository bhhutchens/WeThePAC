class AddBitlyToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :bitly, :string
  end
end
