define('cardview', function (require, exports, module) {

    var RenderNode = require("famous/core/RenderNode"),
        Surface = require("famous/core/Surface"),
        ImageSurface = require("famous/surfaces/ImageSurface"),
        InputSurface = require("famous/surfaces/InputSurface"),
        GridLayout = require("famous/views/GridLayout"),
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
        CardSnap = require('card'),
        ContainerSurface = require("famous/surfaces/ContainerSurface");

    var surfaceEvents = new EventHandler();

    function cardView() {
        View.apply(this, arguments);
        this.grid = new GridLayout({
            dimensions: [4, 2],
            gutterSize: [50, 50]
        });
        this.index;
        this.cards = [];
        this.initialState = [];
        this.toggled = false;
        _createView.call(this);
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

    function _createView() {
        var that = this;
        Meteor.subscribe('cards', function () {
            var cards = Cards.find();
            Template.card.cards = cards;
            var ContainerSurface = new MeteorSurface({
                template: Template.card,
                size: [undefined, undefined],
                classes: ['container']
            });

            Template.card.rendered = function () {
                this.findAll('.item').forEach(function (item, i) {
                    var data = this.view._domrange.members[0].members[i].view.dataVar.curValue; //access Data item
                    var node = new RenderNode();
                    node.index = i;
                    node.type = data.type;
                    node.surface = new Surface({
                        content: item,
                        classes: ['center']
                    });
                    node.surface.modifier = new Modifier({
                        origin: [0, 0]
                    });
                    node.surface.on('click', function () {
                        that._eventInput.emit('SetEntityView', {
                            surface: this,
                            node: node
                        });
                    });
                    var cardSnap = new CardSnap(item);
                    node.add(node.surface.modifier).add(node.surface);
                    that.cards.push(node);
                }.bind(this));
            }
            that._add(ContainerSurface);
            that.grid.sequenceFrom(that.cards);
        });
        this._add(this.grid);
    }


    function _bindEvents() {
        var that = this;
        /*this._eventInput.on('
                            SetEntityView ', function (opt) {
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

    cardView.prototype.add = function (surface) {
        this.cards.push(surface);
        this.grid.sequenceFrom(that.cards);
    }
    module.exports = cardView;
});
