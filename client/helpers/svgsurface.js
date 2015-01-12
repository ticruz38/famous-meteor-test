define('svgsurface', function (require, exports, module) {
    var ElementOutput = require('famous/core/ElementOutput');

    function svgsurface(svg) {
        ElementOutput.apply(this, arguments);
    }

    svgsurface.prototype = Object.create(ElementOutput.prototype);
    svgsurface.prototype.constructor = svgsurface;

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    svgsurface.prototype.commit = function (context) {
        var target = this._element;
        var size = context.size;
        if (_xyNotEquals(this._size, size)) {
            if (!this._size) this._size = [0, 0];
            this._size[0] = size[0];
            this._size[1] = size[1];

            this._sizeDirty = true;
        }
        if (this._sizeDirty) {
            if (this._size) {
                target.style.width = this._size[0] + 'px';
                target.style.height = this._size[1] + 'px';
            }
            this._sizeDirty = false;
            this._eventOutput.emit('resize');
        }
        ElementOutput.prototype.commit.call(this, context);
    };

    module.exports = svgsurface;
});
