class UsersController < ApplicationController

  # users/:id
  # profile page for a specific user
  # shows their picture, twit. handle, pledge amount + fulfilled, and tweet feed
  def show
    puts "hitting users/:id route -- User ID: #{params[:id]}"
    @user = User.find(params[:id])
    #@pledges = nil

    if @user == nil
      puts "User not found.. :'("
    else
      puts "User found!"
      puts @user
      #@user.pledge_count = @user.pledges.count
      #@pledges = @user.pledges
    end
    #return @user.to_json
    # render json: @user
  end
end
