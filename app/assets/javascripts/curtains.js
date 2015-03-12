// check in document cookie whether this is the first visit. Should really write a function to iterate through all cookie values and look for this specific cookie, but since there is only one cookie for now, this is okay.
if (document.cookie != "firstVisit=false") {
  $('body').addClass('curtains-closed');
  // hide everything until page is loaded
  $(window).load(function() {
    // if wanted, display initial greeting.

    // this isn't working, maybe because other display elements are forcibly loading themselves.
    $('body').fadeIn('slow');
    document.cookie = "firstVisit=false";
  });
}

