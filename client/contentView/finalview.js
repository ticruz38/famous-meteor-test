define('finalview', function (require, exports, module) {
    var View = require("famous/core/View"),
        Surface = require('famous/core/Surface'),
        Transform = require('famous/core/Transform'),
        Modifier = require('famous/core/Modifier'),
        RenderNode = require('famous/core/RenderNode'),
        ContainerSurface = require('famous/surfaces/ContainerSurface');

    function finalView() {
        this.options = Object.create(finalView.DEFAULT_OPTIONS);
        this.node = new RenderNode();
    }

    finalView.DEFAULT_OPTIONS = {
        transition: {
            duration: 2000,
            curve: 'easeIn'
        },
        finalState: {
            transform: Transform.translate(0, 0, 0),
            origin: [.5, .5],
            opacity: 1,
            size: [window.innerWidth / 2, window.innerHeight / 2]
        }
    }

    function _setDetails(node, data) {
        //var container = new RenderNode(),
        var surfaces = [],
            index = 0,
            amount = 0;
        console.log(data);
        for (var prop in data) {
            index++
            if (prop === '_idcard' || prop === '_id') continue;
            var surface = new Surface({
                content: prop + ' : ' + data[prop],
                size: [true, 100]
            });
            surface.modifier = new Modifier({
                transform: Transform.translate(window.innerWidth / 2, amount, 0)
            });
            node.add(surface.modifier).add(surface);
            surfaces.push(surface);
            amount += surface.getSize()[1];
        }
    }

    function _setFinalView(state) {
        var finalState = this.options.finalState;
        state.transform.set(finalState.transform, this.options.transition);
        //state.origin.set(finalState.origin, this.options.transition);
        state.opacity.set(finalState.opacity, this.options.transition);
        state.size.set(finalState.size, this.options.transition);

    }

    finalView.prototype.show = function (surface, node) {
        console.log(surface, node);
        var data = surface.data;
        //var modifier = surface.getModifier();
        _setDetails.call(this, node, data);
        var amount = surface.getSize()[0];
        _setFinalView.call(this, surface.getState());
        console.log(amount);
    }
    finalView.prototype.hide = function () {

    }
    module.exports = finalView;
});
