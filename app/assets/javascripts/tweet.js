function makeTweet(newMessage) {
  var tweet =$.ajax({ url: api_server+'/tweets',
    type: 'POST',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {tweet: {message: newMessage}},
    success: function(response) {
      postPledge(response.tweet_id, repId);
    }
  });
}

function postPledge(tweetId, repId) {
  var positive = $('#tweet-box').data('positive')
  var tweet_message = $('#tweet-box').val()
  $.ajax({
    url: server+'/api/pledges/',
    type: 'POST',
    dataType: 'json',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {tweet_id: tweetId, rep_id: repId, positive: positive, tweet_message: tweet_message}
  })
  .done(function() {
    console.log("success");
  })
  .fail(function() {
    console.log("error");
  });

}

