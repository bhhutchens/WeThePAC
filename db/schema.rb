# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150305235208) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "pledges", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "rep_id"
    t.integer  "tweet_id"
    t.text     "tweet_message"
    t.boolean  "fulfilled",     default: false
    t.boolean  "positive"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  create_table "reps", force: :cascade do |t|
    t.string   "twitter_handle"
    t.string   "name"
    t.string   "fec_id"
    t.text     "bio"
    t.text     "json"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "twitter_handle"
    t.string   "name"
    t.string   "zipcode"
    t.string   "provider"
    t.string   "uid"
    t.text     "profile_pic_thumb_url"
    t.text     "profile_pic_big_url"
    t.string   "oauth_token"
    t.string   "oauth_secret"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

end
