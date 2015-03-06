class CreateReps < ActiveRecord::Migration
  def change
    create_table :reps do |t|
      t.string :twitter_handle
      t.string :name
      t.integer :fec_id
      t.text  :bio

      t.timestamps null: false
    end
  end
end
