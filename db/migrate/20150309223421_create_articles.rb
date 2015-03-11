class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :url
      t.string :title
      t.text :excerpt
      t.integer :rep_id
      t.datetime :date

      t.timestamps null: false
    end
  end
end
