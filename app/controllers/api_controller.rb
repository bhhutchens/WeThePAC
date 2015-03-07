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
    Pledge.create()

  end

end
