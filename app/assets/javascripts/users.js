var pathname = location.pathname

// input: jquery selector
// output: handlebar template to be appended
function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}


// gets user information (name, handle, img url, etc) thru ajax
// renders it onto the page, then renders the pledge feed
function getUserInfo() {
  $.ajax({
    url: "/api" + pathname,
    type: "GET"
  }).
  done(function(data) {
    console.log("Successfully received user data");

    // get + append template
    var userInfoTemplate = compileTemplate("#user_info");
    $(".profile_upper").append(userInfoTemplate({user: data}));
  }).
  fail(function(data) {
    console.log("failed getting a user with an ajax call");
  })
}

function hideButtons() {
  $("li > button").hide();
}

function showFulfillButtons() {
  console.log("showing fulfill buttons");
  $(".fulfillButton").show();
}

function hideFulfillButtons() {
  console.log("hiding fulfill buttons");
  $(".fulfillButton").hide();
}

function showTwoButtons(button) {
  console.log("showing gotowebsite and markfulfilled buttons");
  button.parent().find(".markFulfilledButton").show();
  button.parent().find(".gotoWebsiteButton").show();
}


function addEventsToButtons() {
  console.log("add events to buttons");

  $("#TogglePledgeFeed").on("click", function() {
      hideButtons();
   });

  $("#ToggleFulfillmentFeed").on("click", function() {
    showFulfillButtons();
  });
  $(".fulfillButton").click(function() {
    fulfillButtonClick($(this));
  })

  $(".gotoWebsiteButton").click(function() {
    gotoWebsiteButtonClick($(this));
  })

  $("markFulfilledButton").click(function(){
    markFulfilledButtonClick($(this));
  })


  console.log("add events to end buttons");
}

function fulfillButtonClick(button) {
  console.log("Clicked on the fulfill button");
  button.hide();
  showTwoButtons(button);
}

function gotoWebsiteButtonClick(button) {
  console.log("Clicked on the gotoWebsiteButton");
  window.location.href = getListItemFromHtml(button.parent().html()).data.rep_external_url;
}

function markFulfilledButtonClick(button) {
  console.log("Clickedo n the markFulfilledButton");
}

function getListItemFromHtml(html) {
  var list = ListItems.midListItems;
  for (var i = 0; i < list.length; i++) {
    if (list[i].html.html() == html) {
      return list[i];
    }
  }
  return null
}
$(document).ready(function() {
  // change the mode to PLEDGES not articles
  // populate the page w/ data
  console.log("users js loaded");
  getUserInfo();
  getAndDisplayPledgesByUser(10);

  ListItems.removeSideStyling();
});

