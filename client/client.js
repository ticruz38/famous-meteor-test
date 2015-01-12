Meteor.startup(function () {
    Cards = new Meteor.Collection("cards");
    Entity = new Meteor.Collection("entity");
    SVG = new FS.Collection("svg", {
        stores: [new FS.Store.FileSystem('svg', {
        path: "~/app-files/images"})]
    });
    SVG.allow({
        'insert': function() {
            return true;
        },
        'update': function() {
            return true;
        }
    });

    Meteor.subscribe("cards");
    Meteor.subscribe("entity");
    Meteor.subscribe("svg");
});
