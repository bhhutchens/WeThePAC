require 'nokogiri'
require 'open-uri'



def doSearch (rep_name)
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

  websiteContributeLink = websiteLink[0..websiteLink.index("/")] + "contribute"
end

doSearch("Keith Ellison")
doSearch("Barbara Boxer")
doSearch("Mike Honda")
