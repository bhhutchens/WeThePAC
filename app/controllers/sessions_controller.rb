class SessionsController < ActionController::Base
  def create
    puts auth_object = request.env['omniauth.auth']
    auth_info = request.env['omniauth.auth'].info
    raw_info = request.env['omniauth.auth'].extra.raw_info
    name = auth_info.name
    uid = auth_object.uid
    puts profile_pic_thumb_url = raw_info.profile_image_url_https
    puts profile_pic_big_url = auth_info.image
    twitter_handle = auth_info.nickname

    unless user = User.find_by(twitter_handle: twitter_handle)
      user = User.create(
        twitter_handle: twitter_handle,
        name: name,
        uid: uid,
        profile_pic_thumb_url: profile_pic_thumb_url,
        profile_pic_big_url: profile_pic_big_url
        )
    end
    session[:user_id] = user.id
    user.oauth_token = auth_object.credentials.token
    user.oauth_secret = auth_object.credentials.secret
    user.save!

    redirect_to root_url, :notice => "Signed in!"
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end
