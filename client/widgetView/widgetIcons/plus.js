define('button', function (require, exports, module) {
    var ElementOutput = require('famous/core/ElementOutput'),
        SvgSurface = require('svgsurface'),
        Easing = require('famous/transitions/Easing'),
        Transform = require('famous/core/Transform'),
        TransitionableTransform = require('famous/transitions/TransitionableTransform'),
        Transitionable = require('famous/transitions/Transitionable'),
        SpringTransition = require('famous/transitions/SpringTransition');

    Transitionable.registerMethod('spring', SpringTransition);

    var transition = {
        duration: 300,
        curve: 'easeInOut'
    };
    var physics = {
        curve: 'spring',
        dampingRatio: 0.1,
        period: 1000
    };

    function button(element, parentState) {
        ElementOutput.apply(this, arguments);
        this.elements = [];
        var context = {
            transform: parentState.transform.get(),
            size: parentState.size.get()
        };
        this.state = {
            transform: new TransitionableTransform(Transform.multiply(Transform.translate(-wideContext.size[0], 0, 0), Transform.rotateY(Math.PI / 3))),
            target: this.render()
        };
        console.log(this.state);
        _setTransform.call(this, element.type, context);
    }

    button.prototype = Object.create(ElementOutput.prototype);
    button.prototype.constructor = button;

    function _setTransform(type, parentState) {
        if (type === "close") {
            _setCloseTransform.call(this, parentState);
        } else if (type === "valid") {
            _setValidTransform.call(this, parentState);
        } else {
            _setAddTransform.call(this, parentState);
        }
    }

    function _setCloseTransform(context) {
        console.log('close');
        this.state.transform.setTranslate([0, context.size[1], 0], transition);
        this.state.transform.setRotate([0, 0, 0], physics);
    }

    function _setValidTransform(context) {
        console.log('valid');
        this.state.transform.setTranslate([context.size[0] - context.size[0] / 3, context.size[1], 0], transition);
        this.state.transform.setRotate([0, 0, 0], physics);
    }

    function _setAddTransform(context) {
        console.log('add');
        this.state.transform.setTranslate([context.size[0], 0, 0], transition);
        this.state.transform.setRotate([0, 0, 0], physics);
    }

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    button.prototype.getTransform = function (context, type) {
        var state = {
            transform: this.state.transform.get(),
            target: this.state.target
        };
        return state;
    }

    button.prototype.replace = function (node) {
        this._element = node;
    }

    button.prototype.push = function (element) {
        if (element instanceof SvgSurface) {
            this.elements.push(element);
        } else {
            this.elements.push(new SvgSurface(element));
        }
    }

    button.prototype.commit = function (context) {
        var that = this;
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
            this._eventOutput.emit('resize');
        }
        ElementOutput.prototype.commit.call(this, context);
        /*if (this.state) {
            return this.state;
        }*/
    };
    module.exports = button;
});
