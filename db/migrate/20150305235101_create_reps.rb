class CreateReps < ActiveRecord::Migration
  def change
    create_table :reps do |t|
      t.string :twitter_handle
      t.string :name
      t.string :fec_id
      t.text :bio
      t.text :json
      t.string :thumbnail_url
      t.string :big_pic_url
      t.string :external_url

      t.timestamps null: false
    end
  end
end
