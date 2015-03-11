var pathname = location.pathname

function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}

// get pledges thru ajax
// renders them onto the page as a list

function renderPledges() {
  // ajax GET call
  $.ajax({
    url: "/api" + pathname + "/pledges"
  }).
  done(function(data) {
    console.log("success getting the rep's pledges");

    // loop through each pledge and append it as a list item
    var pledgesInDB = data.length;
    var displayedPledges = $(".profile_pledge_list_item").length;
    data.reverse();
    $.each(data, function(index, pledge) {
      if (pledge.rep_thumbnail_url === null) {
        pledge.rep_thumbnail_url = "/images/no-avatar.jpg";
      }


      if (index < displayedPledges) {
        console.log("index < displayedPledges.." + index + " < " + displayedPledges);
        console.log("returning");
        return;
      } else {
        console.log("index >= displayedPledges.." + index + " >= " + displayedPledges);
      }


      // compile + append templates
      appendPledges(pledge);
    });
  }).
  fail(function() {
    console.log("unable to get pledges feed");
  })
}


function appendPledges(pledge) {
  var template = compileTemplate("#rep_pledge_feed");
  $("#pledge_list").prepend(template({pledge: pledge}));

      // add style for negative or positive pledge
      if (pledge.positive) {
        console.log("the pledge is positive");
        $("#pledge_list > li").first().addClass("positive-tweet");
      }
      else {
        console.log("the pledge is negative");
        $("#pledge_list > li").first().addClass("negative-tweet");
      }
    }






    function removeOldPledges() {
      $(".profile_pledge_list_item").remove();
    };

// gets rep information (name, handle, img url, etc) thru ajax
// renders it onto the page, then renders the pledge feed
function getRepInfo() {
  $.ajax({
    url: "/api" + pathname,
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

function tweetMessageOkay() {
  if ($("#tweet-box").val().length >= 131) {
    return false;
  }
  else {
    return true;
  }
}

function tweetMessageError() {
  console.log("Error: message too long");
  $("#tweet-character-count").text("Too many characters!");
}

function setupPledgeForm() {
 $("#pledge-form").keyup(function(e) {
  e.preventDefault();
  var currentTweetMsg = $("#tweet-box").val();
  var characterCnt = currentTweetMsg.length;
  console.log("current tweet message on search form: " + currentTweetMsg + "...count: " + characterCnt);

  var maxTweetCharacters = 140;
  var wtpac = " #WeThePAC";
  var handle = $("#tweet-handle").text();
  var availableLetters = 140 - wtpac.length - handle.length;
  availableLetters -= characterCnt;

  $("#tweet-character-count").text("Available characters: " + availableLetters);
  if (availableLetters < 0) {
    $("#tweet-character-count").addClass("red");
    return false;
  }
  else {
    $("#tweet-character-count").removeClass("red");
    return true;
  }
});

   // trigger the event above so that the "available characters: ..."
   // text is calculated and shown.. otherwise we'd have to wait
   // until the user actually types something
   $("#pledge-form").keyup();
 }


// HIDES or SHOWS the positive/negative pledge buttons
function togglePledgeButtons(visible) {
  if (visible) {
    $('#positive-pledge').css("visibility", "visible")
    $('#negative-pledge').css("visibility", "visible")
  }
  else if (!visible) {
    $("#positive-pledge").css("visibility", "hidden");
    $('#negative-pledge').css("visibility", "hidden")
  }
}

function pledgeButtonSetup() {
  //adds event listeners to pledge buttons
  $('#positive-pledge').on('click', function(){
    togglePledgeButtons(false);
    $("#tweet-box").data('positive', 'true')
    $('.pledge-form-wrapper').show()
  })

  $('#negative-pledge').on('click', function(){
    togglePledgeButtons(false);
    $("#tweet-box").data('positive', 'false')
    $('.pledge-form-wrapper').show()
  })

  $("#close-tweet-button").on('click', function() {
    $(".pledge-form-wrapper").hide();
    togglePledgeButtons(true);
  })

  setupPledgeForm();
  pledgeFormSubmit();
}

function pledgeFormSubmit() {
  $('#pledge-form').on('submit', function(form) {
    form.preventDefault();

    // don't submit the tweet if the tweet message
    // is too long etc
    if (!tweetMessageOkay()) {
      tweetMessageError();
      return;
    }
    var msg = $("#tweet-handle").text();
    makeTweet($('#tweet-box').val());
    updateFulfillMeter($("#tweet-box").data().positive);
    //makeTweet(handle + $("#tweet-box").val() + " #WeThePAC")

    // remove the form to tweet and show the pledge buttons again
    togglePledgeButtons(true);
    $(".pledge-form-wrapper").hide();


    // clear the tweet box
    $("#tweet-box").val("");
  });
};

$(document).ready(function() {
  console.log("reps js loaded");
  getRepInfo();
  makeGraph();
});


firebase = (function() {
  fb = new Firebase('https://we-the-pac.firebaseio.com/pledge')

  fb.on("value", function(data) {
    var pledge = data.val();
    console.log("pledge: " + pledge);
  });

  return{
    DataRef: fb,
  }

})();


