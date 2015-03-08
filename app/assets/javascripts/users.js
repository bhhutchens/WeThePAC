var pathname = location.pathname

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
    url: api_server + pathname + "/pledges"
  }).
  done(function(data) {
    // add the name of the list in html
    console.log("success getting rep's pledges");
    $('#pledge_list').prepend("<h1>Pledges</h1>");

    // loop through each pledge and append it as a list item
    $.each(data, function(index, pledge) {
      if (pledge.rep_thumbnail_url === null) {
        pledge.rep_thumbnail_url = server+"/images/no-avatar.jpg"
      }
      // get and compile templates
      var template = compileTemplate("#user_pledge_feed");

      // append to list -- var name: pledge
      $("#pledge_list").append(template({pledge: pledge}));
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
    url: api_server + pathname,
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

function getAndPopulateUnfulfilledPledges() {
  $.ajax({
    url: api_server + pathname + "/unfulfilled"
  }).
  done(function(data){
    console.log("Successfully got unfulfilled pledges");
    // iterate through each of the user's unfulfilled pledges and pass to handlebars template.
    var unfulfilledsTemplate = compileTemplate("#user_fulfillment_feed");
    // populate profile_fulfillment_list with unfulfilled pledges
    $.each(data, function(index, unfulfilledPledge) {
      if (unfulfilledPledge.rep_thumbnail_url === null) {
        unfulfilledPledge.rep_thumbnail_url = server+"/images/no-avatar.jpg"
      }
      $("#fulfillment_list").append(unfulfilledsTemplate({unfulfilledPledge: unfulfilledPledge}));
    });
  }).
  fail(function(){
    console.log("Unable to getUnfulfilledPledges");
  });
};

function bindPledgeAndFulfillmentButtons() {
  $(".profile_upper").on('click', '#TogglePledgeFeed', function(){
    $("#pledge_list").show();
    $("#fulfillment_list").hide();
  });
  $(".profile_upper").on('click', '#ToggleFulfillmentFeed', function(){
    $("#fulfillment_list").show();
    $("#pledge_list").hide();
  });
};

function bindFulfillButton() {
  $('#fulfillment_list').on('click', '.fulfill-button', function(){
    if ( $(this).data('fulfillAction') === 'in progress' ) {
      var pledgeId = $(this).parent().data('pledgeId');
      markAsFulfilled(pledgeId);
      debugger;
      updateFulfillMeter();
    } else {
      $(this).parent().append(' <button class="external-link-button"><i class="fa fa-external-link"></i></button>');
      $(this).data('fulfillAction', 'in progress');
      $(this).text('Mark as Fulfilled');
      bindExternalLinkButton();
    };
  });
};

function bindExternalLinkButton() {
  // on externa-link-button click, go to the rep's webpage
  $('#fulfillment_list').on('click', '.external-link-button', function() {
    var externalLink = $(this).parent().data('repExternalUrl');
    window.open(externalLink);
  })
};

function markAsFulfilled(pledgeId) {
  // change pledge in DB from fulfilled false to true && refresh pledge feeds
  console.log('marking as fulfilled')
  $.ajax({
    url: api_server+'/pledges',
    type: 'put',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {pledge_id: pledgeId}
  }).success(function(data){
    console.log('success markAsFulfilled');
    removeOldPledges();
    getAndPopulateUnfulfilledPledges();
  }).fail(function(){
    console.log('no joy markAsFulfilled');
  });
};

function removeOldPledges(){
  $('.profile_fulfillment_list_item').remove();
}

$(document).ready(function() {
  // populate the page w/ data
  console.log("users js loaded");
  getUserInfo();
  getAndPopulateUnfulfilledPledges();
  bindPledgeAndFulfillmentButtons();
  // show only pledge_list by default
  $("#pledge_list").show();
  $("#fulfillment_list").hide();
  bindFulfillButton();

});
