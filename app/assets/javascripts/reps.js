$(document).ready(function() {
  // get a rep
  console.log("reps js loaded");
  var pathname = location.pathname
  $.ajax({
    url: api_server + pathname,
    type: "GET"
  }).done(function(data) {
    console.log(data);
    var rep_template = $("#rep_info").html();
    var compiled_rep_template = Handlebars.compile(rep_template);

    // usage: apnd (compiled_template ({ key: data }))
    var apnd = function(data) { $("body").append(data); }

    apnd(compiled_rep_template({rep: data}));
  }).fail(function(data){
    console.log("failed getting a rep with ajax call");
  })


  console.log(api_server + pathname.substr(1, pathname.length)+"pledges")
  // get pledges feeed
  $.ajax({
    url: api_server + pathname+"pledges",
    type: "GET"
  }).done(function(data){
    console.log("succes getting rep's pledges");
  // title the pledge feed. Remove this after adding #pledges div.p
  $('body').append("<h1>Pledges</h1>")
    // iterate through each pledge response and append it to the page
    $.each(data, function(index, pledge) {
      var rep_pledge_feed_template = $("#rep_pledge_feed").html();
      var compiled_pledge_feed_template = Handlebars.compile(rep_pledge_feed_template);
      $('body').append(compiled_pledge_feed_template({pledge: pledge}));
    });
  }).fail(function(){
    console.log('unable to get pledges feed');
  });

});
