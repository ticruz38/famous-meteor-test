MeteorSurface = function (options) {
    var self = this;
    self.templateInstance;
    if (!(self instanceof MeteorSurface))
        throw new Error('Meteor Surface, please use the "new" keyword');

    // Load the original surface
    var Surface = require("famous/core/Surface");

    // Create a surface
    var surface = new Surface(options);

    surface.deploy = function (target) {
        // On deploy we create the template instance if set
        if (options.template) {
            // Create container
            surface.content = document.createElement('div');
            surface.content.style.height = "inherit";
            if (options.data) {
                // Create instance
                self.templateInstance = UI.renderWithData(options.template, options.data, surface.content);
            } else {
                // Create instance
                self.templateInstance = UI.render(options.template, surface.content);
            }
        }

        // Call super
        Surface.prototype.deploy.call(surface, target);
    };

    // Clean up
    surface.cleanup = function (allocator) {
        // Remove template instance
        UI.remove(self.templateInstance);
        // Call super
        Surface.prototype.cleanup.call(surface, allocator);
    };

    surface.setcontent = function (template) {
        if (this.template !== template) {
            this.template = template
        }
        // à reflechir
    };

    // Return the modified surface
    return surface;
};
