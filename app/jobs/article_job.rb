class ArticleJob
  include SuckerPunch::Job

  def perform(event)
    while true
      puts "hi, from ArticleJob"
      index = 0
      Rep.order("id ASC").each do |rep|
        if (index <= 0)
          index += 1
          next
        end

        puts "Fetching  articles for #{rep.name} .. #{rep.id}"
        articles = googleNewsSearch(rep.name, 60 * 22 )
        articles.each do |article|
          puts article

          artReturn = Article.create(article)
          if artReturn.id == nil
            # this means that the article url already exists in the database
            dupId = Article.where(url: article.url)[0].id
            ArticlesRep.create(article_id: dupId,
            rep_id: rep.id)
          else
            #   the article does not already exist in the database and it is therefore created
            ArticlesRep.create(article_id: artReturn.id,
              rep_id: rep.id)
          end

          index += 1
        end
        puts "=" * 50
        sleep (25..30).to_a.sample.to_i
      end
    end
  end

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
    return input
  end

  # "mike kelly" AND ("Rep*" OR "Sen*") -"Targeted News Service"
  # final query: "TYPE FIRST_NAME LAST_NAME" where TYPE="Rep" or "Sen"
  def googleNewsSearch(name, mins = 720)

    type = ""
    theRep = Rep.all
    puts "THE REP! : #{theRep}"
    if Rep.where(name: name)[0].json.index("senate") != nil
      type = "Sen"
    else
      type = "Rep"
    end

    # fix the name -- so if there is 'ç' or some weird
    # character like that, it turns into 'c'
    name = ActiveSupport::Inflector.transliterate(name)
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

end

