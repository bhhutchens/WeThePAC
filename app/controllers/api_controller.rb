class ApiController < ApplicationController
  def show_rep
    puts "showing rep api"
    render json: Rep.find(params[:id]), status: 200
  end

  def show_user
    render json: User.find(params[:id]), status: 200
  end

  def create_tweet
    current_user.tweet(api_params['message'])
    render json: {tweet: 'sent'}
  end

  def api_params
    params.require(:tweet).permit(:message)
  end
end
