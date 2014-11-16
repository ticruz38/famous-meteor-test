define('entity', function (require, exports, module) {
    var ImageSurface = require("famous/surfaces/ImageSurface"),
        Surface = require("famous/core/Surface"),
        Modifier = require("famous/core/Modifier"),
        EventHandler = require("famous/core/EventHandler"),
        View = require("famous/core/View"),
        Grid = require("famous/views/GridLayout"),
        RenderNode = require("famous/core/RenderNode"),
        ContainerSurface = require("famous/surfaces/ContainerSurface");


    function entity(entities) {
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
        _create.call(this, entities);

    }

    function _create(entities) {
        var that = this;
        entities.forEach(function (doc, i) {
            that.index++;
            var center = new Modifier({
                origin: [.5, .5]
            });
            var node = new ContainerSurface({
                align: [.5, .5],
                origin: [.5, .5],
            });
            var entity = new MeteorSurface({
                template: Template.entity,
                data: doc,
                classes: ['center']
            });
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
            entity.on('click', function () {
                console.log(node);
                that.curEntity = this;
                that._eventOutput.emit('clicked', {
                    surface: this,
                    node: node
                });
            });
            node.add(entity);
            //node.add(entity.inputModifier).add(entity.inputSurface);
            that.entities.push(entity);
            that.node.push(node);
            entity.data = doc;
            entity.index = i;
            entity.getState = function () {
                return that.grid._states[entity.index]
            };
            entity.getModifier = function () {
                return that.grid._modifiers[entity.index]
            };
        });
        this.grid.setOptions({
            dimensions: this.index < 3 ? [this.index, 2] : [3, Math.round(this.index / 3)]
        });
        this.grid.sequenceFrom(this.node);
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
