class RepsController < ApplicationController
  def show
    @rep = Rep.find(params[:id])
  end
end
