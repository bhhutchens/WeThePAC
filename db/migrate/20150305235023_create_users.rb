class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :twitter_handle
      t.string :name
      t.string :zipcode
      t.string :provider
      t.string :uid
      t.text :profile_pic_thumb_url
      t.text :profile_pic_big_url

      t.timestamps null: false
    end
  end
end
