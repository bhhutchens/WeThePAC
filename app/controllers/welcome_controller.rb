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
    # TODO: call sunlight API and pass "zips". Add results to matches.

    # checks database for reps whose names mach keywords
    matches = Rep.where('name ilike any ( array[?] )', keywords)

    render json: matches, status: 200
  end
end
