require 'nokogiri'
require 'open-uri'

# goal: obtain a string containing the link to a rep's personal website (MVP)
# preferably get the doante or contribute link on their website
# ________________________________
# assumptions: a google search api allows us to see what results
# pop up based on a custom query, and that we can access them

# MAKE PERSONAL WEBSITE ATTRIBUTE FOR A REP MODEL

# Steps

# 1. For each rep in database .. do:

# input: name of the rep (string)
# output: string of the url (of website or website/donate)
# 2. Call fn
#   a. formulate Google query
#      - Exclude: .gov, facebook.com, twitter.com, linkedin.com, wikipedia.com,
#         .govtrack, cspan, opensecrets.org
#      - Search "{rep's name} website -.gov -facebook.com ..."
#   b. Assume the first one is what we wanted (their personal website)
#   c. "enter" the website -- GOAL MET
#   d. find the word 'donate' or 'contribute' w/ an <a> tag
#   e. if <a> tag exists...
#     - "enter/click" the <a> tag
#     - get the url
#   f. return the url

# input: (str) url, (str) name of rep
# output: none... updates rep model.. specifically the "personal_website" field
# 3. call updateRepPersonalWebsite fn
#   a. finds the Rep by name
#   b. updates the Rep's personal website attribute based on the url argument

# end


def doRepWebsiteSearch (rep_name)
  blacklist = [".gov", "facebook.com", "twitter.com", "linkedin.com", "wikipedia.com", ".govtrack", "cspan", ".edu", "opensecrets.org"]
  rep_name += " website"
  rep_name.gsub!(" ", "%20")
  query = "http://www.google.com/search?q=#{rep_name}"
  blacklist.each do |word|
    query += "+-#{word}"
  end

  searchPage = Nokogiri::HTML(open(query))
  puts searchPage.class

  websiteLink = searchPage.css("cite")[0].text
  websiteContributeLink = ""

  #donateContributeQuery = "site:#{websiteLink}
  donateContributeQuery = ""

  if websiteLink.index("/") == nil
    donateContributeQuery = "http://www.google.com/search?q=site:#{websiteLink}/contribute+OR+site:#{websiteLink}/donate"
  else
    donateContributeQuery = "http://www.google.com/search?q=site:#{websiteLink}contribute+OR+site:#{websiteLink}donate"
  end

  donateContributeQuery.gsub(" ", "%20")
  # make new search
  searchPage = Nokogiri::HTML(open(donateContributeQuery))
  donateContributeLink = searchPage.css("cite")

  puts "getting rep: #{rep_name}"
  puts "websiteLink: #{donateContributeLink}"
  if donateContributeLink == nil
    return websiteLink
  else
    return donateContributeLink[0].text
  end
end

def doRepWebsiteSearchOld (rep_name)
  blacklist = [".gov", "facebook.com", "twitter.com", "linkedin.com", "wikipedia.com", ".govtrack", "cspan", "opensecrets.org"]
  rep_name += " website"
  rep_name.gsub!(" ", "%20")
  query = "http://www.google.com/search?q=#{rep_name}"
  blacklist.each do |word|
    query += "+-#{word}"
  end

  searchPage = Nokogiri::HTML(open(query))
  puts searchPage.class

  websiteLink = searchPage.css("cite")[0].text
  websiteContributeLink = ""

  if websiteLink.index("/") == nil
    websiteContributeLink = websiteLink + "/contribute"
  else
    websiteContributeLink = websiteLink[0..websiteLink.index("/")] + "contribute"
  end
  return websiteContributeLink
end


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

      link = doRepWebsiteSearch(name)

      Rep.create(name: name, fec_id: fec_id, twitter_handle: twitter_handle, external_url: external_url, json: json,
        thumbnail_url: default_image,
        contribute_url: link)
    end
  end
end

def specialCharCheck(name)
  return name.length != name.match(/[a-zA-z\s]+/).to_s.length
end

def updateAllReps(start=0)
  Rep.all.each do |rep|
    puts "rep id: #{rep.id}"
    if rep.id >= start
     # if rep.id != 135 && rep.id != 181 && rep.id != 195 && rep.id != 212 && rep.id != 314 && rep.id != 335 && rep.id != 366 && rep.id != 378 && rep.id != 381 && rep.id != 463
      if !specialCharCheck(rep.name)
        rep.update({contribute_url: doRepWebsiteSearch(rep.name)})
      else
        rep.update({contribute_url: "SPECIALCHARACTER"})
      end
    end
  end
end

def create_jamal
  User.create(twitter_handle:'jmoon018', name: "Jamal Moon", zipcode: nil, provider: nil, uid: nil, profile_pic_thumb_url: "https://abs.twimg.com/sticky/default_profile_images/default_profile_6_normal.png", profile_pic_big_url: "https://abs.twimg.com/sticky/default_profile_images/default_profile_6.png")
end

# updateAllReps(0)
doRepWebsiteSearch("Barbara Lee")
# called seeding methods
# 10.times {create_jamal}
# seed_reps if Rep.count < 20
# create_pledges_with_messages({num_pledges: 20})


