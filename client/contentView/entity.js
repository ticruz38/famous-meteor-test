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
                align: [.5,.5],
                origin: [.5,.5],
                size: [window.innerWidth, window.innerHeight-200]
            });
            var entity = new ImageSurface({
                content: 'img/Food.jpg',
                classes: ['center'],
                size: [true, undefined],
                properties: {
                    backgroundColor: 'gray',
                    color: "#404040",
                    textAlign: 'center',
                }
            });
            entity.inputModifier = new Modifier({
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
            });
            entity.on('click', function () {
                that.curEntity = this;
                that._eventOutput.emit('clicked', this);
            });
            node.add(entity);
            node.add(entity.inputModifier).add(entity.inputSurface);
            that.entities.push(entity);
            that.node.push(node);
            entity.data = doc;
            entity.index = i;
        });
        console.log(this.index, this.entities);
        this.grid.setOptions({
            dimensions: this.index < 3 ? [this.index, 1] : [3, Math.round(this.index / 3)]
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
        console.log(this.curEntity.initialState);
        return this.curEntity;
    }
    entity.prototype.reset = function () {
        console.log('reset');
        this.entities = [];
        this.index = 0;
    }
    entity.prototype.getInitialState = function (index) {
        return _initialState.call(this);
    }

    module.exports = entity;
});
