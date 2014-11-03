Meteor.startup(function () {
    Cards = new Meteor.Collection("cards");
    Entity = new Meteor.Collection("entity");

    Meteor.subscribe("cards");
    Meteor.subscribe("entity");

});
