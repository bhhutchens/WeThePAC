function makeTweet(newMessage) {
  var tweet =$.ajax({ url: api_server+'tweet',
    type: 'POST',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {tweet: {message: newMessage}},
    success: function(response) {
      sessionStorage.tweetId = response.tweet_id
      postPledge();
    }
  });
}

function postPledge() {
  $.ajax({
    url: '/path/to/file',
    type: 'default GET (Other values: POST)',
    dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
    data: {param1: 'value1'},
  })
  .done(function() {
    console.log("success");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

}

