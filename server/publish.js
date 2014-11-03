Cards = new Meteor.Collection("cards");
Entity = new Meteor.Collection("entity");
Meteor.publish('cards', function () {
    return Cards.find();
});
Meteor.publish('entity', function () {
    return Entity.find();
});
