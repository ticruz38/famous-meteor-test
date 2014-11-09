famous.core.famous;

Meteor.startup(function () {

    var Engine = require('famous/core/Engine'),
        Surface = require('famous/core/Surface'),
        Modifier = require("famous/core/Modifier"),
        View = require("famous/core/View"),
        ContainerSurface = require('famous/surfaces/ContainerSurface'),
        HeaderFooterLayout = require("famous/views/HeaderFooterLayout"),
        cardView = require("cardview"),
        headerView = require('headerview'),
        entityView = require('entityview'),
        mainContext = Engine.createContext();

    /*var layout = new HeaderFooterLayout();

    var container = new ContainerSurface({
        size: [undefined, 200]    });
    container.add(new HeaderView());

    layout.header.add(container);

    layout.content.add(new cardView());

    layout.footer.add(new Surface({
        size: [undefined, 50],
        content: "Footer",
        classes: ["red-bg"],
        properties: {
            lineHeight: "50px",
            textAlign: "center"
        }
    }));
    mainContext.setPerspective(2000);
    mainContext.add(layout);*/

    function appView() {
        View.apply(this, arguments);
        this.layout = new HeaderFooterLayout();
        this.cardView = new cardView();
        this.entityView = new entityView();
        this.headerView = new headerView();
        this.layout.content.add(this.cardView);
        this.layout.content.add(this.entityView);
        this._add(this.layout);
        _createHeaderView.call(this);
        _setListeners.call(this);
    }

    appView.prototype = Object.create(View.prototype);
    appView.prototype.constructor = appView;

    appView.DEFAULT_OPTIONS = {}

    function _createHeaderView() {
        this.headerContainer = new ContainerSurface({
            size: [undefined, 200]
        });
        this.headerContainer.add(this.headerView);
        this.layout.header.add(this.headerContainer);
    }

    function _setListeners() {
        this.cardView.on('setEntityView', function (surface) {
            this.headerView.addItem(surface.type);
            this.entityView.setEntityView(surface);
        }.bind(this));
        this.headerView.on('headerClicked', function (index) {
            if (index === 0) {
                this.entityView.resetEntityView();
                this.cardView.toggle();
            } else {
                this.entityView.removeDetails();
                this.entityView.toggle();
            }
        }.bind(this));
        this.entityView.on('setDetailView', function (data) {
            this.headerView.addItem(data.name);
        }.bind(this));
    }
    var mainContext = Engine.createContext();
    var appView = new appView();

    mainContext.add(appView);
});
