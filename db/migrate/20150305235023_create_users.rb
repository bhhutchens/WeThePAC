class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :twitter_handle
      t.string :name
      t.string :password
      t.string :zipcode

      t.timestamps null: false
    end
  end
end
