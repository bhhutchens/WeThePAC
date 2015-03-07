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
    render json: Pledge.where(user_id: params[:user_id]), status: 200
  end

  def rep_pledges
    render json: Pledge.where(rep_id: params[:rep_id]), status: 200
  end

  def post_pledge
    puts "="*100
    puts params
    rep = Rep.find(params[:rep_id])
    pledge = Pledge.create(tweet_id: params[:tweet_id], rep_id: rep.id, user_id: current_user.id, user_twitter_handle: current_user.twitter_handle, user_thumbnail_url: current_user.profile_pic_thumb_url, rep_twitter_handle: rep.twitter_handle, positive: params[:positive], tweet_message: params[:tweet_message])

    render json: pledge, status: 200
  end

end
