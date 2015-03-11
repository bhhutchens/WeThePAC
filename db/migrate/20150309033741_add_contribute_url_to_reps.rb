class AddContributeUrlToReps < ActiveRecord::Migration
  def change
    add_column :reps, :contribute_url, :string
  end
end
