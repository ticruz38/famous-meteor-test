define('card', function (require, exports, module) {
    Session.setDefault('card', true);

    function card(index) {
        this.s = Snap.select('.card-container' + index);
        _setIcon.call(this);
    }

    function _setIcon() {
        var s = this.s;
        Snap.load("img/old20.svg", function (f) {
            g = f.select("g");
            var hoverover = function () {
                console.log('hover');
                g.animate({
                    transform: 'rotate(45, 23.777, 22.189)'
                }, 1000, mina.bounce)
            };
            var hoverout = function () {
                g.animate({
                    transform: 'scale(1)'
                }, 1000, mina.bounce)
            };
            s.append(f);
            console.log(g.hover());
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
