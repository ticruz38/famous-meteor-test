define('footerview', function (require, exports, module) {


    var RenderNode = require('famous/core/RenderNode'),
        Transform = require('famous/core/Transform'),
        FlexibleLayout = require('flexibleLayout');

    function footer() {
        FlexibleLayout.apply(this, arguments);
        this.index = 0;
        this.surfaces = [];
        _setWidgets.call(this);
    }

    footer.prototype = Object.create(FlexibleLayout.prototype);
    footer.prototype.constructor = footer;

    footer.DEFAULT_OPTIONS = {
        direction: 0
    };

    function _setWidgets() {
        var that = this;
        var widgetsPaths = ["img/house.svg", "img/message.svg", "img/settings.svg", "img/add.svg"];
        var widgets = Blaze.Each(function () {
            return widgetsPaths;
        }, function () {
            var view = this;
            var data = this.dataVar.get();
            this.onViewReady(function () {
                var svg = this.firstNode(),
                    widget = _setWidget(data);
                widget = new widget(svg, data);
                that.surfaces.push(widget);
                that.sequenceFrom(that.surfaces);
                /*var S = Snap(svg);
                Snap.load(data, function (f) {
                    S.append(f);
                    var surface = new Surface({
                        content: svg
                    });


                });*/
            });
            return HTML.SVG({
                class: "widget",
            });
        });
        widgets.onViewReady(function () {
            //that.sequenceFrom(that.surfaces);
        });
        famouscontainer = document.getElementsByClassName('famouscontainer');
        Blaze.render(widgets, Body);
    }

    function _setWidget(data) {
        var widget;
        var str = data.replace("img/", "").replace(".svg", "");
        if (str === "add") {
            widget = require(str);
        } else {
            widget = require("widget");
        }
        return widget;
    }

    function _reflow(ratios, length, direction) {
        var currTransform;
        var translation = 0;
        var flexLength = length;
        var ratioSum = 0;
        var ratio;
        var node;
        var i;

        this._cachedLengths = [];
        this._cachedTransforms = [];

        for (i = 0; i < ratios.length; i++) {
            ratio = ratios[i];
            node = this._nodes[i];

            if (typeof ratio !== 'number')
                flexLength -= node.getSize()[direction] || 0;
            else
                ratioSum += ratio;
        }

        for (i = 0; i < ratios.length; i++) {
            node = this._nodes[i];
            ratio = ratios[i];

            length = (typeof ratio === 'number') ? flexLength * ratio / ratioSum : node.getSize()[direction];

            currTransform = (direction === FlexibleLayout.DIRECTION_X) ? Transform.translate(translation, 0, 0) : Transform.translate(0, translation, 0);

            this._cachedTransforms.push(currTransform);
            this._cachedLengths.push(length);

            translation += length;
        }
    }

    function _trueSizedDirty(ratios, direction) {
        for (var i = 0; i < ratios.length; i++) {
            if (typeof ratios[i] !== 'number') {
                if (this._nodes[i].getSize()[direction] !== this._cachedLengths[i])
                    return true;
            }
        }

        return false;
    }

    footer.prototype.sequenceFrom = function (sequence) {
        this._nodes = sequence;

        if (this._ratios.get().length !== this._nodes.length) {
            var ratios = [];
            for (var i = 0; i < this._nodes.length; i++) ratios.push(1);
            this.setRatios(ratios);
        }
    };

    footer.prototype.animatePlus = function (context) {
        console.log(context._node);
        var commit = this.commit(context._nodeContext);
        console.log(commit);
    };

    footer.prototype.commit = function commit(context) {
        var parentSize = context.size;
        var parentTransform = context.transform;
        var parentOrigin = context.origin;
        var parentOpacity = context.opacity;

        var ratios = this._ratios.get();
        var direction = this.options.direction;
        var length = parentSize[direction];
        var size;

        if (length !== this._size[direction] || this._ratiosDirty || this._ratios.isActive() || direction !== this._cachedDirection || _trueSizedDirty.call(this, ratios, direction)) {
            _reflow.call(this, ratios, length, direction);

            if (length !== this._size[direction]) {
                this._size[0] = parentSize[0];
                this._size[1] = parentSize[1];
            }

            if (direction !== this._cachedDirection) this._cachedDirection = direction;
            if (this._ratiosDirty) this._ratiosDirty = false;
        }

        var result = [];
        var modal = [];
        for (var i = 0; i < ratios.length; i++) {
            size = [undefined, undefined];
            length = this._cachedLengths[i];
            size[direction] = length;
            if (!this._nodes[i].isModal) {
                result.push({
                    transform: this._cachedTransforms[i],
                    size: size,
                    target: this._nodes[i].render()
                });
            } else {
                var stateItem = this._nodes[i].stateItem;
                modal.push({
                    transform: stateItem.transform.get(),
                    size: stateItem.size.get(),
                    origin: stateItem.origin.get(),
                    target: this._nodes[i].render()
                });
            }
        }

        if (parentSize && (parentOrigin[0] !== 0 && parentOrigin[1] !== 0))
            parentTransform = Transform.moveThen([-parentSize[0] * parentOrigin[0], -parentSize[1] * parentOrigin[1], 0], parentTransform);

        return [{
            transform: parentTransform,
            size: parentSize,
            opacity: parentOpacity,
            target: result
        }, {
            target: modal
        }];
    };

    module.exports = footer;
});
