# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Rep.create(twitter_handle:"@honda", name: "honda")
User.create(twitter_handle:"@moon", name:"Jamal")
Pledge.create(user_id:1, rep_id: 1)

