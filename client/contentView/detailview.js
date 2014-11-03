define('detailview', function (require, exports, module) {

    var View = require('famous/core/View'),
        ScrollView = require('famous/views/Scrollview'),
        Surface = require("famous/core/Surface"),
        ImageSurface = require('famous/surfaces/ImageSurface'),
        Modifier = require("famous/core/Modifier"),
        FlexibleLayout = require('famous/views/FlexibleLayout'),
        Transform = require('famous/core/Transform'),
        Transitionable = require('famous/transitions/Transitionable'),
        TransitionableTransform = require('famous/transitions/TransitionableTransform'),
        RenderNode = require("famous/core/RenderNode"),
        Helpers = require('helpers');


    var transition = {
        duration: 400,
        curve: 'easeOut'
    }

    function detailView() {
        View.apply(this, arguments);
        //this.options = Object.create(detailView.DEFAULT_OPTIONS);
        this.flex = new FlexibleLayout({
            direction: 1,
            ratios: [2, 1]
        });

        this._showing = false;
        this._renderables = [new RenderNode()];
        //this.modifiers[0] = 1st modifiers this.modifiers[0][0] = surface - > [1] = input - > [2] = details
        this.scrollview = new ScrollView({
            direction: 0,
            groupScroll: true
        });
        this.scrollSequence = [];
        this.scrollview.sequenceFrom(this.scrollSequence);
        this.initialState = {};
        this.flexSequence = [];
    }

    detailView.prototype = Object.create(View.prototype);
    detailView.prototype.constructor = detailView;

    function _createInitialState(state, i) {
        var state = state[i];
        var initialState = this.initialState;
        initialState.transform = state.transform ? state.transform.get() : undefined,
        //initialState.origin = state.origin.get();
        initialState.opacity = state.opacity.get();
        initialState.size = state.size.get();
    }
    // called when scroller is clicked
    function _switchView(entity) {
        console.log('hey', entity);
        var switchTranslate = Transform.translate(window.innerWidth, 200, 200);
        this._renderables[1].stateIndex.transform.set(switchTranslate, transition);
        //this._renderables[1].stateIndex.size.set(this.initialState.size, transition);
        this._renderables[2].state.transform.set(switchTranslate, transition);
        //this._renderables[2].state.size.set([undefined, true], transition);
        //this._renderables[2].state.origin.set([0, 0.5], transition);
        this._renderables[3].state.transform.set(switchTranslate, transition);
        var renderables = {};
    }

    function _scrollerMaker(entities, index) {
        var that = this;
        this.scrollview.modifier = new Modifier({
            opacity: 0
        });
        this.scrollview.state = {
            opacity: new Transitionable()
        };
        this.scrollview.modifier.transformFrom(this.scrollview.state.opacity.set(1), transition);
        //var that = this;
        entities.forEach(function (doc, i) {
            console.log(i, index);
            if (index === i) {
                return;
            }
            var data = doc.entities.data;
            var node = new RenderNode();
            var entity = new Surface({
                size: [undefined, undefined],
                properties: {
                    backgroundColor: 'gray',
                    zIndex: 11,
                }
            });
            entity.index = i;
            entity.inputModifier = new Modifier({
                origin: [0, 1],
            });
            entity.inputSurface = new Surface({
                content: data.name,
                size: [undefined, undefined],
                properties: {
                    color: 'black',
                    backgroundColor: 'red',
                    zIndex: 12,
                    textAlign: 'center',
                    lineHeight: '200px',
                    fontSize: '50px',
                }
            });
            node.add(entity.inputModifier).add(entity.inputSurface);
            node.add(entity);
            this.scrollSequence.push(node);
            entity.pipe(this.scrollview);
            entity.inputSurface.on('click', function () {
                _switchView.call(that, this, entities);
            });
        }.bind(this));
    }

    function _createView(surface) {
        if (this._showing === true) {
            return;
        }
        _createInitialState.call(this, surface.state, surface.index);

        var node = this._renderables[0];
        surface.stateIndex = surface.state[surface.index];
        surface.stateIndex.transform.set(Transform.translate(0, 0, 0), transition);
        surface.stateIndex.size.set([Helpers.winWidth / 2, 400], transition);

        var title = surface.inputSurface
        title.modifier = surface.inputModifier;
        title.state = {
            origin: new Transitionable(),
            size: new Transitionable(),
            transform: new TransitionableTransform()
        };
        //title.originFrom(detailOrigin.set([1, 0], transition));
        title.modifier.transformFrom(title.state.transform.set(Transform.translate(300, 0, 0), transition));
        title.modifier.sizeFrom(title.state.size.set([undefined, undefined], transition));

        var details = new MeteorSurface({
            template: Template.details,
            data: surface.data,
            size: [undefined, undefined]
        });
        details.state = {
            transform: new TransitionableTransform,
            align: new Transitionable,
            origin: new Transitionable
        };
        details.modifier = new Modifier({
            align: [.6, 0.2],
            origin: [0, 0],
            transform: details.state.transform.set(Transform.multiply(Transform.translate(window.innerWidth / 2, window.innerHeight, 300), Transform.skewY(Math.PI / 4))),
        });
        details.state.transform.set(Transform.translate(0, 0, 0), transition);
        node.add(surface.modifier).add(surface);
        node.add(title.modifier).add(title);
        node.add(details.modifier).add(details);
        console.log(surface.views);
        _scrollerMaker.call(this, surface.views, surface.index);
        this._renderables.push(surface, title, details, this.scrollview);
        this.flexSequence.push(node, this.scrollview);
        this.flex.sequenceFrom(this.flexSequence);
        this._add(this.flex);
        this._showing = !this._showing;
    }

    detailView.prototype.setDetailView = function (surface) {
        //_createInitialState.call(this, surface.state);
        _createView.call(this, surface);
    }

    detailView.prototype.toggle = function () {
        this._renderables[1].stateIndex.transform.set(this.initialState.transform, transition);
        this._renderables[1].stateIndex.size.set(this.initialState.size, transition);
        this._renderables[2].state.transform.set(Transform.translate(0, 0, 0), transition);
        this._renderables[2].state.size.set([undefined, true], transition);
        this._renderables[2].state.origin.set([0, 0.5], transition);
        this._renderables[4].state.opacity.set(0, transition);
        this._renderables[3].state.transform.set(Transform.multiply(Transform.translate(window.innerWidth / 2, window.innerHeight, 300), Transform.skewY(Math.PI / 4)), transition, function () {
            this._renderables = [];
            this.scrollSequence = [];
            this.scrollview = new ScrollView({
                direction: 1,
                groupScroll: true
            });
            this.scrollview.sequenceFrom(this.scrollSequence);
            this._renderables.push(new RenderNode());
            this.flexSequence.splice(0, 2, this._renderables[0], this.scrollview);
            this._showing = !this._showing;
        }.bind(this));
    }
    module.exports = detailView;
});
