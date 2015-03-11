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


