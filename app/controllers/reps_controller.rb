class RepsController < ApplicationController
  def show
    render json: Rep.find(params[:id])
  end
end
