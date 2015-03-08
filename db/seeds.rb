# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def seed_reps
  x = 1
  response_array = []
  11.times do
    response_array << HTTParty.get("http://congress.api.sunlightfoundation.com/legislators?per_page=50&page=#{x}&apikey=db117ccbb61e4b82abc74d37a9b58ed2")

    x +=1
  end

  response_array.each do |page|
    page['results'].each do |rep|
      json = rep
      name = rep["first_name"] + ' ' + rep["last_name"]
      fec_id = rep["fec_ids"]
      twitter_handle = rep['twitter_id']
      twitter_handle = twitter_handle.downcase if twitter_handle
      external_url = rep['website']
      default_image = "/images/no-avatar.jpg"

      Rep.create(name: name, fec_id: fec_id, twitter_handle: twitter_handle, external_url: external_url, json: json,
        thumbnail_url: default_image)
    end
  end
end



def create_jamal
  User.create(twitter_handle:'jmoon018', name: "Jamal Moon", zipcode: nil, provider: nil, uid: nil, profile_pic_thumb_url: "https://abs.twimg.com/sticky/default_profile_images/default_profile_6_normal.png", profile_pic_big_url: "https://abs.twimg.com/sticky/default_profile_images/default_profile_6.png")
end

# called seeding methods
10.times {create_jamal}
seed_reps if Rep.count < 20
create_pledges_with_messages({num_pledges: 20})
