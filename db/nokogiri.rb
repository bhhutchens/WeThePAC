require 'nokogiri'
require 'open-uri'


# def doSearch (rep_name)
#   blacklist = [".gov", "facebook.com", "twitter.com", "linkedin.com", "wikipedia.com", ".govtrack.us", "cspan.org", "opensecrets.org"]
#   rep_name += " website"
#   rep_name.gsub!(" ", "%20")
#   query = "http://www.google.com/search?q=#{rep_name}"
#   blacklist.each do |word|
#     query += "+-#{word}"
#   end

#   searchPage = Nokogiri::HTML(open(query))
#   puts searchPage.class

#   websiteLink = searchPage.css("cite")[0].text

#   websiteContributeLink = websiteLink[0..websiteLink.index("/")] + "contribute"
# end

# doSearch("Keith Ellison")
# doSearch("Barbara Boxer")
# doSearch("Mike Honda")

def doRepWebsiteSearch (rep_name)
  blacklist = [".gov", "facebook.com", "twitter.com", "linkedin.com", "wikipedia.com", ".govtrack", "cspan", ".edu", "opensecrets.org"]
  rep_name += " website"
  rep_name.gsub!(" ", "%20")
  query = "http://www.google.com/search?q=#{rep_name}"
  blacklist.each do |word|
    query += "+-#{word}"
  end

  puts "QUERY: #{query}"
  searchPage = Nokogiri::HTML(open("https://www.google.com/"))
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

doRepWebsiteSearch("Barbara Lee")
