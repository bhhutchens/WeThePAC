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
    pledgeButtonSetup();
  }).
  fail(function(data) {
    console.log("failed getting a rep with an ajax call");
  })
}


$(document).ready(function() {
  console.log("reps js loaded");
  getRepInfo();

});


// HIDES or SHOWS the positive/negative pledge buttons
function togglePledgeButtons(visible) {
    if (visible) {
      $('#positive-pledge').show()
      $('#negative-pledge').show()
    }
    else if (!visible) {
      $('#positive-pledge').hide()
      $('#negative-pledge').hide()
    }
}

function pledgeButtonSetup() {
  //adds event listeners to pledge buttons
  $('#positive-pledge').on('click', function(){
    togglePledgeButtons(false);
    $("#tweet-box").data('positive', 'true')
    $('#pledge-form').show()
  })

  $('#negative-pledge').on('click', function(){
    togglePledgeButtons(false);
    $("#tweet-box").data('positive', 'false')
    $('#pledge-form').show()
  })

  $("#close-tweet-button").on('click', function() {
    $("#pledge-form").hide();
    togglePledgeButtons(true);
  })
  pledgeFormSubmit();
}

function pledgeFormSubmit() {
  $('#pledge-form').on('submit', function(form) {
    form.preventDefault();
    makeTweet($('#tweet-box').val());

    // remove the form to tweet and show the pledge buttons again
    togglePledgeButtons(true);
    $("#pledge-form").hide();
  });
};





