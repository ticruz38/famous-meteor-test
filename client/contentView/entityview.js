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
        Flipper = require("famous/views/Flipper"),
        DetailView = require('detailview'),
        EntitySurface = require('entity'), // not Entity since it's allready the name of the collection
        Helpers = require('helpers'),
        ContainerSurface = require("famous/surfaces/ContainerSurface");

    var surfaceEvents = new EventHandler();

    function entityView(id) {
        View.apply(this, arguments);
        this.options = Object.create(entityView.DEFAULT_OPTIONS);

        this._showing = false;
        this.detailView = new DetailView();
        this.initialState = {};
        this.toggled = false;
        this.index;
        this.toggleState = [];
        this.entitySurface;
        _bindEvents.call(this);
    }
    entityView.prototype = Object.create(View.prototype);
    entityView.prototype.constructor = entityView;

    entityView.DEFAULT_OPTIONS = {
        transition: {
            duration: 2000,
            curve: 'easeIn'
        },
        finalState: {
            transform: Transform.rotateX(Math.PI),
            origin: [0.5, 0.5],
            opacity: 1,
            size: [Helpers.winWidth, Helpers.winHeight - 200]
        }
    }

    /*function _toggleView(index) {
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
    }*/

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
        this.entities = new ContainerSurface({
            align: [.5, .5],
            origin: [.5, .5],
            size: [window.innerWidth, window.innerHeight - 200]
        });
        Meteor.subscribe('entity', function () {
            var entity = Entity.find({
                type: id
            });
            this.entitySurface = new EntitySurface(entity);
            /*entity.forEach(function (doc, i) {
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
            }.bind(this));*/
            var center = new Modifier({
                origin: [0, .5],
            });
            this.entitySurface.on('clicked', function (surface) {
                console.log(surface.index);
                that.toggle(surface.index);
                that._eventOutput.emit('setDetailView', surface.data);
                that.detailView.setDetailView(this);
            });
            this.entities.add(this.entitySurface.grid);
            //this.entities.add(this.detailView);
            //this.grid.sequenceFrom(this.entitySurface.entities);
        }.bind(this));
        //
    }

    entityView.prototype.setEntityView = function (renderables) {
        if (this._showing) {
            return;
        }
        /*var flipper = new Flipper();
        flipper.setFront(surface);
        flipper.setBack(this.entities);*/
        var surface = renderables.surface;
        var node = renderables.node;
        _createInitialState.call(this, node.state);
        _createView.call(this, node.type);
        var back = new Modifier({
            align: [.5, .5],
            origin: [0.5, 0.5],
            size: surface.getSize(),
            transform: Transform.multiply(Transform.rotateX(Helpers.degree * 180), Transform.translate(0, 0, 0))
            //transform: Transform.rotateX(Math.PI)
        });
        surface.center = new Modifier({
            align: [.5, .5],
            origin: [.5, .5],

        });
        node.add(surface.center).add(back).add(this.entities);
        var finalState = this.options.finalState;

        node.state.transform.set(finalState.transform, this.options.transition);
        node.state.origin.set(finalState.origin, this.options.transition);
        node.state.opacity.set(finalState.opacity, this.options.transition);
        node.state.size.set(finalState.size, this.options.transition);
        //this._node.set(surface.modifier).add(surface); //using renderNode set method
        //flipper.setAngle(Math.PI, this.options.transition); this function does'nt get started
        this._add(node.modifier).add(surface);
        //this._node.set(node.modifier).add(node);
        this._showing = !this._showing;
    }

    entityView.prototype.resetEntityView = function () {
        var transition = this.options.transition;
        this.entities.state.transform.set(this.initialState.transform, transition);
        this.entities.state.origin.set(this.initialState.origin, transition);
        this.entities.state.opacity.set(this.initialState.opacity, transition);
        this.entities.state.size.set(this.initialState.size, transition);
        this.entities = {};
        this.entitySurface.reset();
        this._showing = !this._showing;
    }

    entityView.prototype.toggle = function (index) {
        this.index = (index === undefined) ?
            this.index : index;
        var states = this.entitySurface.getInitialState();
        this.entitySurface.grid._states.forEach(function (state, i) {
            if (i === this.index) {
                return;
            }
            if (!this.toggled) {
                //_initialState.call(this, state, i);
                state.transform.set(Transform.multiply(Transform.thenMove(state.transform.get(), [100, 100]), Transform.scale(0, 0, 0)), this.options.transition);
            } else {
                state.transform.set(states[i].transform, this.options.transition);
            }
        }.bind(this));
        this.toggled = !this.toggled;
    }

    entityView.prototype.removeDetails = function () {
        this.detailView.toggle();
    }
    module.exports = entityView;
});
