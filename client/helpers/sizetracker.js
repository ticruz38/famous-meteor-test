define("size-tracker", function(require, exports, module){

    function tracker(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        _tracksize.call(this);
    }

    function _tracksize() {
        var that = this;
        window.addEventListener("resize", function(){
            that.width = window.innerWidth;
            that.height = window.innerHeight;
        });
    }
    module.exports = tracker;
});
