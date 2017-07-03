# sketch-neo-preview

### HTML based gallery straight from sketch document.

This is an alternative for sketch mirror, provides 2x scaled images out of the box for retina displays, images in the preview are always fit to width of the browser and fill up the screen, so it looks more like the real thing. This also allows scrolling for vertical oriented web-page/website designs.

### How to install

1. Download the latest version from [releases](https://github.com/alanfraneo/sketch-neo-preview/releases)

2. Extract it.

3. Run the `Neo Preview.sketchplugin` by double clicking it.

That's it, the plugin will be installed and available under the plugins menu in Sketch.

### Features

Export all artboards from current page to a gallery using keyboard shortcut `cmd` + `shift` + `,`

Export all artboards from all pages to a gallery using keyboard shortcut `cmd` + `shift` + `.` - by default export will exclude `Symbols` & `Styles` pages. Also for convenience excludes any page starting with an `_`. For example: If I don't want to export a page for prototype preview like icons page, I'll add an underscore to exclude it.

The default scaling for above commands will be taken from the artboards' top most export configuration, If an artboard is not marked for export, it will be skipped.

![Default export configuration](/demo/05.jpg?raw=true "")

Also included two more commands to force 2x scaling when exporting the artboards, this too will ignore artboards which are not marked for export.

![2x force scaling commands](/demo/04.jpg?raw=true "")

Gallery images maximize on click and fit to width. Ideal for prototypes as we can use this to check scrolling.

Use keyboard shortcuts to navigate between images quickly. `left` and `right` arrows to move between screens and `esc` to minimize and go back to gallery.

Each image will have a numbered unique `location.hash` based URL, so can easily share URLs if the files were in a web server.

### Screenshots

![Export from Sketch](/demo/01.jpg?raw=true "")

![Gallery View](/demo/02.jpg?raw=true "")

![Maximised view](/demo/03.jpg?raw=true "")

### Credits

Thanks [ivanbozic](https://github.com/ivanbozic)'s [pages to folders](https://github.com/ivanbozic/sketch-pages-to-folders/), which was used as a reference for exporting images module of this plugin.

### License

MIT

### Contact
Have any suggestions or feedbacks? Hit me up on Twitter [@alanfraneo](https://twitter.com/alanfraneo)
