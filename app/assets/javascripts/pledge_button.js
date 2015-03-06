function makeTweet(newMessage) {



// $.post(api_server+'tweet', {tweet: {message: newMessage}}, function(data, textStatus, xhr) {
//   /*optional stuff to do after success */
// });













$.ajax({ url: api_server+'tweet',
  type: 'POST',
  beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
  data: {tweet: {message: newMessage}},
  success: function(response) {
    alert('DONE!');
  }
});
}
