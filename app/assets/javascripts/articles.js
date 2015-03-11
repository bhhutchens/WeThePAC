// var pathname = location.pathname
// var ARTICLE_DISPLAY_DURATION = 100;
// var ARTICLE_DISPLAY_DELAY = 50 + ARTICLE_DISPLAY_DURATION ;

// function compileTemplate (selector) {
//   return Handlebars.compile($(selector).html());
// }


// // make ajax call and get articles json
// // limit to the arugment 'count'
// function getAndDisplayArticles(count, delay) {
//   $.ajax({
//     url: "/api" + pathname
//   }).
//   done(function(data) {
//     console.log("Successfully retrieved items");
//     displayListItems(data.slice(0, 10), "midFeedList", delay);
//   })
// }


// function clearList(list) {
//   for (var i = 0; i < list.children().length; i++) {
//     removeListItem(list, i);
//   }
// }

// // on click
// function addExpansionEvent(item) {
//   item.on("click", function() {
//     console.log("clicked on item");
//     var itemId = $(this).attr("data-id");


//     // clear the sides
//     clearList($("#leftFeedList"));
//     clearList($("#rightFeedList"));

//     // TODO: CHANGE THE ARGUMENT TO BE: articleId
//     if (item.attr("data-open") != "true") {
//       var pledges = getPledgesByArticle(1, function(pledges2) {
//         // figure out the most of the positive or neg pledges
//         var pledges = [$("#leftFeedList").children(), $("#rightFeedList").children()];
//         console.log("====");
//         console.log(pledges);
//         var heightSum = 0;
//         var posLen = pledges[0].length;
//         var negLen = pledges[1].length;
//         if (posLen > negLen) {
//           for (var i = 0; i < posLen; i++) {
//             var height = parseInt(pledges[0].eq(i).attr("data-height"));
//             console.log("getting height of pledge: " + height);
//             heightSum += height;
//           }
//         } else {
//           for (var i = 0; i < negLen; i++) {
//             var height = parseInt(pledges[1].eq(i).attr("data-height"));
//             console.log("getting height of neg pledge: " + height);
//             heightSum += height;
//           }
//         }
//         console.log("HEIGHT SUM: " + heightSum);
//         changeSideUpperPadding(item, true, false);
//         toggleSize(item, heightSum);
//       })
//     }
//     else {
//       changeSideUpperPadding(item, false, true);
//       toggleSize(item, 0);
//     }
//   });
// }

// function changeSideUpperPadding(listItem, add, animate) {

//   // remove the padding
//   if (!add) {
//     $("#leftFeedList").animate({paddingTop: 0}, ARTICLE_DISPLAY_DURATION );
//     $("#rightFeedList").animate({paddingTop: 0}, ARTICLE_DISPLAY_DURATION);
//     return;
//   }

//   // add padding -- calculate it from the middle div
//   var parent = listItem.parent();
//   var distance = 0;
//   var index = 0;
//   parent.children().each(function() {
//     console.log("Index: " + index++);
//     var height = parseInt($(this).css("height"));
//     if ($(this).attr("data-id") == listItem.attr("data-id")) {
//       console.log("Found it...adding side padding..." + distance);
//       $("#leftFeedList").css("padding-top", (String(distance) + "px"));
//       $("#rightFeedList").css("padding-top", (String(distance) + "px"));
//       return;
//     }
//     // increment height
//     distance += height;
//   })
// }

// function toggleSize(listItem, heightSum) {
//   if (listItem.attr("data-open") == "true") {
//     listItem.animate({
//       padding: "15px 5px",
//       queue: false
//     }, 500);
//     listItem.attr("data-open", "false");
//     return false; // closing
//   }
//   else {
//     var padding = heightSum - (parseInt(listItem.attr("data-height")) -
//       parseInt(listItem.css("padding-top")) * 2);
//     padding /= 2;
//     console.log("PADDING: " + padding);
//     if (heightSum == 0) {
//       padding = 100;
//     }
//     listItem.animate({
//       padding: (String(padding)+ "px 5px"),
//       queue: false
//     }, 500);
//     listItem.attr("data-open", "true");
//     return true; // opening
//   }
// }

// // adds an article to top or bottom of list w/ animation
// function addListItem(list, template, itemData, prepend) {

//   // add to the bottom or the top
//   if (prepend) {
//     list.prepend(template({data: itemData})); // add
//   } else {
//     list.append(template({data: itemData}));
//   }

//   // gets the list item that was just appended
//   var listItem = list.children().first();
//   addExpansionEvent(listItem); // do stuff when clicked

//   listItem.attr("data-height", listItem.css("height"));
//   listItem.hide();
//   return listItem;
// }

// function animateListItem(listItem) {
//   console.log("animating list item: " + listItem);
//   // hide children elements or else they fully appear b4 animation
//   listItem.show().children().hide().slideDown({
//      duration: ARTICLE_DISPLAY_DURATION,
//      queue:false
//   });

//   listItem.css("height", 0).animate({
//     height: "100%"
//   }, {
//     duration: ARTICLE_DISPLAY_DURATION,
//     queue:false
//   });
// }

// function animateList(listItems) {
//   console.log("ANIMATING THE LIST")
//   for(var i = 0; i < listItems.length; i++) {
//     var curListItem = listItems[i];
//     //setTimeout(function() {
//         animateListItem(curListItem)
//       //}, ARTICLE_DISPLAY_DELAY * i);
//   }
// }

// // removes the list item at the given index w/ animation
// function removeListItem(list, childIndex) {
//   var listItem = list.children().eq(childIndex);
//   listItem.slideUp(ARTICLE_DISPLAY_DURATION,
//     function() {
//       $(this).remove();
//   });
// }

// // takes an article json and adds it to view in html
// function displayListItem(listName, item) {
//   console.log("Displaying a single list item: " + item);
//   console.log("listName: " + listName);
//   var list = $("#" + listName);
//   console.log("LIST: " + list);
//   listName = "#" + listName + "Template"
//   console.log("fixed list name: " + listName);
//   var template = compileTemplate(listName);
//   console.log("compiled");
//   return addListItem(list, template, item, true); // prepend
// }

// // calls displayArticles many times
// function displayListItems(listItems, listName, delay) {
//   console.log("displaying list items .. " + listName);
//   var length = listItems.length;
//   var createdListItems = []
//   for (var i = 0; i < length; i++) {
//     createdListItems.push(displayListItem(listName, listItems[i]));
//   }
//   if(delay) {
//     animateList(createdListItems)
//   }
// }


// // display a pledge based on the article
// function displaySidePledge(list, pledge, article) {
//   var index = 0;
//   list.children().each(function() {
//     if($(this).attr("data-id") == article.attr("data-id")) {
//       console.log("found the article");
//       console.log("index: " + index);
//     }
//     index++;
//   });
// }

// function displayPledges(positivePledges, negativePledges) {
//   displayListItems(positivePledges, "leftFeedList", true);
//   displayListItems(negativePledges, "rightFeedList", true);
// }

// // get pledges for an article
// function getPledgesByArticle(articleId, callback) {
//   $.ajax({
//     url: "/api" + pathname + "/" + articleId + "/pledges"
//   }).
//   done(function(data) {
//     console.log("Successfully received pledges by article");
//     // data = pledges

//     if (data.length == 0) {
//       console.log("no pledges to display :(((");
//       return;
//     }
//     else {
//       console.log("going to display some pledges");

//       // filter the data by positive and negative pledges
//       var posPledges = [];
//       var negPledges = [];
//       for (var i = 0; i < data.length; i++) {
//         console.log("adding data: " + data[i]);
//         if (data[i].positive && posPledges.length < 3) {
//           posPledges.push(data[i]);
//         } else if (negPledges.length < 3) {
//           negPledges.push(data[i]);
//         }
//       }
//       displayPledges(posPledges, negPledges);

//       console.log("calling back");
//       callback([[posPledges], [negPledges]]);
//     }
//   }).
//   fail(function(data) {
//     console.log("Could not get pledges by article");
//   })
// }

// function getArticleById(index) {
//   $.ajax({
//     url: "/api" + pathname + "/" + index
//   })
// }

// $(document).ready(function() {
//   console.log("Article js loaded");

//   getAndDisplayArticles(10, true);
//   //getAndDisplayPledgesByArticle(2);

//   // addArticle(list, template, article, prepend, animate)

//   // get the first article so i can play around with it
//   //addArticle($("#midFeedList"),
//   //compileTemplate($("midFeedListTemplate")),

// });

var pathname = location.pathname
var ANIMATION_DURATION = 100;
var ANIMATION_DELAY = 50 + ANIMATION_DURATION

// global container for all list items
var ListOfItems = function() {
  this.negListItems = [];
  this.midListItems = [];
  this.posListItems = [];
}

var ListItems = new ListOfItems();

// should contain methods to hide, show, create html, animate, etc
var ListItem = function(data, column, type) {
  this.id = data.id;
  this.data = data;
  this.column = column;
  this.html = "";
  this.posPledges = [];
  this.negPledges = [];
  this.type = type;
  this.css = {};

  if (column == "midFeedList") {
    ListItems.midListItems.unshift(this);
  } else if (column == "rightFeedList") {
    ListItems.negListItems.unshift(this);
  } else if (column == "leftFeedList") {
    ListItems.posListItems.unshift(this);
  }
}

ListItem.prototype.createPositivePledge = function(data) {
  this.posPledges.unshift(new ListItem(data, "leftFeedList"));
}

ListItem.prototype.createNegativePledge = function(data) {
  this.negPledges.unshift(new ListItem(data, "rightFeedList"));
}

ListItem.prototype.createHtml = function(prepend, hide) {
  console.log("Creating HTML for list item: " + this);

  // handlebar template to populate page w/ data
  var list = $("#" + this.column);
  var templateName = "#" + this.column + "Template";
  var template = compileTemplate(templateName);

  // create the html on the page and add the html
  // to the ListItem object for later access
  if (prepend) {
    list.prepend(template({data: this.data}))
    this.html = list.children().first();
  } else {
    list.append(template({data: this.data}))
    this.html = list.children().last();
  }
  // get the height property for later access
  this.css["height"] = this.html.css("height");

  // make it invisible upon creation, perhaps
  if (hide) {
    this.html.hide();
  }

  // add event handler
  if (this.type == "article") {
    addArticleClickEvent(this);
  }


}

// animate the list item -- make it expand
// to match the size of the pledges
ListItem.prototype.expand = function(expand) {

  // calculate the height at which we want to expand the div
  // it should match the height of the pledges
  var padding = 15;
  if (expand) {
    var height = 0;
    var pledges;

    // figure out which has more -- positive or negative pledges
    if (this.posPledges.length > this.negPledges.length) {
      pledges = this.posPledges;
    } else {
      pledges = this.negPledges;
    }

    // add up the heights of the selected (pos/neg) pledges
    for (var i = 0; i < pledges.length; i++) {
      height += parseInt(pledges[i].css["height"]);
    }

    // #math
    padding = height - (parseInt(this.html.css("height")) -
      parseInt(this.html.css("padding-top")) * 2);
    padding /= 2; // applied to paddingTop/Bot, so split in half
  }

  if (expand) {
    this.html.animate({
      paddingTop: (String(padding) + "px"),
      paddingBottom: (String(padding) + "px")
    }, ANIMATION_DURATION)
  }
  else {
    this.html.animate({
      paddingTop: "15px",
      paddingBottom: "15px"
    }, ANIMATION_DURATION);
  }
}


ListItem.prototype.createPledges = function(hide) {
  for (var i = 0; i < this.posPledges.length; i++) {
    this.posPledges[i].createHtml(true, hide);
  }
  for (var i = 0; i < this.negPledges.length; i++) {
    this.negPledges[i].createHtml(true, hide);
  }
}

ListItem.prototype.showPledges = function() {
  for (var i = 0; i < this.posPledges.length; i++) {
    this.posPledges[i].html.slideDown();
  }
  for (var i = 0; i < this.negPledges.length; i++) {
    this.negPledges[i].html.slideDown();
  }
}

function addArticleClickEvent(article) {
  article.html.click(function() {
    console.log("Clicked on an article.");
    getPledgesByArticle(article, true);
  })
}

// AJAX CALLS
//==========================================================

// get the articles w/ ajax call and display them w/ promise
function getAndDisplayArticles(count, hide) {
  $.ajax({
    url: "/api/articles"
  }).
  done(function(data) {
    console.log("Successfully got data from getAndDisplayArticles");

    // in case we are trying to access too many articles
    if (count >= data.length) { count = data.length; }

    for (var i = 0; i < count; i++) {
      var li = new ListItem(data[i], "midFeedList", "article");
      li.createHtml(true, hide);
    }
  })
}

function getPledgesByArticle(article, hide) {
  hide = hide || false;
  $.ajax({
    // TODO: replace w/ articleId
    url: "/api/articles/" + 1 + "/pledges"
  }).
  done(function(pledges) {
    console.log("Successfully got data from getPledgesByArticle");

    // reset the pledges it has if any
    article.posPledges.length = 0;
    article.negPledges.length = 0;
    for (var i = 0; i < pledges.length; i++) {
      if (pledges[i].positive) {
        console.log("going thru pos pledges: " + i);
        var li = new ListItem(pledges[i], "leftFeedList");
        article.posPledges.unshift(li);
      } else {
        console.log("going thru neg pledges: " + i);
        var li = new ListItem(pledges[i], "rightFeedList");
        article.negPledges.unshift(li);
      }
    }
    article.createPledges(true);
    article.showPledges();
    article.expand(true);
  });

}


// HELPERS
// ========================================
function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}

$(document).ready(function() {
  console.log("Loaded Article JS");
  getAndDisplayArticles(10, false);
})
