define('add', function (require, exports, module) {

    var Transitionable = require('famous/transitions/Transitionable'),
        TransitionableTransform = require('famous/transitions/TransitionableTransform'),
        Transform = require('famous/core/Transform'),
        Button = require('button'),
        ElementOutput = require('famous/core/ElementOutput');


    function plus(svg) {
        ElementOutput.apply(this, arguments);
        this.svg = svg;
        this.S = Snap(svg);
        _setWidget.call(this);
        //this.attach(this.svg);
        this.isModal = false;
        this.index = 0;
    }

    plus.prototype = Object.create(ElementOutput.prototype);
    plus.prototype.constructor = plus;

    function _setWidget() {
        var S = this.S;
        S.attr({
            viewBox: "0 0 32 32"
        });
        this.rect = S.rect(1, 1, 30, 30, 15).attr({
            strokeWidth: 2,
            stroke: "black",
            fill: "white"
        });
        this.pth = S.path("M8 16 L24 16 M16 8L16 24").attr({
            strokeWidth: 2,
            strokeLinecap: "round",
            stroke: "black"
        });
        //var g = S.g(el);
        var inHover = function () {
            this.rect.animate({
                rx: 4,
                ry: 4
            }, 300, mina.elastic);
        }.bind(this);
        var outHover = function () {
            this.rect.animate({
                rx: 15,
                ry: 15
            }, 300, mina.elastic);
        }.bind(this);
        S.hover(inHover, outHover);
    }

    function _setIcon(path) {
        console.log(this);
        var S = this.S;
        if (path.match('img/parachute.svg')) { // 1st append no need to remove old svg el
            console.log('parachute');
            S.svg(2, 10, 28, 20);
            Snap.load(path, function (f) {
                var svg = S.select('svg');
                svg.append(f);
            });
            this.dash = S.select('svg');
        } else if (path.match('data:image/svg')) {
            console.log('svg');
            this.dash.remove();
            S.svg(2, 10, 28, 20);
            Snap.load(path, function (f) {
                var svg = S.select('svg');
                svg.append(f);
            });
            this.dash = S.select('svg');
        } else if (path.match('data:image/jpg') || path.match('data:image/png') || path.match('.png') || path.match('.jpg')) {
            console.log('img');
            this.dash.remove();
            var img = S.image(path, 2, 10, 28, 20);
            S.append(img);
            this.dash = S.select('image');
        }
    }

    function _modalSvg() {
        console.log(this);
        var that = this;
        var S = this.S;
        S.unhover();
        var dfltTitle = "Name here";
        _setIcon.call(this, 'img/parachute.svg');
        this.title = S.text(0, 0, dfltTitle).attr({
            textpath: 'M4,7L28,7',
            fontSize: 5
        });
        this.rect.attr({
            strokeWidth: 1
        });
        this.rect.animate({
            rx: 3,
            ry: 3,
        }, 700, mina.elastic);
        this.pth.animate({
            d: 'M1,9L31,9M1,9L31,9',
            strokeWidth: 1
        }, 700, mina.elastic);
        this.title.click(function (e, type) {
            var textpath = this.node.firstChild;
            var title = '';
            var update = function () {
                for (var i = 0; i < title.length; i++) {}
            };
            (this.node.textContent === dfltTitle) ?
                this.node.firstChild.innerHTML = '|' :
                this.node.textContent === this.node.textContent;
            Body.addEventListener('keydown', function onkeydown(e, type) {
                if (e.keyCode !== 13 && e.keyCode !== 27 && e.keyCode !== 8) {
                    var string = String.fromCharCode(e.keyCode);
                    title = title.concat(string);
                    console.log('keydown', string, e.keyCode, type);
                    textpath.innerHTML = title;
                } else {
                    if (e.keyCode === 8) {
                        console.log(e.keyCode, title, title.length - 2);
                        e.preventDefault();
                        title = title.slice(0, title.length - 1);
                        textpath.innerHTML = title;
                    } else {
                        console.log("else", this);
                        /*Cards.insert({
                        type: title
                    });*/
                        this.title = title;
                        this.removeEventListener('keydown', onkeydown);
                        //return;
                    }
                }
            });
        });
        console.log('dropEvent');
        Body.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        Body.addEventListener('drop', function (e) {
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                _setIcon.call(that, e.target.result);
            }
            reader.readAsDataURL(file);
            /*var svgObj = SVG.insert(file, function (err, fileobj) {
                console.log(err, fileobj);
            });*/
        });
    }

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    function _setButtons() {
        console.log(this);
        var that = this;
        this.elements = [];
        var paths = ['img/close.svg', 'img/valid.svg', 'img/plus.svg'];
        paths.forEach(function (string) {
            var type = string.replace('img/', "").replace(".svg", "");
            var svg = document.createElement('SVG');
            svg.type = type;
            Body.appendChild(svg);
            var element = new Button(svg, that.stateItem);
            element.type = type;
            that.elements.push(element);
            Snap.load(string, function (f) {
                svg.appendChild(f.node);
            });
        });
    }

    function _modalizer(originState) {
        _modalSvg.call(this);
        var transition = {
            duration: 400,
            curve: 'easeOutBounce'
        };
        this.stateItem = {
            transform: new TransitionableTransform(originState.transform),
            size: new Transitionable(originState.size),
            origin: new Transitionable(originState.origin)
        };
        var modalState = {
            transform: Transform.translate(wideContext.size[0] / 2, wideContext.size[1] / 2, 0),
            size: [wideContext.size[0] / 3, wideContext.size[0] / 3], //took X-size twice to have a square
            origin: [.5, .5]
        };
        this.stateItem.transform.set(modalState.transform, transition);
        this.stateItem.size.set(modalState.size, transition);
        this.stateItem.origin.set(modalState.origin, transition, function () {
            _setButtons.call(this);
        }.bind(this));
    }

    plus.prototype.commit = function (context) {
        var that = this;
        this.index === 0 ? console.log(context.size, this.originState) : this.index++;
        this.index++;
        if (!this.isModal && this.originState === undefined) {
            this.originState = {
                transform: context.transform,
                size: context.size,
                origin: context.origin
            }
            this.on('click', function () {
                if (this.isModal) return;
                _modalizer.call(this, this.originState);
                this.isModal = !this.isModal;
            }.bind(this));
        };
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
        if (this.elements) {
            var state = [];
            this.elements.forEach(function (button) {
                state.push(button.getTransform(context, button.type));
            });
            return {
                transform: context.transform,
                size: [context.size[0] / 3, context.size[1] / 3],
                origin: context.origin,
                target: state
            }
        }
    };

    module.exports = plus;
});
