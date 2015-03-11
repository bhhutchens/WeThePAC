class ApiController < ApplicationController
  def show_rep
    puts "showing rep api"
    render json: Rep.find(params[:id]), status: 200
  end

  def show_user
    render json: User.find(params[:id]), status: 200
  end

  def create_tweet
    tweet = current_user.tweet(api_params['message'])
    render json: {tweet_id: tweet.id}
  end

  def api_params
    params.require(:tweet).permit(:message)
  end

  def user_pledges
    render json: Pledge.where(user_id: params[:user_id]).order('created_at DESC'), status: 200
  end

  def user_unfulfilled_pledges
    render json: Pledge.where(user_id: params[:user_id]).where(fulfilled: false).where(positive: true).order('created_at DESC'), status: 200
  end

  def rep_pledges
    render json: Pledge.where(rep_id: params[:rep_id]).order('created_at DESC').limit(15), status: 200
  end

  def post_pledge
    puts "="*100
    puts params
    rep = Rep.find(params[:rep_id])
    pledge = Pledge.create(tweet_id: params[:tweet_id], rep_id: rep.id, user_id: current_user.id, user_twitter_handle: current_user.twitter_handle, user_thumbnail_url: current_user.profile_pic_thumb_url, rep_twitter_handle: rep.twitter_handle, positive: params[:positive], tweet_message: params[:tweet_message], rep_thumbnail_url: rep.thumbnail_url, user_name: current_user.name, rep_name: rep.name, rep_external_url: rep.external_url)

    firebase = Firebase::Client.new("https://we-the-pac.firebaseio.com/#{rep.id}", ENV['FIREBASE_SECRET'])
    response = firebase.set('pledge', pledge)
    puts response.success? # => true
    puts response.code # => 200
    puts response.body # => { 'name' => "-INOQPH-aV_psbk3ZXEX" }
    puts response.raw_body # => '{"name":"-INOQPH-aV_psbk3ZXEX"}'

    render json: pledge, status: 200
  end

  def update_pledge
    pledge = Pledge.find(params[:pledge_id])
    pledge.fulfilled = true
    pledge.save!
    render json: pledge, status: 200
  end

  def activity_feed
    pledges = Pledge.all.order('created_at DESC').limit(10)
    render json: pledges, status: 200
  end

  # article routes
  def get_articles
    render json: Article.all.order('created_at DESC'), status: 200
  end

  def get_article
    render json: Article.find(params[:id]), status: 200
  end

  def get_pledges_by_article
    #render json: Article.find(params[:id]).pledges, status: 200
    render json: Pledge.where(rep_id: params[:rep_id]).where(article_id: params[:id]), status: 200
  end

  def get_positive_pledges_by_article
    render json: Article.find(params[:id]).pledges.where(positive: true).order("created_at DESC"), status: 200
  end

  def get_negative_pledges_by_article
    render json: Article.find(params[:id]).pledges.where(positive: false), status: 200
  end

  def reps_articles
    render json: Rep.find(params[:rep_id]).articles.order("created_at DESC"),
      status: 200
  end

  def reps_search
    puts params
    puts "="*100
    name = params[:name].split.map{|word| word.capitalize}.join(" ")
    puts "Name: " + name
    rep = Rep.find_by(name: name)
    puts "Rep name:" + rep.name
    render json: rep, status: 200
  end
end
