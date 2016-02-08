Websites = new Mongo.Collection("websites");

Websites.allow({
  insert: function(userId, doc) {
    if (!Meteor.user()) {
      return false;
    } else {
      return true;
    }
  },

  update: function(userId, doc) {
    return true;
  }
})
