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
      console.log(serverData)
    }).error(function(){
      console.log('failed')
    })
  });

});
