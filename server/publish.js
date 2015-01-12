Cards = new Meteor.Collection("cards");
Entity = new Meteor.Collection("entity");
SVG = new FS.Collection("svg", {
    stores: [new FS.Store.FileSystem('svg', {
        path: "~/app-files/images"})]
});
SVG.allow({
    'insert': function () {
        return true;
    },
    'update': function () {
        return true;
    }
});
Meteor.publish('cards', function () {
    return Cards.find();
});
Meteor.publish('entity', function () {
    return Entity.find();
});
Meteor.publish('svg', function () {
    return SVG.find();
});
