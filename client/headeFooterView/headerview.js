define('headerview', ['famous/core/EventEmitter'], function (require, exports, module) {
    var View = require("famous/core/View"),
        Surface = require("famous/core/Surface"),
        GridLayout = require("famous/views/GridLayout"),
        FlexibleLayout = require('famous/views/FlexibleLayout'),
        Modifier = require("famous/core/Modifier"),
        RenderNode = require("famous/core/RenderNode"),
        TransitionableTransform = require("famous/transitions/TransitionableTransform"),
        Transform = require('famous/core/Transform'),
        Transitionable = require("famous/transitions/Transitionable");

    function headerView() {
        View.apply(this, arguments);
        this.nodes = [];
        this.itemAdded = 1;
        this.header = new FlexibleLayout({
            ratios: this.options.ratios
        });
        //this.header.modifier = new Modifier();
        _bindEvents.call(this);
        _createHeaderView.call(this);
    }

    headerView.prototype = Object.create(View.prototype);
    headerView.prototype.constructor = headerView;

    headerView.DEFAULT_OPTIONS = {
        transition: {
            curve: 'easeInOut',
            duration: 700
        },
        ratios: [1, 0, 0]
    }

    function _bindEvents() {
        this._eventInput.on('headerClicked', function (index) {
            this.removeItem(index);
        }.bind(this));
    }

    function _updateheaderLayout(index) {
        this.header.setOptions({
            dimensions: [index ? index : this.nodes.length, 1]
        });
        this.header.sequenceFrom(this.nodes);
    }

    function _createHeaderView() {
        var that = this;

        for (var i = 0; i < 3; i++) {
            var node = new RenderNode();
            node.surface = new Surface({
                content: i === 0 ? 'Card' : '',
                size: [undefined, 200],
                opacity: 0.3,
                properties: {
                    textAlign: 'center',
                    lineHeight: '100px',
                    fontSize: '50px'
                }
            });
            node.surface.index = i;
            node.surface.on('click', function () {
                that._eventInput.emit('headerClicked', this.index);
                that._eventOutput.emit('headerClicked', this.index);
            });

            /*var contentModifier = new Modifier({
                size: [true, true],
                origin: [.45, .5]
            });
            node.contentSurface = new Surface({
                content: i === 0 ? 'Card' : '',
                properties: {
                    color: 'black',
                    zIndex: i,
                    fontSize: '50px'
                }
            });*/
            //node.add(contentModifier).add(node.contentSurface);

            node.add(node.surface);
            that.nodes.push(node);
        }

        this.header.sequenceFrom(this.nodes);
        this._add(this.header);
    }

    headerView.prototype.addItem = function (content) {
        var index = this.itemAdded;
        this.nodes[index].surface.setContent(content);
        this.itemAdded == 1 ? this.options.ratios = [1, 1, 0] : this.options.ratios = [1, 1, 1];
        this.header.setRatios(this.options.ratios, this.options.transition);
        this.itemAdded = this.itemAdded + 1;
    }

    headerView.prototype.removeItem = function (index) {
        var that = this;
        if (index == 2) return;
        if (index == 0) {
            this.options.ratios = [1, 0, 0];
            this.itemAdded = 1;
        } else {
            this.options.ratios = [1, 1, 0];
            this.itemAdded = 2;
        }
        this.header.setRatios(this.options.ratios, this.options.transition);
    }
    module.exports = headerView;
});
