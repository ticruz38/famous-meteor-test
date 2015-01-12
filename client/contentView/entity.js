define('entity', function (require, exports, module) {
    var ImageSurface = require("famous/surfaces/ImageSurface"),
        Surface = require("famous/core/Surface"),
        Modifier = require("famous/core/Modifier"),
        EventHandler = require("famous/core/EventHandler"),
        CardSnap = require('card'),
        View = require("famous/core/View"),
        Grid = require("famous/views/GridLayout"),
        RenderNode = require("famous/core/RenderNode"),
        Transitionable = require('famous/transitions/Transitionable'),
        ContainerSurface = require("famous/surfaces/ContainerSurface");


    function entity(type) {
        this.entities = [];
        this.node = [];
        this.index = 0;
        this.grid = new Grid({
            gutterSize: [50, 50]
        });
        this.curEntity;
        this._initialState = [];
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        _create.call(this, type);

    }

    function _create(type) {
        var that = this;
        Meteor.subscribe('entity', function () {
            Blaze.renderWithData(Template.entity,
                Entity.find({
                    type: type
                }), Body)
        });

        Template.entity.rendered = function () {
            console.log(this, this.data);
            this.findAll('.item').forEach(function (item, i) {
                that.index++;
                var data = this.data.fetch()[i];
                console.log(data);
                var node = new RenderNode();
                node.index = i;
                node.data = data;

                node.surface = new Surface({
                    content: item,
                    classes: ['center']
                });
                node.surface.modifier = new Modifier({
                    origin: [0, 0]
                });
                node.surface.on('click', function () {
                    console.log(node, "node.surface");
                    that.curEntity = this;
                    that._eventOnput.emit('clicked', {
                        surface: this,
                        node: node
                    });
                });
                node.getState = function () {
                    return _getState.call(that, node.index);
                };
                node.getModifier = function () {
                    return _getModifier.call(that, node.index);
                };
                var cardSnap = new CardSnap(item);
                node.add(node.surface.modifier).add(node.surface);
                that.node.push(node);

            }.bind(this));
            that.grid.setOptions({
                dimensions: that.index < 3 ? [that.index, 2] : [3, Math.round(that.index / 3)]
            });
            that.grid.sequenceFrom(that.node);
        }

        /*function _create(context) {
        var that = this;
        Session.set('entity', true);
        context.findAll('.item').forEach(function (item, i) {
            that.index++;
            var data = context.view._domrange.members[0].members[i].view.dataVar.curValue;
            console.log(data);
            var node = new RenderNode();
            node.index = i;
            node.data = data;

            node.surface = new Surface({
                content: item,
                classes: ['center']
            });
            node.surface.modifier = new Modifier({
                origin: [0, 0]
            });
            node.surface.on('click', function () {
                console.log(node, "node.surface");
                that.curEntity = this;
                that._eventOnput.emit('clicked', {
                    surface: this,
                    node: node
                });
            });
            node.getState = function () {
                return _getState.call(that, node.index);
            };
            node.getModifier = function () {
                return _getModifier.call(that, node.index);
            };
            //var cardSnap = new CardSnap(item);
            node.add(node.surface.modifier).add(node.surface);
            that.node.push(node);
            that.grid.setOptions({
                dimensions: that.index < 3 ? [that.index, 2] : [3, Math.round(that.index / 3)]
            });
            console.log(that.node);
            that.grid.sequenceFrom(that.node);
            console.log(that.grid);
        });*/


        /*entity.inputModifier = new Modifier({
                size: [true, true],
                origin: [0, .5],
            });
            entity.inputSurface = new Surface({
                content: doc.name,
                classes: ['center'],
                properties: {
                    color: 'black',
                    zIndex: 2,
                    textAlign: 'center',
                    fontSize: '50px'
                }
            });*/
        //node.add(entity.inputModifier).add(entity.inputSurface);

    }

    function _initialState(index) {
        this.initialState = [];
        this.grid._states.forEach(function (state) {
            var initialState = {
                transform: state.transform.get(),
                opacity: state.opacity.get(),
                size: state.size.get()
            };
            this.initialState.push(initialState);
        }.bind(this));
        if (index !== undefined) {
            return this.initialState[index];
        } else {
            return this.initialState;
        }
    }

    function _getState(index) {
        var state = this.grid._states[index];
        state.origin = new Transitionable([0.5, 0.5]);
        return state;
    }

    function _getModifier(index) {
        var modifier = this.grid._modifiers[index],
            state = this.grid._states[index];
        modifier.originFrom(state.origin);
        return modifier;
    }
    entity.prototype.getActive = function () {
        this.curEntity.state = this.grid._states[this.curEntity.index];
        this.curEntity.initialState = _initialState.call(this, this.curEntity.index);
        return this.curEntity;
    }
    entity.prototype.reset = function () {
        this.entities = [];
        this.index = 0;
    }
    entity.prototype.getInitialState = function (index) {
        return _initialState.call(this, index);
    }

    module.exports = entity;
});
