define('cardview', ['famous/core/EventEmitter'], function (require, exports, module) {

    var RenderNode = require("famous/core/RenderNode"),
        Surface = require("famous/core/Surface"),
        ImageSurface = require("famous/surfaces/ImageSurface"),
        InputSurface = require("famous/surfaces/InputSurface"),
        GridLayout = require("gridlayout"),
        Lightbox = require("region"),
        Transition = require("transition"),
        View = require("famous/core/View"),
        Modifier = require("famous/core/Modifier"),
        EventHandler = require("famous/core/EventHandler"),
        EventMapper = require("famous/events/EventMapper"),
        Transform = require('famous/core/Transform'),
        Transitionable = require('famous/transitions/Transitionable'),
        Easing = require('famous/transitions/Easing'),
        Helpers = require('helpers'),
        EntityView = require('entityview'),
        ContainerSurface = require("famous/surfaces/ContainerSurface");

    var surfaceEvents = new EventHandler();

    function cardView() {
        View.apply(this, arguments);
        this.grid = new GridLayout({
            dimensions: [4, 2],
            gutterSize: [50, 50]
        });
        this.index;
        this.initialState = [];
        this.toggled = false;
        _createCardView.call(this);
        _bindEvents.call(this);
    }

    cardView.prototype = Object.create(View.prototype);
    cardView.prototype.constructor = cardView;

    cardView.DEFAULT_OPTIONS = {
        gridDimensions: [4, 2],
        gridGutterSize: [50, 50],
        transition: {
            duration: 700,
            curve: 'easeOutBounce'
        }
    }

    function _createCardView() {
        var that = this;
        Meteor.subscribe('cards', function () {
            var cards = Cards.find();
            var views = [];
            cards.forEach(function (doc, i) {
                var node = new RenderNode();
                node.type = doc.type;
                node.index = i;

                /*var imagesurface = new ImageSurface({
                    content: 'img/Food.jpg',
                    size: [undefined, undefined],
                    classes: ['center'],
                    properties: {
                        backgroundColor: 'gray',
                        color: "#404040",
                        lineHeight: '200px',
                    }
                });*/
                doc.index = i;
                console.log(doc);
                var imagesurface = new MeteorSurface({
                    template: Template.card,
                    size: [undefined, undefined],
                    data: doc,
                    classes: ['center']
                });
                imagesurface.modifier = new Modifier({
                    origin: [0, 0],
                });
                imagesurface.type = doc.type;
                imagesurface.index = i;
                var inputsurface = new Surface({
                    content: doc.type,
                    properties: {
                        color: 'black',
                        zIndex: 1,
                        textAlign: 'center',
                        fontSize: '50px',
                    }
                });

                inputsurface.modifier = new Modifier({
                    size: [true, true],
                    origin: [1, 1],
                    //transform: Transform.translate(imagesurface.getSize()[0] / 2, imagesurface.getSize()[1] / 2, 0)
                });
                imagesurface.on('click', function () {
                    that._eventInput.emit('SetEntityView', {
                        surface: this,
                        node: node
                    });
                });
                //node.add(inputsurface);
                node.add(imagesurface.modifier).add(imagesurface)
                //node.add(inputsurface.modifier).add(inputsurface);
                views.push(node);
            });
            that.grid.sequenceFrom(views);
        });
        this._add(this.modifier).add(this.grid);
    }


    function _bindEvents() {
        var that = this;
        /*this._eventInput.on('SetEntityView', function (opt) {
            return this._setEntityView(opt);
        }.bind(this));*/
        this._eventInput.on('SetEntityView', function (renderable) {
            var node = renderable.node;
            that.toggle(node.index);
            node.state = that.grid._states[node.index];
            node.modifier = that.grid._modifiers[node.index];
            node.state.origin = new Transitionable([.5, .5]);
            that._eventOutput.emit('setEntityView', renderable);
        });
    }

    function _initialState(state, index) {
        var initialState = {
            transform: state.transform.get()
        };
        this.initialState[index] = initialState;
    }

    cardView.prototype.toggle = function (index) {
        index === undefined ? this.index = this.index : this.index = index;
        this.grid._states.forEach(function (state, i) {
            if (i === this.index) {
                return;
            }
            if (!this.toggled) {
                _initialState.call(this, state, i);
                state.transform.set(Transform.multiply(Transform.thenMove(state.transform.get(), [100, 100]), Transform.scale(0, 0, 0)), this.options.transition);
            } else {
                state.transform.set(this.initialState[i].transform, this.options.transition);
            }
        }.bind(this));
        this.toggled = !this.toggled;
    }
    module.exports = cardView;
});
