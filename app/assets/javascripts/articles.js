var pathname = location.pathname

function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}


// make ajax call and get articles json
// limit to the arugment 'count'
function getAndDisplayArticles(count) {
  $.ajax({
    url: "/api" + pathname
  }).
  done(function(data) {
    console.log("Successfully retrieved articles");
    displayAllArticles(data.slice(0, 10));
  })
}

// takes an article json and adds it to view in html
function displayArticle(article) {
  console.log("Displaying a single article: " + article);
  var list = $("#midFeedList");
  var template = compileTemplate("#midFeedListTemplate");
  list.prepend(template({article: article}));
}

// calls displayArticles many times
function displayAllArticles(articles) {
  for (var i = 0; i < articles.length; i++) {
    displayArticle(articles[i]);
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
  })
}

function displayPledge(pledge) {
  console.log("Displaying a pledge.." + pledge);
  var list, template;
  if (pledge.positive) {
    list = $("#positiveFeedList")
    template = "#positiveFeedListTemplate";
  }
  else {
    list = $("#negativeFeedList")
    template = "#negativeFeedListTemplate";
  }

  var template = compileTemplate(template);
  list.prepend(template({pledge: pledge}));
}

function displayAllPledges(pledges) {
  for(var i = 0; i < pledges.length; i++) {
    displayPledge(pledges[i])
  }
}

$(document).ready(function() {
  console.log("Article js loaded");

  getAndDisplayArticles(10);
  getAndDisplayPledgesByArticle(1);
});


