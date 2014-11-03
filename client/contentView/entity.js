define('entity', function (require, exports, module) {
    var ImageSurface = require("famous/surfaces/ImageSurface"),
        Surface = require("famous/core/Surface"),
        EventHandler = require("famous/core/EventHandler"),
        RenderNode = require("famous/core/RenderNode");

    function entity(entities) {
        this.entities = [];
        this.currentEntity;
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        _create.call(this, entities);

    }

    function _create(entities) {
        var that = this;
        entities.forEach(function (doc, i) {
            var node = new RenderNode();
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
            entities.inputSurface = new Surface({
                content: doc.name,
                properties: {
                    color: 'black',
                    zIndex: 2,
                    textAlign: 'center',
                    fontSize: '50px'
                }
            });
            this.entities.push(node);
            entities.data = doc;
            entities.index = i;
        });

        entities.on('click', function () {
            that._eventOutput.emit('entityClicked', this);
            that.currentEntity = this;
        });
        return this.entities;
    }
});
