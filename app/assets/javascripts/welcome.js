$(document).ready(function(){

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

  function removeExistingSearchResults(){
    if ( $('.search-result').length > 0 ) {
      $('.search-result').remove();
    };
  };

  function appendSearchResults(searchResults){
    console.log("appending search results");
    var compiledSearchResultTemplate = Handlebars.compile($("#searchResultTemplate").html());
    $.each(searchResults, function(index, rep) {
      if (rep.thumbnail_url === null) { rep.thumbnail_url = server+"/images/no-avatar.jpg" }
        rep.profile_url = server+"/reps/"+rep.id
        if (rep.twitter_handle != null) {rep.twitter_display = "@" + rep.twitter_handle} else { rep.twitter_display = ""}
      $("#searchResults").append(compiledSearchResultTemplate({rep: rep}));
    });
  };

});
