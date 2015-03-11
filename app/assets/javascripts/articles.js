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
    console.log("Successfully retrieved items");
    displayListItems(data.slice(0, 10), "midFeedList", delay);
  })
}

// on click
function addExpansionEvent(item) {
  item.on("click", function() {
    console.log("clicked on item");
    toggleSize(item);
    var itemId = $(this).attr("data-id");

    // TODO: CHANGE THE ARGUMENT TO BE: articleId
    var pledges = getPledgesByArticle(1);
  });
}

function toggleSize(listItem) {
  if (listItem.attr("data-open") == "true") {
    listItem.animate({
      padding: "15px 5px",
      queue: false
    }, 500);
    listItem.attr("data-open", "false");
  }
  else {
    listItem.animate({
      padding: "100px 5px",
      queue: false
    }, 500);
    listItem.attr("data-open", "true");
  }
}

// adds an article to top or bottom of list w/ animation
function addListItem(list, template, itemData, prepend, animate) {

  // add to the bottom or the top
  if (prepend) {
    list.prepend(template({data: itemData})); // add
  } else {
    list.append(template({data: itemData}));
  }

  // gets the list item that was just appended
  var listItem = list.children().first();
  addExpansionEvent(listItem); // do stuff when clicked

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
function removeListItem(list, childIndex) {
  var listItem = list.children().eq(childIndex);
  listItem.slideUp(ARTICLE_DISPLAY_DURATION,
    function() {
      $(this).remove();
  });
}

// takes an article json and adds it to view in html
function displayListItem(listName, item, animate) {
  console.log("Displaying a single list item: " + item);
  console.log("listName: " + listName);
  var list = $("#" + listName);
  console.log("LIST: " + list);
  listName = "#" + listName + "Template"
  console.log("fixed list name: " + listName);
  var template = compileTemplate(listName);
  console.log("compiled");
  addListItem(list, template, item, true, animate); // prepend
}

// calls displayArticles many times
function displayListItems(listItems, listName, delay) {
  console.log("displaying list items .. " + listName);
  for (var i = 0; i < listItems.length; i++) {
    if (delay) {
      setTimeout(function() {
        displayListItem(listName, listItems.shift(), true)
      }, ARTICLE_DISPLAY_DELAY * i);
    } else {
      console.log("delayed");
      displayListItem(listItems[i], false);
    }
  }
}


// get pledges based on an article
// // route: /api/articles/:id/pledges
// function getAndDisplayPledgesByArticle(articleId) {
//   $.ajax({
//     url: "/api" + pathname + "/" + articleId + "/pledges"
//   }).
//   done(function(data) {
//     displayAllPledges(data);
//   }).
//   fail(function(data) {
//     console.log("Error retreiving data by article id");
//   })
// }

// function displayPledge(pledge) {
//   console.log("Displaying a pledge.." + pledge);
//   console.log(pledge.inspect);
//   var list, templateId;
//   if (pledge.positive) {
//     list = $("#leftFeedList")
//     templateId = "#sideFeedListTemplate";
//   }
//   else {
//     list = $("#rightFeedList")
//     templateId = "#sideFeedListTemplate";
//   }

//   var template = compileTemplate(templateId);
//   list.prepend(template({pledge: pledge}));
// }

// function displayAllPledges(pledges) {
//   for(var i = 0; i < pledges.length; i++) {
//     displayPledge(pledges[i]);
//   }
// }

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
  displayListItems(pledges, "leftFeedList", true);
}

// get pledges for an article
function getPledgesByArticle(articleId) {
  $.ajax({
    url: "/api" + pathname + "/" + articleId + "/pledges"
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
      displayPledges(data);
    }
  }).
  fail(function(data) {
    console.log("Could not get pledges by article");
  })
}

function getArticleById(index) {
  $.ajax({
    url: "/api" + pathname + "/" + index
  })
}

$(document).ready(function() {
  console.log("Article js loaded");

  getAndDisplayArticles(10, true);
  //getAndDisplayPledgesByArticle(2);

  // addArticle(list, template, article, prepend, animate)

  // get the first article so i can play around with it
  //addArticle($("#midFeedList"),
  //compileTemplate($("midFeedListTemplate")),

});
