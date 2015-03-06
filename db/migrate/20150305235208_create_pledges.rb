class CreatePledges < ActiveRecord::Migration
  def change
    create_table :pledges do |t|
      t.integer :user_id
      t.integer :rep_id
      t.integer :tweet_id
      t.text :tweet_message
      t.boolean :fulfilled
      t.boolean :positive

      t.timestamps null: false
    end
  end
end
