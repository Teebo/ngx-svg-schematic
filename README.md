# Getting Started With NgxSvgSchematic

A schematic to generate SVG components from SVG files; making it easier 
to embed SVGs in templates and avoid conflicting CSS rules from multiple
embedded SVGs.

### Installation

`npm i --save ngx-svg-schematic`

Or using the CLI

`ng add ngx-svg-schematic`


### Usage

In your Angular CLI project, run `ng g ngx-svg-schematic:ngx-svg-schematic`.

- `Enter` a path to the SVG file directory - `src` being the root
- `Enter` the SVG file name - the file extension is optional
- `Enter` a destination path to the SVG component

The schematic will:

- Try to find the file, if found, it will read its content, create a DOM tree, extract any CSS from the mark-up and remove it;
- Create a component in the provided destination path, write the SVG mark-up in that component's template file;
- Write the CSS rules to the `styles` property of the created component's configuration 

### Notes

- A manual import and declaration of the created SVG component in a module is required
- Try first with the `dry-run=true` flag


