class RepsController < ApplicationController
  def show
    @rep = Rep.find(params[:id])
  end

  def seed
    puts "hitting the rep seed rotue"
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['SEED_API_KEY']
      config.consumer_secret     = ENV['SEED_API_SECRET']
      config.access_token        = ENV["SEED_OAUTH_TOKEN"]
      config.access_token_secret = ENV["SEED_OAUTH_SECRET"]
    end

    reps = Rep.all.each_slice(100).to_a
    reps.each do |one_hundred_reps| #=> reps = [[rep1, rep2...], [rep101,rep102...],rep[201...]...]
      hundred_twit_handles = one_hundred_reps.map {|rep| rep.twitter_handle}
      twitter_objects = client.users(hundred_twit_handles)
      save_images_to_reps(twitter_objects)
    end
    redirect_to root_url
  end

  def save_images_to_reps(twitter_objects)
    # save the image urls to the twitter_object.
    twitter_objects.each do |twitter_object|
      this_rep = Rep.find_by(twitter_handle: twitter_object.screen_name.downcase)

      next if this_rep == nil
      this_rep.thumbnail_url = twitter_object.profile_image_url.to_s
      this_rep.big_pic_url = twitter_object.profile_image_url.to_s.gsub("_normal", "")
      this_rep.save!
    end

  end

end
