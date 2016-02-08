Meteor.publish("websites", function(){
  return Websites.find();
});

Meteor.methods({
  addWebsite:function(url, title, desc){
     var website;
     if (!this.userId) { //not logged in
       return;
     } else {
       website = {
         owner: this.userId,
         createdOn: new Date(),
         url: url,
         title: title,
         description: desc,
         rating: 0
       };
       var id = Websites.insert(website);
       return id;
     }
  }
});
