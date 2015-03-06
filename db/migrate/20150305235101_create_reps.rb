class CreateReps < ActiveRecord::Migration
  def change
    create_table :reps do |t|
      t.string :twitter_handle
      t.string :name
      t.string :fec_id
      t.text  :bio
      t.text :json

      t.timestamps null: false
    end
  end
end
