require 'HTTParty'

def google_search(rep_name)
  response = HTTParty.get('http://google.com', :query => { :q => rep_name, :output => 'json'})
  rawHtml = response.body.to_s
  puts rawHtml
  puts "=" * 50
  puts "count: #{rawHtml.length}"
  # puts rawHtml
  # #processedHtml = rawHtml.match(/(<h3 class="r"><a href=")((.)[^>]+)/)
  # #processedHtml = rawHtml.match(/.+/).to_s
  # puts "=" * 500

  # #processedHtml = "helloWORLD!".match(/.+/)
  # puts processedHtml
  currentChars = ""
  rawHtml.each_char do |char|
    #puts "Character: #{char}"
    wordToMatch = "</html>"

    currentChars += char
    index = currentChars.length-1
    if (currentChars[index] == wordToMatch[index])
      #puts "FOUND A MATCH! WEEE"
      #puts currentChars
      if currentChars.length == wordToMatch.length
        puts "WE WIN"
        return true
      end
    else
      currentChars = ""
    end
  end
end

google_search("I like muffins")
# (<h3 class="r"><a href=")((.)[^"]+) -- works but wrong link
# (<h3 class="r"><a href=")((.)+)
