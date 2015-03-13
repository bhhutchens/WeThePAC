$(document).ready(function(){

  // suppresses any actions caused by pressing the enter key
  $(window).keydown(function(e) {
    if (e.keyCode == 13) { // ascii code for enter
      e.preventDefault();
      return false;
    }
  })

  // function to toggle show/hide of step list by clicking on caret.
  caretToggle = (function(){
    $("#stepListCaret").click(function(e) {
      // toggle caret direction
      if ($(this).text() === "▼") {$(this).text("▲") }
        else {$(this).text("▼")};

      // toggle list
      $(".step-list-item").slideToggle(600)
    });
  })();

  // this is a redundant copy of the same function in reps.js
  function compileTemplate (selector) {
    return Handlebars.compile($(selector).html());
  }

  $(".search-form").eq(0).keyup(function(e){
    e.preventDefault();
    var searchTerms = $('#searchBarInput').val();
    console.log("searching /welcome/search with terms: "+searchTerms);
    $.ajax({
      url: "/welcome/search",
      type: "GET",
      dataType: 'JSON',
      data: {"searchBarInput": searchTerms}
    }).done(function(serverData){
      console.log("db search query success!")
      console.log("got: "+serverData)
      removeExistingSearchResults();
      appendSearchResults(serverData);
    }).error(function(){
      console.log('failed')
    })
  });

  function getActivityFeed() {
    $.ajax({
      url: "/api/activity_feed"
    }).done(function(data){
      console.log('success getAndPopulateActivityFeed :)');
      populateActivityFeed(data);
    }).fail(function(){
      console.log('failed to getAndPopulateActivityFeed :(');
    });
  };

  getActivityFeed();


  // MADE CHANGES RECENTLY
  // WE DONT KNOW WHAT THE CONSEQUENCES COULD BE
  // EXCEPT REMOVING A HANDLEBAR ISSUE ON WELCOME
  function populateActivityFeed(recentPledges){
    // var activityFeedTemplate = compileTemplate('#activityFeedTemplate');
    console.log("populating activity feed");
    $.each(recentPledges, function(index, pledge) {
      // $('#activityFeed').append(activityFeedTemplate({activityFeedItem : pledge}));

      // add style for negative or positive pledge
      if (pledge.positive) {
        var pos_pledge = $("#activityFeed > li")[index]
        $(pos_pledge).addClass("positive-tweet");
        $(pos_pledge).find('.positive_icon').css('display', 'inline')
      }
      else {
        var neg_pledge = $("#activityFeed > li")[index]
        $(neg_pledge).addClass("negative-tweet");
        $(neg_pledge).find('.negative_icon').css('display', 'inline')
      }
    });
  };

  function removeExistingSearchResults(){
    if ( $('.search-result').length > 0 ) {
      $('.search-result').remove();
    };
  };

  function appendSearchResults(searchResults){
    console.log("appending search results");
    var compiledSearchResultTemplate = Handlebars.compile($("#searchResultTemplate").html());
    $.each(searchResults, function(index, rep) {
      if (rep.thumbnail_url === null) {
        rep.thumbnail_url = "/images/no-avatar.jpg" }
        rep.profile_url = "/reps/"+rep.id
        if (rep.twitter_handle != null) {rep.twitter_display = "@" + rep.twitter_handle} else { rep.twitter_display = ""}
          $("#searchResults").append(compiledSearchResultTemplate({rep: rep}));
      });
  };

  fireb = (function() {
    fb = new Firebase('https://we-the-pac.firebaseio.com')
    fb.on('child_changed', function(childSnapshot, prevChildName) {
      var pledgeData = childSnapshot.val().pledge

      console.log("FIREBASE: ADDING A PLEDGE");
      var li = new ListItem(pledgeData, "midFeedList");
      li.type = "pledge";
      displayPledge(li, true, true, true);
    });
    return{
      DataRef: fb,
    }
  })();

  // populate the feed
  getAndDisplayAllPledges(10);

  changeToSingleColumn();
});

function changeToSingleColumn() {
  $(".leftCol").remove();
  $(".rightCol").remove();
  $(".midCol").css({
    float: "none",
    margin: "auto",
    minWidth: "480px",
    display: "block"
  })
}

