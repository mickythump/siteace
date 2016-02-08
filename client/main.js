Meteor.subscribe("websites");
// Meteor.subscribe("comments");

//infiniscroll
Session.set("websitesLimit", 8);

lastScrollTop = 0;
$(window).scroll(function(event) {
  if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    var scrollTop = $(this).scrollTop();

    if(scrollTop > lastScrollTop) {
      Session.set("websitesLimit", Session.get("websitesLimit") + 4);
    }

    lastScrollTop = scrollTop;
  }
})

//Comments configuration
Comments.ui.config({
   template: 'bootstrap' // or ionic, semantic-ui
});

/////
// template helpers
/////

// helper function that returns all available websites
Template.website_list.helpers({
  websites: function() {
    if(!Session.get("keywords")) {
      return Websites.find({}, {
        sort: {
          rating: -1,
          createdOn: -1
        },
        limit: Session.get("websitesLimit")
      });
    }
    // { $text: { $search: "coffee" } }
    else {
      return Websites.find({
        $or: [
          {title: {$regex: Session.get("keywords"), $options: 'i'}},
          {description: {$regex: Session.get("keywords"), $options: 'i'}}
        ]
      }, {
        sort: {
          rating: -1,
          createdOn: -1
        },
        limit: Session.get("websitesLimit")
      });
    }
  }
});

//helper function which returns formatted createdOn date
Template.website_item.helpers({
  date: function() {
    var website = Websites.findOne({
      _id: this._id
    });
    var date = website.createdOn;
    var datestring = ("0" + date.getDate()).slice(-2) + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" +
    date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    return datestring;
  }
});

Template.website_details.helpers({
  date: function() {
    var website = Websites.findOne({
      _id: this._id
    });
    var date = website.createdOn;
    var datestring = ("0" + date.getDate()).slice(-2) + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" +
    date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    return datestring;
  }
});

//helper which checks if user is logged in determined whether or not show him "add" button
Template.navbar.helpers({
  isLoggedIn: function() {
    if(Meteor.userId()) {
      return true;
    }
    else {
      return false;
    }
  }
})


/////
// template events
/////

Template.website_item.events({
  "click .js-upvote": function(event) {
    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id = this._id;
    // put the code in here to add a vote to a website!
    var item = Websites.findOne({
      _id: website_id
    });
    var rating = item.rating;
    rating++;

    Websites.update({
      _id: website_id
    }, {
      $set: {
        rating: rating
      }
    });
    return false; // prevent the button from reloading the page
  },
  "click .js-downvote": function(event) {

    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id = this._id;
    // put the code in here to remove a vote from a website!
    var item = Websites.findOne({
      _id: website_id
    });
    var rating = item.rating;
    rating--;

    Websites.update({
      _id: website_id
    }, {
      $set: {
        rating: rating
      }
    });
    return false; // prevent the button from reloading the page
  }
})

Template.navbar.events({
  "submit .js-search-keywords": function(event) {
    event.preventDefault();
    var keyword = event.target.keywords.value;
    Session.set("keywords", ".*" + keyword + ".*");
  }
})

Template.website_form.events({
  "submit .js-save-website-form": function(event) {

    // here is an example of how to get the url out of the form:
    var url = event.target.url.value;
    var title = event.target.title.value
    var desc = event.target.description.value

    //  put your website saving code in here!
    if(Meteor.user()) {
      var id = Meteor.call("addWebsite", url, title, desc, function(err, res) {
          if (!err) {
            Session.set("webid", res);
          }
        });
    }
    return false; // stop the form submit from reloading the page

  }
});
