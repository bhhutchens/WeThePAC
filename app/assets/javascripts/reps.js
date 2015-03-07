var pathname = location.pathname

function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}

// get pledges thru ajax
// renders them onto the page as a list

function renderPledges() {
  // ajax GET call
  $.ajax({
    url: api_server + pathname + "/pledges"
  }).
  done(function(data) {
    console.log("success getting the rep's pledges");
    if ( $("#pledge_list_title").length === 0 ) {
      $("#pledge_list").prepend("<h1 id='pledge_list_title'>Pledges</h1>") };

    // loop through each pledge and append it as a list item
    $.each(data, function(index, pledge) {
      if (pledge.rep_thumbnail_url === null) {
        pledge.rep_thumbnail_url = server + "/images/no-avatar.jpg";
      }

      // get and compile templates
      var template = compileTemplate("#rep_pledge_feed");

      $("#pledge_list").append(template({pledge: pledge}));
    });
  }).
  fail(function() {
    console.log("unable to get pledges feed");
  })
}

function removeOldPledges() {
  $(".profile_pledge_list_item").remove();
};

// gets rep information (name, handle, img url, etc) thru ajax
// renders it onto the page, then renders the pledge feed
function getRepInfo() {
  $.ajax({
    url: api_server + pathname,
    type: "GET"
  }).
  done(function(data) {
    console.log("Successfully received rep data");

    // get + append template
    var repInfoTemplate = compileTemplate("#rep_info");
    $(".profile_upper").append(repInfoTemplate({rep: data}));

    renderPledges(); // RENDER THE PLEDGES FEED
  }).
  fail(function(data) {
    console.log("failed getting a rep with an ajax call");
  })
}


$(document).ready(function() {
  console.log("reps js loaded");
  getRepInfo();
  pledgeButtonSetup();
});


// function getRep() {
//   $.ajax({
//     url: api_server + pathname,
//     type: "GET"
//   }).done(function(data) {
//     // console.log(data);
//     var rep_template = $("#rep_info").html();
//     var compiled_rep_template = Handlebars.compile(rep_template);

//     // usage: apnd (compiled_template ({ key: data }))
//     var apnd = function(data) { $("body").append(data); }
//     apnd(compiled_rep_template({rep: data}));

//     pledgeButtonSetup();
//   }).fail(function(data){
//     console.log("failed getting a rep with ajax call");
//   })
// }

// function getRepPledges() {
//   // get pledges feeed
//   $.ajax({
//     url: api_server + pathname+"/pledges",
//     type: "GET"
//   }).done(function(data){
//     console.log("succes getting rep's pledges");
//   // title the pledge feed. Remove this after adding #pledges div.p
//   $('body').append("<h1>Pledges</h1>")
//     // iterate through each pledge response and append it to the page
//     $.each(data, function(index, pledge) {
//       var rep_pledge_feed_template = $("#rep_pledge_feed").html();
//       var compiled_pledge_feed_template = Handlebars.compile(rep_pledge_feed_template);
//       $('body').append(compiled_pledge_feed_template({pledge: pledge}));
//     });
//   }).fail(function(){
//     console.log('unable to get pledges feed');
//   });
// }

function pledgeButtonSetup() {
  //adds event listeners to pledge buttons
  $('#positive-pledge').on('click', function(){
    $('#positive-pledge').hide()
    $('#negative-pledge').hide()
    $("#tweet-box").data('positive', 'true')
    $('#pledge-form').show()
  })

  $('#negative-pledge').on('click', function(){
    $('#positive-pledge').hide()
    $('#negative-pledge').hide()
    $("#tweet-box").data('positive', 'false')
    $('#pledge-form').show()
  })

  pledgeFormSubmit();
}

function pledgeFormSubmit() {
  $('#pledge-form').on('submit', function(form) {
    form.preventDefault();
    makeTweet($('#tweet-box').val());
  });


};





