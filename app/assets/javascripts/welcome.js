$(document).ready(function(){

  $(".search-form").eq(0).submit(function(e){
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
      appendSearchResults(serverData);
    }).error(function(){
      console.log('failed')
    })
  });

  function appendSearchResults(searchResults){
    console.log("appending search results");
    var compiledSearchResultTemplate = Handlebars.compile($("#searchResultTemplate").html());
    $.each(searchResults, function(index, rep) {
      if (rep.thumbnail_url === null) { rep.thumbnail_url = server+"/no-avatar.jpg" }
        rep.profile_url = server+"/reps/"+rep.id
      $("#searchResults").append(compiledSearchResultTemplate({rep: rep}));
    });
  };

});
