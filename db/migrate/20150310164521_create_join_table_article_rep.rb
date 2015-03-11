class CreateJoinTableArticleRep < ActiveRecord::Migration
  def change
    create_join_table :articles, :reps do |t|
      # t.index [:article_id, :rep_id]
      # t.index [:rep_id, :article_id]
    end
  end
end
