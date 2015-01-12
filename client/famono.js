famous.polyfills;
famous.core.famous;
require("snap.svg");
/*Template.registerHelper("eachCards", function(){
    Blaze.Each(function(){
        Meteor.subscribe('cards');
        var cards = Cards.find();
        var data = cards? cards: null;
        return data;
    }, function(){
        return
    })
})*/ //tried to render the grid at spacebars level... tricky
var Tracker = require('size-tracker'),
    AppView = require('appview'),
    Engine = require('famous/core/Engine');

Meteor.startup(function () {
    var mainContext = Engine.createContext();
    wideContext = Engine.getContexts()[0]._nodeContext;
    Body = document.getElementsByTagName('BODY')[0];
    //Body.className = "famous-container";
    tracker = new Tracker();
    appView = new AppView();
    //Meteor.subscribe()
    mainContext.add(appView);
});
