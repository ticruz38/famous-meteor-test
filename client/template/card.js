define('card', function (require, exports, module) {

    //var buttonPlus = require('plus');
    function card(item) {
        var svg = item.querySelector('svg');
        this.s = Snap(svg);
        this.g;
        //var plus = new buttonPlus(item);
        _setIcon.call(this);
    }

    function _setIcon() {
        var that = this;
        var s = this.s;
        Snap.load("img/old20.svg", function (f) {
            that.g = f.select("g");
            var hoverover = function () {
                that.g.animate({
                    transform: 'rotate(45, 23.777, 22.189)'
                }, 1000, mina.bounce)
            };
            var hoverout = function () {
                that.g.animate({
                    transform: 'scale(1)'
                }, 1000, mina.bounce)
            };
            s.append(f);
            s.hover(hoverover, hoverout);
        });
    }

    function _inHover(elem) {
        console.log('called', elem);
        elem.animate({
            transform: 's2r45,150,150'
        }, 500, mina.bounce);
    }

    function _outHover(elem) {
        elem.animate({
            transform: 's1r0,150,150'
        }, 500, mina.bounce);
    }
    module.exports = card;
});
