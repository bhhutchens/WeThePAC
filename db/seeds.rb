# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

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

    Rep.create(name: name, fec_id: fec_id, twitter_handle: twitter_handle, json: json)
  end
end


# Rep.create(twitter_handle:"@honda", name: "honda")
# User.create(twitter_handle:"@moon", name:"Jamal")
# Pledge.create(user_id:1, rep_id: 1)
# Rep.create(twitter_handle:"@Pelosi", name:"Nancy Pelosi")

