var pathname = location.pathname
var ARTICLE_DISPLAY_DURATION = 100;
var ARTICLE_DISPLAY_DELAY = 50 + ARTICLE_DISPLAY_DURATION ;

function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}


// make ajax call and get articles json
// limit to the arugment 'count'
function getAndDisplayArticles(count, delay) {
  $.ajax({
    url: "/api" + pathname
  }).
  done(function(data) {
    console.log("Successfully retrieved articles");
    displayAllArticles(data.slice(0, 10), delay);
  })
}


// on click
function addArticleEventHandler(article) {
  article.on("click", function() {
    console.log("clicked on article");
    togglePledgesFromArticle(article);
    //displayPledge(this, article)
    var pledges = getPledgesByArticle(article);
    displayPledges(pledges);
  });
}

function togglePledgesFromArticle(article) {
  console.log("article: " + article)
  if (article.attr("data-open") == "true") {
    article.animate({
      padding: "15px 5px",
      queue: false
    }, 500);
    article.attr("data-open", "false");
  }
  else {
    article.animate({
      padding: "100px 15px",
      queue: false
    }, 500);
    article.attr("data-open", "true");
  }
}

// adds an article to top or bottom of list w/ animation
function addArticle(list, template, article, prepend, animate) {
  // add to the bottom or the top
  if (prepend) {
    list.prepend(template({article: article})); // add
  } else {
    list.append(template({article: article}));
  }

  // gets the list item that was just appended
  var listItem = list.children().first();
  addArticleEventHandler(listItem); // do stuff when clicked

  // no animation, just quit this method here
  if (!animate) { return; }

  // hide children elements or else they fully appear b4 animation
  listItem.children().hide().slideDown({
     duration: ARTICLE_DISPLAY_DURATION,
     queue: false
  });

  // make the listItem (div) also grow
  listItem.css("height", 0).animate({
    height: "100%",
  }, {
    duration: ARTICLE_DISPLAY_DURATION,
    queue: false
  });
}

// removes the list item at the given index w/ animation
function removeArticle(list, childIndex) {
  var listItem = list.children().eq(childIndex);
  listItem.slideUp(ARTICLE_DISPLAY_DURATION,
    function() {
      $(this).remove();
  });
}

// takes an article json and adds it to view in html
function displayArticle(article, animate) {
  console.log("Displaying a single article: " + article);
  var list = $("#midFeedList");
  var template = compileTemplate("#midFeedListTemplate");
  addArticle(list, template, article, true, animate); // prepend
}

// calls displayArticles many times
function displayAllArticles(articles, delay) {
  for (var i = 0; i < articles.length; i++) {
    if (delay) {
      setTimeout(function() {
        displayArticle(articles.shift(), true)
      }, ARTICLE_DISPLAY_DELAY * i);
    } else {
      console.log("delayed");
      displayArticle(articles[i], false);
    }
  }
}


// get pledges based on an article
// route: /api/articles/:id/pledges
function getAndDisplayPledgesByArticle(articleId) {
  $.ajax({
    url: "/api" + pathname + "/" + articleId + "/pledges"
  }).
  done(function(data) {
    displayAllPledges(data);
  }).
  fail(function(data) {
    console.log("Error retreiving data by article id");
  })
}

function displayPledge(pledge) {
  console.log("Displaying a pledge.." + pledge);
  console.log(pledge.inspect);
  var list, templateId;
  if (pledge.positive) {
    list = $("#leftFeedList")
    templateId = "#sideFeedListTemplate";
  }
  else {
    list = $("#rightFeedList")
    templateId = "#sideFeedListTemplate";
  }

  var template = compileTemplate(templateId);
  list.prepend(template({pledge: pledge}));
}

function displayAllPledges(pledges) {
  for(var i = 0; i < pledges.length; i++) {
    displayPledge(pledges[i]);
  }
}





// display a pledge based on the article
function displaySidePledge(list, pledge, article) {
  var index = 0;
  list.children().each(function() {
    if($(this).attr("data-id") == article.attr("data-id")) {
      console.log("found the article");
      console.log("index: " + index);
    }
    index++;
  });
}

function displayPledges(pledges) {
  for (var i = 0; i < pledges.length; i++) {
    displaySidePledge(list, pledges[i], article);
  }
}

// get pledges for an article
function getPledgesByArticle(article) {
  $.ajax({
    url: "/api" + pathname + "/" + article.id + "/pledges"
  }).
  done(function(data) {
    console.log("Successfully received pledges by article");
    // data = pledges
    var pledges = data.slice(0, 2); // get the first three pledges if they exist

    if (pledges.length == 0) {
      console.log("no pledges to display :(((");
      return;
    }
    else {
      console.log("going to display some pledges");
    }
  }).
  fail(function(data) {
    console.log("Could not get pledges by article");
  })
}


$(document).ready(function() {
  console.log("Article js loaded");

  getAndDisplayArticles(10, true);
  getAndDisplayPledgesByArticle(2);
});


