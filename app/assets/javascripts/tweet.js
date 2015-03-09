function makeTweet(newMessage) {
  var tweet = $.ajax({ url: "/api/tweets",
    type: 'POST',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {tweet: {message: newMessage}},
    success: function(response) {
      postPledge(response.tweet_id, newMessage);
    }
  });
}

function postPledge(tweetId, newMessage) {
  var positive = $('#tweet-box').data('positive')

  // regexp to get any number of digits (#) starting from end ($) of path name
  var repId = location.pathname.match(/\d*$/)[0]
  $.ajax({
    url: '/api/pledges/',
    type: 'POST',
    dataType: 'json',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {tweet_id: tweetId, rep_id: repId, positive: positive, tweet_message: newMessage}
  })
  .done(function() {
    console.log("successfully posted pledge");
    //removeOldPledges();
    renderPledges();
  })
  .fail(function() {
    console.log("error posting pledge");
  });
}
