class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user
  # http://stackoverflow.com/questions/14734243/rails-csrf-protection-angular-js-protect-from-forgery-makes-me-to-log-out-on
  after_filter :cors_set_access_control_headers#, :set_csrf_cookie_for_ng

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end


  def cors_set_access_control_headers
    puts "Calling set access control headers"
    puts "="*100
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token, Auth-Token, Email'
    response.headers['Access-Control-Max-Age'] = "1728000"
  end

  def route_options
    puts "in route_options"
    cors_preflight_check
  end

  def cors_preflight_check
    puts "="*100 + "\nin cors_preflight_check"
    if request.method == 'OPTIONS'
      request.headers['Access-Control-Allow-Origin'] = '*'
      request.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
      request.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version, Token, Auth-Token, Email'
      request.headers['Access-Control-Max-Age'] = '1728000'
      render :text => '', :content_type => 'text/plain'
    end
  end

  # For specific problem with angular ajax actions
  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  # In Rails 4.1 and below
  def verified_request?
    super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
  end
end
