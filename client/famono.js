famous.polyfills;
famous.core.famous;
var Engine = require('famous/core/Engine'),
    cardView = require('cardview'),
    AppView = require('appview');

Meteor.startup(function () {
    var CardView = new cardView();
    var appView = new AppView();
    console.log(CardView);
    var mainContext = Engine.createContext();
    mainContext.add(appView);
});
