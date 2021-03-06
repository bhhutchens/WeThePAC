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

      if (pledge.user_thumbnail_url === null) {
        pledge.user_thumbnail_url = "/images/no-avatar.jpg";
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
        $("#pledge_list > li").first().addClass("positive-tweet");
        $("#pledge_list > li").first().find('.positive_icon').css('display', 'inline')
      }
      else {
        $("#pledge_list > li").first().addClass("negative-tweet");
        $("#pledge_list > li").first().find('.negative_icon').css('display', 'inline')
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

    //renderPledges(); // RENDER THE PLEDGES FEED
    pledgeButtonSetup();
  }).
  fail(function(data) {
    console.log("failed getting a rep with an ajax call");
  })
}

function tweetMessageOkay() {
  var handle = ".@ "+$("#tweet-handle").text();
  var wtpac = " #WeThePAC";
  var numExtraChars = handle.length + wtpac.length
  if ($("#tweet-box").val().length >= (140 - numExtraChars)) {
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
  var handle = ".@ "+$("#tweet-handle").text();
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
  $(document).on('click', '#positive-pledge', function(){

    console.log("clicking on POSITIVE PLEDGE");
    togglePledgeButtons(false);
    $("#tweet-box").data('positive', 'true')
    $('.pledge-form-wrapper').show()
    sessionStorage.currentArticleId = $(this).parent().data('article-id');
  })

  $(document).on('click', '#negative-pledge', function(){
    togglePledgeButtons(false);
    $("#tweet-box").data('positive', 'false')
    $('.pledge-form-wrapper').show()
    sessionStorage.currentArticleId = $(this).parent().data('article-id');
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
    var repHandle = $("#tweet-handle").text();
    var articleId = sessionStorage.currentArticleId
    var tweetMsg = "." + repHandle + " " + $("#tweet-box").val() + " #WeThePAC"
    makeTweet(tweetMsg, articleId);
    updateFulfillMeter($("#tweet-box").data().positive);
    //makeTweet(handle + $("#tweet-box").val() + " #WeThePAC")

    // remove the form to tweet and show the pledge buttons again
    togglePledgeButtons(true);
    $(".pledge-form-wrapper").hide();


    // clear the tweet box
    $("#tweet-box").val("");
  });
};



// add the pledge to the top of the feed w/ animation
function displayFeedPledge(pledge, animation) {
  var template = compileTemplate("#pledge-feed-list-template");
  var list = $("#pledge-feed-list");
  $("#pledge-feed-list").prepend(template({pledge: pledge}));
  var firstChild = list.children().first().hide();

  if (pledge.positive == true) {
    firstChild.addClass("positive-tweet");
  } else if (pledge.positive == false) {
    firstChild.addClass("negative-tweet");
  }

  var lastChild = list.children().last();
  if (list.children().length > 3) {

      lastChild.animate({
        opacity: "0",
        height: "0"
      }, 1000, function() {
        $(this).remove();
      })
  }
  //firstChild.slideDown({duration: 1000});
  firstChild.css({display: "block", opacity: "0", height: "0"})
  firstChild.animate({
    opacity: "1",
    height: "33.33%"
  }, 1000)
}

// add (and possibly remove) multiple pledges to feed
function displayFeedPledges(pledges) {
  for (var i = 0; i < pledges.length; i++) {
    displayFeedPledge(pledges[i]);
    setTimeout(1000)
  }
}

// get pledge for feed
function getFeedPledges() {
  $.ajax({
    url: "/api" + location.pathname + "/pledges"
  }).
  done(function(pledges) {
    console.log("Successfully got the pledges for the rep");
    console.log(pledges);
    // can't cut three pieces of nothing, right?
    if (pledges.length >= 3) {
      pledges = pledges.slice(0, 3);
    }
    pledges = pledges.reverse();
    displayFeedPledges(pledges);
  }).
  fail(function(data) {
    console.log("Could not get the pledges feed for rep");
  })
}


$(document).ready(function() {
  console.log("reps js loaded");
  getRepInfo();
  makeGraph();
  getFeedPledges();
});
