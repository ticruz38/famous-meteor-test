/*Session.setDefault('entity', true);

Template.entity.rendered = function () {
    if (Session.get('entity')) {
        Session.set('entity', false);
        //var container = d3.selectAll('.svg-container');
        var s = Snap.selectAll('.entity-container');
        console.log(s);
        s.forEach(function (elem, i) {
            var dim = {
                bbox: elem.getBBox(),
            };
            Snap.load("img/plate7.svg", function (f) {
                g = f.select("g");
                elem.append(f);
                var svg = document.getElementById('entitysvg');
                var snapsvg = Snap.selectAll("#plate");
                snapsvg.forEach(function (elem, i) {
                    elem.attr({
                        viewBox: "0 0 64 64",
                        width: '838px',
                        height: '308px'
                    });
                    console.log(svg, svg.offsetWidth);
                });
            });
        });
    }
    container.each(function (d, i) {
        var dim = {
            width: this.clientWidth,
            height: this.clientHeight
        };
        console.log(this);
        Snap.load("img/plate7.svg", function (f) {
            g = f.select("g");
        }.bind(this));
    });
};*/
