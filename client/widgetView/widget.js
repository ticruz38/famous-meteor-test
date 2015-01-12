define('widget', function (require, exports, module) {

    var Surface = require('famous/core/Surface'),
        ElementOutput = require('famous/core/ElementOutput');

    function widget(svg, data) {
        ElementOutput.call(this);

        this.options = {};

        this.properties = {};
        this.attributes = {};
        this.content = '';
        this.classList = [];
        this.size = null;

        this._classesDirty = true;
        this._stylesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._trueSizeCheck = true;

        this._dirtyClasses = [];

        this._currentTarget = null;
        this.svg = svg;
        this.S = Snap(svg);
        _setWidget.call(this, data);
    }

    widget.prototype = Object.create(Surface.prototype);
    widget.prototype.constructor = widget;

    function _setWidget(data) {
        Snap.load(data, function (f) {
            this.S.append(f);
            this.setContent(this.svg);
        }.bind(this));
    }

    module.exports = widget;
})
