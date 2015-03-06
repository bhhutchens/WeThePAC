$(document).ready(function() {
  // get a rep
  console.log("reps js loaded");

  $.ajax({
    url: api_server + "reps/1",
    type: "GET"
  }).done(function(data) {
    console.log(data);
    var rep_template = $("#rep_info").html();
    var compiled_rep_template = Handlebars.compile(rep_template);

    // usage: apnd (compiled_template ({ key: data }))
    var apnd = function(data) { $("body").append(data); }

    apnd(compiled_rep_template({rep: data}));
  }).fail(function(data){
    console.log("failed getting a rep with ajax call");
  })
});
