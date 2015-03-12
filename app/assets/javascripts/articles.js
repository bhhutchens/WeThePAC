var pathname = location.pathname
var ANIMATION_DURATION = 1000;
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
  this.clicked = false;

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
  if (this.type == "pledge") {
    console.log("Type: pledge. Positive: " + this.data.positive);
    if (this.data.positive) {
      this.html.find(".positive_icon").show();
      this.html.addClass("positive-tweet");
    } else if (!this.data.positive) {
      this.html.find(".negative_icon").show();
      this.html.addClass("negative-tweet");
    }
  }

}

// animate the list item -- make it expand
// to match the size of the pledges
ListItem.prototype.animateSize = function(expand) {

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
    this.posPledges[i].type = "pledge";
    this.posPledges[i].createHtml(true, hide);
  }
  for (var i = 0; i < this.negPledges.length; i++) {
    this.negPledges[i].type = "pledge";
    this.negPledges[i].createHtml(true, hide);
  }
}

ListItem.prototype.calcDistFromTop = function() {
  var distance = 0;
  var id = this.data.id;
  var children = $("#"+this.column).children();
  for (var i = 0; i < children.length; i++) {
    if (parseInt(children.eq(i).attr("data-id")) == parseInt(id)) {
      return distance;
    } else {
      distance += parseInt(children.eq(i).css("height"));
    }
  }
}

ListItem.prototype.toggleSidePadding = function(paddingOn) {
  if(paddingOn) {
    var paddingAmt = this.calcDistFromTop();
    $("#leftFeedList").css("paddingTop", paddingAmt);
    $("#rightFeedList").css("paddingTop", paddingAmt);
  }
  else {
    $("#leftFeedList").css("paddingTop", 0);
    $("#rightFeedList").css("paddingTop", 0);
  }
}
ListItem.prototype.showPledges = function() {
  for (var i = 0; i < this.posPledges.length; i++) {
    this.posPledges[i].html.slideDown({duration: ANIMATION_DURATION});
  }
  for (var i = 0; i < this.negPledges.length; i++) {
    this.negPledges[i].html.slideDown({duration: ANIMATION_DURATION});
  }
}

ListItem.prototype.onExpand = function() {
  this.createPledges(true);
  this.showPledges();
  this.animateSize(true);
  this.toggleSidePadding(true);
}

ListItem.prototype.clearPledges = function() {
  this.posPledges.length = 0;
  this.negPledges.length = 0;
  clearSideColumns();
}

ListItem.prototype.onCollapse = function() {
  this.clearPledges();
  this.toggleSidePadding(false);
  this.animateSize(false); // collapse
}

ListItem.prototype.slideDown = function() {
  console.log("SLIDING DOWN: " + this);
  this.html.slideDown({
    duration: ANIMATION_DURATION,
    queue: false});
  this.html.css("opacity", 0).animate({
    opacity: 1
  }, ANIMATION_DURATION);
}

function addArticleClickEvent(article) {
  article.html.click(function() {
    console.log("Clicked on an article.");
    var clicked = article.clicked;
    article.clicked = !clicked; // swap value
    if (!clicked) {
      getPledgesByArticle(article);
    }
    else {
      article.onCollapse();
    }
  })
}

// AJAX CALLS
//==========================================================
// get articles specific to the rep whose page this call should originate from
function getRepsArticles(repId) {
  $.ajax({
    url: "/api/reps/"+repId+"/articles"
  }).
  done(function(data){
    console.log("success gettingRepsArticles");
    $.each(data, function(index, article) {
      var li = new ListItem(data[index], "midFeedList", "article");
      li.createHtml(true, false);
    })
  }) // why are there no fail conditions?
}



// get the articles w/ ajax call and display them w/ promise
function getAndDisplayArticles(count, hide) {
  console.log("getting and displaying articles");
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

  url = "/api/articles/" + article.id + "/pledges"
  $.ajax({
    // TODO: replace w/ articleId
   url: url,
   data: {rep_id: repId}
  }).
  done(function(pledges) {
    console.log("Successfully got data from getPledgesByArticle");

    // reset the pledges it has if any
    article.posPledges.length = 0;
    article.negPledges.length = 0;
    var posPledges = 0;
    var negPledges = 0;
    for (var i = 0; i < pledges.length; i++) {
      if (pledges[i].positive && posPledges < 3) {
        console.log("going thru pos pledges: " + i);
        var li = new ListItem(pledges[i], "leftFeedList");
        article.posPledges.unshift(li);
        posPledges++;
      } else if (!pledges[i].positive && negPledges < 3) {
        console.log("going thru neg pledges: " + i);
        var li = new ListItem(pledges[i], "rightFeedList");
        article.negPledges.unshift(li);
        negPledges++;
      }
    }
    // SPAWN EVERYTHING
    article.onExpand();
  });
}


function displayPledge(pledge, prepend, hidden, animate) {
  pledge.createHtml(prepend, hidden);

  // make it slide into existence
  if (animate) {
    pledge.slideDown();
  }
}

// take the pledges from the middle feed list column
// and create the html
// and prepend it
// and stuff
function displayPledges() {
  var pledges = ListItems.midListItems;
  for (var i = 0; i < pledges.length; i++) {
    var pledge = pledges[i];
    console.log(pledge + "..." + i);
    displayPledge(pledge, true, true, true);
  }
}

// use ajax call to get pledges from repId
function getAndDisplayAllPledges(count) {
  $.ajax({
    url: "/api/activity_feed"
  }).
  done(function(data) {
    console.log("Getting pledges from activity feed. SUCCESS");
    if (count >= data.length) {
      count = data.length;
    }
    for (var i = 0; i < count; i++) {
      var li = new ListItem(data[i], "midFeedList");
      li.type = "pledge";
    }
    displayPledges();
  }).
  fail(function(data) {
    console.log("Tried to get pledges from activity feed. FAILED");
  })
}


// HELPERS
// ========================================
function compileTemplate (selector) {
  return Handlebars.compile($(selector).html());
}

function clearColumn(colName) {
  $(colName).children().remove();
}

function clearSideColumns() {
  clearColumn("#leftFeedList");
  clearColumn("#rightFeedList");
}

var repId = location.pathname.match(/\d*$/)[0]
$(document).ready(function() {
  console.log("Loaded Article JS");
  //getAndDisplayArticles(10, false);

  // start getting the articles from a particular rep
  if (repId > 0) {
    getRepsArticles(repId);
  }
  else {
    //getAndDisplayArticles(10, false);
  }
})
