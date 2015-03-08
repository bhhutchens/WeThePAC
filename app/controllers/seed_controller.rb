class SeedController < ApplicationController

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

    seed_pledges
    redirect_to root_url
  end

  def seed_pledges(args={})
    num_pledges = args[:num_pledges] || 50
    num_pledges.times do
      user = User.all.sample
      rep = Rep.all.sample
      rep.pledges.create(user_id: user.id, user_twitter_handle: user.twitter_handle, user_name: user.name, user_thumbnail_url: user.profile_pic_thumb_url, tweet_message: Faker::Hacker.say_something_smart, positive: [true, true, false].sample, rep_thumbnail_url: rep.thumbnail_url, rep_name: rep.name, rep_external_url: rep.external_url, rep_twitter_handle: rep.twitter_handle)
    end

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
