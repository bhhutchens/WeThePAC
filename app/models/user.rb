class User < ActiveRecord::Base
  has_many :pledges

  def fulfilled_pledge_cnt
    self.pledges.where(fulfilled: true).count
  end

  def pledge_cnt
    self.pledges.count
  end
end
