class WelcomeController < ApplicationController
  def index
  end

  def zip_rep_search
    # keywords passed from searchbar
    puts "+"*100
    puts params
    keywords = params["searchBarInput"].split(" ").map!{|word| "%"+word+"%"}
    puts keywords
    # checks for any zipcodes 5+ digit long numbers (including numbers that start with 5 digits, include an optional any character, and have 0-5 more digits following that). If found, puts in array zips and removes those from keywords.
    if keywords.any? {|word| /[%]\d{5}.?\d{0,5}[%]/ =~ word}
      zips = keywords.select {|word| /[%]\d{5}.?\d{0,5}[%]/ =~ word}
      keywords -= zips
    end
    puts zips

    matches = []

    # checks database for reps whose names are found using the zip, adds to matches
    if zips && zips[0].length == 7
      returned_reps = get_rep_zips(zips[0][1..5])
      matches << Rep.where({ name: returned_reps })
    end

    # checks database for reps whose names match keywords
    matches << Rep.where('name ilike any ( array[?] )', keywords).limit(21)

    render json: matches[0], status: 200
  end
end

def get_rep_zips(zip)
  # calls sunlight api, gets reps from zip, and returns rep names to search
  response = HTTParty.get("http://congress.api.sunlightfoundation.com/legislators/locate?zip=#{zip}&apikey=db117ccbb61e4b82abc74d37a9b58ed2")
  rep_names = []
  response['results'].each do |rep|
    rep_name = rep['first_name'] + ' ' + rep['last_name']
    rep_names << rep_name
  end
  return rep_names
end
