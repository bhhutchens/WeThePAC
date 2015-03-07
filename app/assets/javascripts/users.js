// input: jquery selector
// output: handlebar template to be appended
function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}

// gets pledges thru ajax
// renders them onto the page as a list
function renderPledges() {
  // ajax GET call
  $.ajax({
    url: api_server + "users/1/pledges",
  }).
  done(function(data) {
    // add the name of the list in html
    console.log("success getting user's pledges");
    $('#tweet_list').prepend("<h1>Pledges</h1>");

    // loop through each pledge and append it as a list item
    $.each(data, function(index, pledge) {

      // get and compile templates
      var template = compileTemplate("#user_pledge_feed");

      // append to list -- var name: pledge
      $("#tweet_list").append(template({pledge: pledge}));
    });
  }).
  fail(function(){
    console.log('unable to get pledges feed');
  });
}


// gets user information (name, handle, img url, etc) thru ajax
// renders it onto the page, then renders the pledge feed
function getUserInfo() {
  $.ajax({
    url: api_server + "users/1",
    type: "GET"
  }).
  done(function(data) {
    console.log("Successfully received user data");

    // get + append template
    var userInfoTemplate = compileTemplate("#user_info");
    $(".profile_upper").append(userInfoTemplate({user: data}));

    renderPledges(); // RENDER THE PLEDGES FEED
  }).
  fail(function(data) {
    console.log("failed getting a user with an ajax call");
  })
}

// DOCUMENT READY
// TODO: ONLY WORKS FOR USER 1
//============================

$(document).ready(function() {
  // populate the page w/ data
  console.log("users js loaded");
  getUserInfo();
});
