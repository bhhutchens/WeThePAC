$(document).ready(function() {
  // get a user
  console.log("users js loaded");

  $.ajax({
    url: api_server + "/users/1",
    type: "GET"
  }).done(function(data) {
    console.log(data);
    var user_template = $("#user_info").html();
    var compiled_user_template = Handlebars.compile(user_template);

    // usage: apnd (compiled_template ({ key: data }))
    var apnd = function(data) { $("body").append(data); }

    apnd(compiled_user_template({user: data}));
  }).fail(function(data){
    console.log("failed getting a user with ajax call");
  })

// get pledges feeed
$.ajax({
  url: api_server + "/users/1/pledges",
  type: "GET"
}).done(function(data){
  console.log("succes getting user's pledges");
  // title the pledge feed. Remove this after adding #pledges div.p
  $('body').append("<h1>Pledges</h1>")
    // iterate through each pledge response and append it to the page
    $.each(data, function(index, pledge) {
      var user_pledge_feed_template = $("#user_pledge_feed").html();
      var compiled_pledge_feed_template = Handlebars.compile(user_pledge_feed_template);
      $('body').append(compiled_pledge_feed_template({pledge: pledge}));
    });
  }).fail(function(){
    console.log('unable to get pledges feed');
  });


});
