define('transition', function (require, exports, module) {
    var Transform = require('famous/core/Transform'),
        LightBox = require("region"),
        Helpers = require('helpers');

    function Transition(options) {
        this.outTransform = [];
        _outTransform.call(this, options);
        this.options = Object.create(Transition.DEFAULT_OPTIONS(options, this.outTransform));
        this._showing = false;
        this.nodes = [];
        this.transforms = [];
        this.states = [];
    }
    Transition.prototype = Object.create(LightBox.prototype);
    Transition.prototype.constructor = Transition;

    Transition.DEFAULT_OPTIONS = function (options, outTransform) {
        if (options) {
            return {
                outTransition: options.TRANSITION,
                outOpacity: 1,
                outOrigin: [0, 0],
                outSize: [options.surface._size[0], options.surface._size[1]],
                outTransform: outTransform[outTransform.length - 1],
                inTransition: options.TRANSITION,
                inTransform: options.grid._modifiers[options.index]._transformGetter(),
                inOpacity: 1,
                inOrigin: [0, 0],
                inSize: [options.surface._size[0], options.surface._size[1]],
                showTransform: Transform.rotateY(Math.PI),
                showOpacity: 1,
                showOrigin: [0, 0],
                showSize: [Helpers.winWidth, Helpers.winHeight]
            }
        } else {
            return LightBox.DEFAULT_OPTIONS
        }
    }

    function _outTransform(options) {
        if (options) {
            this.outTransform.push(options.grid._modifiers[options.index]._transformGetter());
        }
        return this.outTransform;
    }

    Transition.prototype.setOptions = function setOptions(options) {
        return this.options = Object.create(Transition.DEFAULT_OPTIONS(options, this.outTransform))
    }

    module.exports = Transition;
});
