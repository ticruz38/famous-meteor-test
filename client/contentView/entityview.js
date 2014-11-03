define('entityview', function (require, exports, module) {
    var Surface = require("famous/core/Surface"),
        ImageSurface = require("famous/surfaces/ImageSurface"),
        InputSurface = require("famous/surfaces/InputSurface"),
        RenderNode = require("famous/core/RenderNode"),
        GridLayout = require("famous/views/GridLayout"),
        Modifier = require("famous/core/Modifier"),
        ViewSequence = require("famous/core/ViewSequence"),
        View = require("famous/core/View"),
        EventHandler = require("famous/core/EventHandler"),
        Transitionable = require('famous/transitions/Transitionable'),
        Transform = require('famous/core/Transform'),
        DetailView = require('detailview'),
        Helpers = require('helpers');

    var surfaceEvents = new EventHandler();

    function entityView(id) {
        View.apply(this, arguments);
        this.options = Object.create(entityView.DEFAULT_OPTIONS);
        this.grid = new GridLayout({
            dimensions: [4, 2],
            gutterSize: [50, 50]
        });
        this._showing = false;
        this.detailView = new DetailView();
        this.initialState = {};
        this.toggled = false;
        this.index;
        this.toggleState = [];
        this.views = [];
        _bindEvents.call(this);
    }
    entityView.prototype = Object.create(View.prototype);
    entityView.prototype.constructor = entityView;

    entityView.DEFAULT_OPTIONS = {
        transition: {
            duration: 700,
            curve: 'easeOutBounce'
        },
        finalState: {
            transform: Transform.rotateX(Math.PI),
            origin: [0.5, 0.5],
            opacity: 1,
            size: [Helpers.winWidth, Helpers.winHeight - 200]
        }
    }

    function _toggleView(index) {
        var transition = this.options.transition;
        this.grid._states.forEach(function (state, i) {
            if (i === index) {
                return;
            }
            if (!this.toggled) {
                state.opacity.set(0, transition);
                state.transform.set(Transform.translate(10, 10, 100), transition);
            } else {
                state.opacity.set(1, transition)
            }
        });
        this.toggled = !this.toggled;
    }

    function _bindEvents() {
        var that = this;
        this._eventInput.on('setDetailView', function (surface) {
            that.toggle(surface.index);
            surface.state = that.grid._states;
            surface.modifier = that.grid._modifiers[surface.index];
            that.detailView.setDetailView(surface);
            that._eventOutput.emit('setDetailView', surface.data);
        });
    }

    function _createInitialState(state) {
        var initialState = this.initialState;
        initialState.transform = state.transform.get();
        initialState.origin = state.origin.get();
        initialState.opacity = state.opacity.get();
        initialState.size = state.size.get();
    }

    function _createView(id) {
        var that = this;
        this.entities = new RenderNode();
        Meteor.subscribe('entity', function () {
            var entity = Entity.find({
                type: id
            });

            entity.forEach(function (doc, i) {
                var view = new View();
                var entities = new ImageSurface({
                    content: 'img/Food.jpg',
                    size: [true, undefined],
                    properties: {
                        backgroundColor: 'gray',
                        color: "#404040",
                        textAlign: 'center',
                    }
                });
                entities.inputModifier = new Modifier({
                    size: [true, true],
                    origin: [0, .5],
                });
                entities.views = this.views
                entities.data = doc;
                entities.index = i;
                entities.inputSurface = new Surface({
                    content: doc.name,
                    properties: {
                        color: 'black',
                        zIndex: 2,
                        textAlign: 'center',
                        lineHeight: '50px',
                        fontSize: '50px',
                    }
                });

                entities.on('click', function () {
                    that._eventInput.emit('setDetailView', this);
                });
                view.entities = entities;
                view.add(entities);
                view.add(entities.inputModifier).add(entities.inputSurface);
                this.views.push(view);
            }.bind(this));
            this.grid.sequenceFrom(this.views);
        }.bind(this));
        this.entities.add(this.grid.modifier).add(this.grid);
        this.entities.add(this.detailView);
    }

    entityView.prototype.setEntityView = function (surface) {
        if (this._showing) {
            return;
        }
        _createInitialState.call(this, surface.state);
        _createView.call(this, surface.type);
        this.entities.node = new RenderNode();
        var back = new Modifier({
            origin: [0.5, 0.5],
            transform: Transform.multiply(Transform.rotateX(Helpers.degree * 180), Transform.translate(0, 0, 20))
        });
        //this.entities.node.add(surface);
        this.entities.node.add(back).add(this.entities);
        var finalState = this.options.finalState;
        this.entities.state = surface.state;
        this.entities.modifier = new Modifier({
            transform: this.entities.state.transform,
            opacity: this.entities.state.opacity,
            size: this.entities.state.size,
            origin: this.entities.state.origin
        });
        this._add(this.entities.modifier).add(this.entities.node);

        this.entities.state.transform.set(finalState.transform, this.options.transition);
        this.entities.state.origin.set(finalState.origin, this.options.transition);
        this.entities.state.opacity.set(finalState.opacity, this.options.transition);
        this.entities.state.size.set(finalState.size, this.options.transition);
        this._showing = !this._showing;
    }

    entityView.prototype.resetEntityView = function () {
        var transition = this.options.transition;
        this.entities.state.transform.set(this.initialState.transform, transition);
        this.entities.state.origin.set(this.initialState.origin, transition);
        this.entities.state.opacity.set(this.initialState.opacity, transition);
        this.entities.state.size.set(this.initialState.size, transition);
        this.views = [];
        this.entities = {};
        this._showing = !this._showing;
    }
    // _initialState private functions is writing here cause its directly join to prototype.toggle
    function _initialState(state, index) {
        var initialState = {
            transform: state.transform.get()
        };
        this.toggleState[index] = initialState;
    }
    entityView.prototype.toggle = function (index) {
        index === undefined ? this.index = this.index : this.index = index;
        this.grid._states.forEach(function (state, i) {
            if (i === this.index) {
                return;
            }
            if (!this.toggled) {
                _initialState.call(this, state, i);
                state.transform.set(Transform.multiply(Transform.thenMove(state.transform.get(), [100, 100]), Transform.scale(0, 0, 0)), this.options.transition);
            } else {
                state.transform.set(this.toggleState[i].transform, this.options.transition);
            }
        }.bind(this));
        this.toggled = !this.toggled;
    }

    entityView.prototype.removeDetails = function () {
        this.detailView.toggle();
    }
    module.exports = entityView;
});
