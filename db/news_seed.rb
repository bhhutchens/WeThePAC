require 'nokogiri'
require 'open-uri'

=begin

sort by date:
&tbs=sbd:1

in the last (MINUTES = a number):
&tbs=qdr:nMINUTES

news category
&tbm=nws

starting article
&start=INDEX

=end

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
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day - 1,
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
      newMins = 60 + deltaHours
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day,
        currentTime.hour - 1, newMins)
    else
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day,
        currentTime.hour, newMins)
    end
  end

  puts "ARTICLE TIME: #{articleTime}"
  return articleTime
end

def cleanUrl (url)
  return "https://www.google.com#{url}"
end

def googleNewsSearch(name = 'Barbara Lee')
  link = 'https://www.google.com/search?q=Barbara+Lee&tbm=nws&tbs=qdr:n480'
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
    article_info["title"] = titles[i].text
    article_info['url'] = cleanUrl(urls[i].attr('href'))
    article_info['excerpt'] = excerpts[i].text
    article_info['date'] = cleanDate(dates[i].text)
    articles << article_info

    puts article_info
    puts "=" * 50
  end

  return articles
end

puts googleNewsSearch
