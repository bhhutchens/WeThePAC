class CreatePledges < ActiveRecord::Migration
  def change
    create_table :pledges do |t|
      t.integer :user_id
      t.integer :rep_id
      t.string :tweet_id
      t.text :tweet_message
      t.boolean :fulfilled, default: :false
      t.boolean :positive
      t.string :user_thumbnail_url
      t.string :rep_thumbnail_url
      t.string :user_name
      t.string :rep_name
      t.string :rep_external_url
      t.string :user_twitter_handle
      t.string :rep_twitter_handle

      t.timestamps null: false
    end
  end
end
