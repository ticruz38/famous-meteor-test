define('appview', function (require, exports, module) {
    var Surface = require('famous/core/Surface'),
        Modifier = require("famous/core/Modifier"),
        View = require("famous/core/View"),
        ContainerSurface = require('famous/surfaces/ContainerSurface'),
        HeaderFooterLayout = require("famous/views/HeaderFooterLayout"),
        cardView = require("cardview"),
        headerView = require('headerview'),
        entityView = require('entityview');

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
            origin: [0, 0],
            size: [undefined, 200]
        });
        this.headerContainer.add(this.headerView);
        this.layout.header.add(this.headerContainer);
    }

    function _setListeners() {
        this.cardView.on('setEntityView', function (renderable) {
            var surface = renderable.surface;
            this.headerView.addItem(surface.type);
            this.entityView.setEntityView(renderable);
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
    module.exports = appView;
});
