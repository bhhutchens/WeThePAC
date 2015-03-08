function makeTweet(newMessage) {
  var tweet = $.ajax({ url: api_server+'/tweets',
    type: 'POST',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {tweet: {message: newMessage}},
    success: function(response) {
      postPledge(response.tweet_id);
    }
  });
}

function postPledge(tweetId) {
  var positive = $('#tweet-box').data('positive')
  var tweet_message = $('#tweet-box').val()

  // regexp to get any number of digits (#) starting from end ($) of path name
  var repId = location.pathname.match(/\d*$/)[0]
  $.ajax({
    url: server+'/api/pledges/',
    type: 'POST',
    dataType: 'json',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {tweet_id: tweetId, rep_id: repId, positive: positive, tweet_message: tweet_message}
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
