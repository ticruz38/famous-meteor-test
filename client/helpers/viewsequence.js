var _ViewSequence = require("famous/core/ViewSequence");
var ReactiveEntity = require("library/meteor/core/ReactiveEntity");

ViewSequence = function (options) {
    var self = this;
    var index = {};

    // Create sequence
    var sequence = new _ViewSequence();

    if (_.isArray(options.data)) {
        _.each(options.data, function (row) {

            sequence.push(new MeteorSurface({
                template: options.template,
                data: row,
                size: options.size,
                properties: options.properties,
                classes: options.classes || []
            }));

        });
    } else if (typeof options.data == 'object') {
        // "data" is a MiniMongo cursor.  TODO, instanceof cursor check.
        self.observeHandle = options.data.observe({
            addedAt: function (doc, atIndex, before) {
                // Keep an reactive index
                index[doc._id] = new ReactiveEntity(doc);
                // Add surface
                sequence.splice(atIndex, 0, new MeteorSurface({
                    template: options.template,
                    data: index[doc._id].get(),
                    size: options.size,
                    properties: options.properties
                }));
            },
            changedAt: function (newDocument, oldDocument, atIndex) {
                index[newDocument._id].set(newDocument);
            },
            removedAt: function (oldDocument, atIndex) {
                // Remove item
                var item = sequence.splice(atIndex, 1);
                // Clean up, help GC
                index[oldDocument._id] = null;
                // Clean up
                delete index[oldDocument._id];
                console.log('Removed', item);
                // item.destroy(); ??
            },
            movedTo: function (doc, fromIndex, toIndex, before) {
                var item = sequence.splice(fromIndex, 1)[0];
                sequence.splice(toIndex, 0, item);
            }
        });
    }

    // Return the sequence handle
    return sequence;
}
