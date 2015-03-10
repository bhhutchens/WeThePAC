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
#doRepWebsiteSearch("Barbara Lee")
# called seeding methods
# 10.times {create_jamal}
# seed_reps if Rep.count < 20
# create_pledges_with_messages({num_pledges: 20})













# find the number
# determine if it's minutes or hours
# we'll use that againast the current time
# return the date
def cleanDate(date)
  puts "date: #{date}"
  timeAgo = date.match(/\d+/).to_s.to_i
  hours = (date.index("hours") != nil)
  currentTime = Time.now
  articleTime = ""

  # hours
  puts "cleaning the date"
  if hours
    puts "different in hours"
    deltaHours = currentTime.hour - timeAgo
    if deltaHours < 0
      newHours = 24 + deltaHours
      newHours = 0 if newHours < 0
      newDay = currentTime.day - 1
      newDay = 0 if newDay <= 0
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, newDay,
        newHours, currentTime.min)
    else
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day,
        deltaHours, currentTime.min)
    end
  else
    puts "different in minutes"
    deltaMins = currentTime.min - timeAgo
    if deltaMins < 0
      # error (bounds) checking -- cannot be negative
      newMins = 60 + deltaMins
      newMins = 0 if newMins < 0
      newMins = 59 if newMins >= 60
      newHour = currentTime.hour - 1
      newHour = 0 if newHour < 0

      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day,
        newHour, newMins)
    else
      deltaMins = 59 if deltaMins >= 60
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day,
        currentTime.hour, deltaMins)
    end
  end

  puts "ARTICLE TIME: #{articleTime}"
  return articleTime
end

def cleanUrl (url)
  return "https://www.google.com#{url}"
end

def cleanString (input)
  #return input.gsub("\\x96", "--")
  puts "calling clean string"
  input = input.encode(Encoding.find('ASCII'), {
    invalid: :replace,
    :undef => :replace,
    :replace   => '',
    :universal_newline => true})
  puts input
  return input.to_s.gsub(/[^0-9A-Za-z\s]/, "")
end

# "mike kelly" AND ("Rep*" OR "Sen*") -"Targeted News Service"
# final query: "TYPE FIRST_NAME LAST_NAME" where TYPE="Rep" or "Sen"
def googleNewsSearch(name, mins = 720)

  # fix the name -- so if there is 'ç' or some weird
  # character like that, it turns into 'c'
  name = ActiveSupport::Inflector.transliterate(name)
  type = ""
  theRep = Rep.all
  puts "THE REP! : #{theRep}"
  if Rep.where(name: name)[0].json.index("senate") != nil
    type = "Sen"
  else
    type = "Rep"
  end

  query = "%22#{type} #{name}%22"
  query.gsub!(" ", "%20")

  link = "https://www.google.com/search?q=#{query}&tbm=nws&tbs=qdr:n#{mins}"
  file = open(link)
  document = Nokogiri::HTML(file)
  puts document.class
  titles = document.css('h3 > a')
  urls = document.css('h3 > a')
  excerpts = document.css('.st')
  dates = document.css('div.slp > span.f')

  articles = []
  for i in 0..(titles.length - 1)
    article_info = {}
    article_info["title"] = cleanString(titles[i].text)
    article_info['url'] = cleanUrl(urls[i].attr('href'))
    article_info['excerpt'] = cleanString(excerpts[i].text)
    article_info['date'] = cleanDate(dates[i].text)
    articles << article_info
  end

  return articles
end

def fetchArticles
  Rep.all.each do |rep|
    puts "Fetching  articles for #{rep.name} .. #{rep.id}"
    articles = googleNewsSearch(rep.name, 60 * 22 )
    articles.each do |article|
      puts article
      rep.articles.create(article)
    end
    puts "=" * 50
    sleep (5..10).to_a.sample.to_i
  end
end

fetchArticles
