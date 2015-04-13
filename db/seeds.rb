require 'nokogiri'
require 'open-uri'

# ###############################################################################

# THE FOLLOWING METHODS ARE USED IN SEEDING REPS TO THE DATABASE

# uses the sunlight foundation api to create the Reps in the database
def seed_reps
  # get Rep information using sunlight api. 11 times as returns 50 results per 'page'.
  x = 1
  response_array = []
  11.times do
    response_array << HTTParty.get("http://congress.api.sunlightfoundation.com/legislators?per_page=50&page=#{x}&apikey=db117ccbb61e4b82abc74d37a9b58ed2")

    x +=1
  end

  # parse the returned Rep info and save to database
  response_array.each do |page|
    page['results'].each do |rep|
      json = rep
      name = rep["first_name"] + ' ' + rep["last_name"]
      fec_id = rep["fec_ids"]
      twitter_handle = rep['twitter_id']
      twitter_handle = twitter_handle.downcase if twitter_handle
      external_url = rep['website']
      default_image = "/images/no-avatar.jpg"

      # find the personal campaign website for the Rep
      # need a time delay so google doesn't time it out
      sleep (40..70).to_a.sample
      link = doRepWebsiteSearch(name)

      Rep.create(name: name, fec_id: fec_id, twitter_handle: twitter_handle, external_url: external_url, json: json,
        thumbnail_url: default_image,
        contribute_url: link)
    end
  end
end

# looks for the campaign website belonging to a Rep and enters in database
# if doesn't find, uses the government website (provided by sunlight api) as default
def doRepWebsiteSearch (rep_name)
  originalRepName = rep_name
  blacklist = ["site:.gov", "site:www.facebook.com", "site:www.twitter.com", "site:www.linkedin.com", "site:www.wikipedia.org", "site:en.wikipedia.org", ".govtrack", "cspan", "opensecrets.org"]
  rep_name += " website"
  rep_name = ActiveSupport::Inflector.transliterate(rep_name)
  rep_name.gsub!(" ", "%20")
  query = "http://www.google.com/search?q=#{rep_name}"
  blacklist.each do |word|
    query += "+-#{word}"
  end

  searchPage = Nokogiri::HTML(open(query))
  puts searchPage.class

  websiteLink = ActiveSupport::Inflector.transliterate(searchPage.css("cite")[0].text)

  # check if the domain is .org or .com, if not, default to gov't website
  domain = getDomain(websiteLink)

  if domain != "org" && domain != "com" || domain == nil
    puts "Website link domain does not have .org or .com; it is useless to us"
    puts "Domain: #{domain}"
    return Rep.find_by(name: originalRepName).external_url
  end
  websiteContributeLink = ""

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
  if donateContributeLink == nil || donateContributeLink.empty?
    return websiteLink
  else
    return donateContributeLink[0].text
  end
end

# finds the domain given a url
def getDomain (url)
  puts "getting domain for url: #{url}"
  separatedUrl = url.scan(/([^.|\/\/]+[\/]?)/).flatten
  domain = separatedUrl[separatedUrl.length-1]
  if domain.index("/") == nil
    return domain
  else
    return domain[0..domain.index("/")-1]
  end
end

# updates the personal campaign website of all Reps in database
# (was needed when seed_reps did not include call to doRepWebsiteSearch)
def updateAllReps (start)
  puts "updating all reps"
  Rep.all.order("id ASC").each do |rep|
    puts "rep id: #{rep.id}"
    if rep.id >= start
      websiteSearchResult = doRepWebsiteSearch(rep.name)
      rep.update({contribute_url: websiteSearchResult})
      puts "Website search resulted in: #{websiteSearchResult} FOR #{Rep.name}"
      sleep (40..70).to_a.sample
    end
  end
end








# ###############################################################################

# THE FOLLOWING METHODS ARE USED IN SEEDING ARTICLES TO THE DATABASE

# creates articles for all Reps in the database
# loops through all Reps forever, finds google news articles for each Rep, enters articles into database
def fetchArticles (start_id = -1)
  while true
    index = 1
    Rep.order("id ASC").each do |rep|

      # this check is used to start the fetchArticles method at a RepId other than 1.
      # but will not hit the skipped Reps when looping
      if (index < start_id)
        index += 1
        next
      end

      # find articles for each Rep and save to database
      puts "FETCHING ARTICLES FOR #{rep.name} .. #{rep.id}"
      articles = googleNewsSearch(rep.name, 60 * 22 )
      articles.each do |article|
        puts "SAVING ARTICLE: #{article}"

        # attempts to save article to database. will only save if article unique.
        artReturn = Article.create(article)
        if artReturn.id == nil
          # the article already exists in db under a diff rep, needs join table entry for existing article
          puts "DUPLICATE ARTICLE: CREATING LINK BETWEEN REP AND ARTICLE IN JOIN TABLE"

          # lookup existing article with title, if that fails, use the excerpt
          if Article.where(title: article['title']).length > 0
            dupId = Article.where(title: article['title'])[0].id
            ArticlesRep.create(article_id: dupId, rep_id: rep.id)
          elsif Article.where(excerpt: article['excerpt']).length > 0
            dupId = Article.where(excerpt: article['excerpt'])[0].id
            ArticlesRep.create(article_id: dupId, rep_id: rep.id)
          else
            # cannot find the Article using title or excerpt, so cannot link article and rep in join table
            puts "ERROR CREATING LINK BETWEEN REP AND ARTICLE IN JOIN TABLE"
          end

        else
          # the article does not already exist in the database, needs join table entry for new article
          puts "UNIQUE ARTICLE: CREATING LINK BETWEEN REP AND ARTICLE IN JOIN TABLE"
          ArticlesRep.create(article_id: artReturn.id, rep_id: rep.id)
        end

      end

      # checks if total articles for rep over the limit and deletes oldest
      delete_old_articles(rep)

      puts "=" * 50
      # time delay between each Rep so google doesn't time out
      sleep (35..45).to_a.sample.to_i

    end
  end
end

# finds and returns the most recent articles (in the last 12 hours by default) for an individual Rep
def googleNewsSearch(name, mins = 720)

  # finds whether the Rep is a Senator or Representative
  type = ""
  if Rep.where(name: name)[0].json.index("senate") != nil
    type = "Sen"
  else
    type = "Rep"
  end

  # fix the name -- so if there is 'ç' or some weird
  # character like that, it turns into 'c'
  name = ActiveSupport::Inflector.transliterate(name)

  # create the google search term using Sen/Rep plus Rep's name
  query = "%22#{type} #{name}%22"
  query.gsub!(" ", "%20")

  # perform google news search, use nokogiri to parse results
  link = "https://www.google.com/search?q=#{query}&tbm=nws&tbs=qdr:n#{mins}"
  file = open(link)
  document = Nokogiri::HTML(file)
  titles = document.css('h3 > a')
  urls = document.css('h3 > a')
  excerpts = document.css('.st')
  dates = document.css('div.slp > span.f')

  # create article objects using information parsed from google search
  # clean the data (get rid of weird characters, apply url format, apply date format)
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

# deletes articles more than 8 deep for an individual Rep
# this method is used to limit the number of articles in the database
def delete_old_articles(rep, max_article_count = 8)
  if rep.articles.count > max_article_count
    puts 'DELETING OLD ARTICLES'
    articles = rep.articles.order("created_at DESC")
    count = rep.articles.count
    i = max_article_count
    while i < count
      # delete ArticlesRep/join table entry
      rep.articles.destroy(articles[i])

      # delete Article, only if last Rep pointing to article
      other_reps_with_articles = ArticlesRep.where(article_id: articles[i].id)
      if other_reps_with_articles.length == 0
        Article.destroy(articles[i].id)
      end

      i += 1
    end
  end
end





# THE FOLLOWING METHODS ARE USED TO CLEAN THE DATA WHEN SEEDING ARTICLES

# given a date in the format: "Politico-17 hours ago", returns a date stamp
def cleanDate(date)
  # gets rid of weird characters that may appear in date
  date = cleanString(date)

  # finds the time difference in hours. (if not differnt in hours, handle minutes in else statement)
  timeAgo = date.match(/\d+/).to_s.to_i
  hours = (date.index("hours") != nil)
  currentTime = Time.now
  articleTime = ""

  # given a time difference in hours, calculate the date stamp
  if hours
    deltaHours = currentTime.hour - timeAgo
    if deltaHours < 0
      # if deltaHours < 0, the article was posted the previous day
      newHours = 24 + deltaHours
      newHours = 0 if newHours < 0
      newDay = currentTime.day - 1
      newDay = 0 if newDay <= 0

      # if newDay == 0, then need to roll back to previous month and reset newDay to the last day of the month
      newMonth = currentTime.month
      newYear = currentTime.year
      if newDay == 0
        newMonth = currentTime.month - 1
        # 30 days hath sept, april, june, and november...
        if (newMonth == 9) || (newMonth == 4) || (newMonth == 6) || (newMonth == 11)
          newDay = 30
        elsif newMonth == 2
          if (currentTime.year % 4 == 0) && (currentTime.year % 100 == 0) && (currentTime.year % 400 == 0)
            # it's a leap year
            newDay = 29
          else
            newDay = 28
          end
        elsif newMonth == 0
          # this means the article was created the month before january (aka december, the previous year)
          newYear = currentTime.year - 1
          newMonth = 12
          newDay = 31
        else
          newDay = 31
        end
      end

      # use the calculated times to create the date stamp
      articleTime = Time.mktime(newYear,
        newMonth, newDay,
        newHours, currentTime.min)
    else
      # the article was posted today, use only the updated hours
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day,
        deltaHours, currentTime.min)
    end
  else
    # if not different in hours, then article was posted this hour. only differs in minutes.
    deltaMins = currentTime.min - timeAgo
    # if deltaMins less than zero, posted last hour
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
      # if deltaMins greater than zero, posted this hour
      deltaMins = 59 if deltaMins >= 60
      articleTime = Time.mktime(currentTime.year,
        currentTime.month, currentTime.day,
        currentTime.hour, deltaMins)
    end
  end

  return articleTime
end

# given a url that redirects from google, need to include the google prefix
def cleanUrl (url)
  return "https://www.google.com#{url}"
end

# removes any non-latin characters from a string
# used to prevent errors when entering data into database
def cleanString (input)
  input = input.encode(Encoding.find('ASCII'), {
    invalid: :replace,
    :undef => :replace,
    :replace   => '',
    :universal_newline => true})
  return input
end





# ###############################################################################

# BELOW IS WHERE METHODS ARE CALLED

fetchArticles()