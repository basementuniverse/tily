# Tily Quick Reference

## Initialise Tily

Without options:
```
const tily = new Tily.Main(canvas);
```

With options:
```
const tily = new Tily.Main(canvas, {
    size: {                         // if null, use browser window size
        width: 100,                 // measured in px
        height: 100
    },
    handleResize: true,             // handle the resize event and resize canvas
    showFPS: true,
    renderLoop: true,               // start render loop automatically
    beforeDrawFunction: (
        canvas, context, width, height, elapsedTime
    ) => {}                         // called before each draw
    afterDrawFunction: (
        canvas, context, width, height, elapsedTime
    ) => {}                         // called after each draw
});
```

## Create buffers

You draw tiles on these buffers, and they can be scrolled/zoomed etc..
You can keep lots of them around and transition between them at any time (see next section).

Without options:
```
const buffer = new Tily.Buffer(w, h);   // w/h measured in tiles
```

With options:
```
const buffer = new Tily.Buffer(w, h, {
    lockedAxis: 'x' or 'y', // scale shows how many tiles visible on the locked axis
    initialOffsetX: 0,      // starting offset measured in tiles
    initialOffsetY: 0,
    initialScale: 24,       // initially visible tiles along the locked axis
    maximumScale: 32,
    minimumScale: 4,
    clampCamera: true       // clamp position and zoom to buffer edges
});
```

The resulting buffer object:
```
// buffer
{
    activeTiles: [],                // list of active tiles
    activeTilesMap: {},             // keys are tile positions, elements are arrays
    canvas, context,
    layers: [],
    offset: vec2,                   // measured in tiles
    offsetPixels: vec2,
    options: {},
    scale: 32,
    size: { width, height},         // measured in tiles
    tileSize: { width, height },    // side length of tiles in px
    viewSize: { width, height },    // measured in tiles

    getData(),
    static fromData(data),
    serialize(),
    static deserialize(data),

    addActiveTile(...tiles),
    removeActiveTile(tile),
    removeAllActiveTiles(),

    addLayer(layer, z),
    removeLayer(z),
    removeAllLayers(),

    getPosition(x, y),              // pixel position to tile position
    getTileInfo(x, y),              // info about tiles and active tiles at position

    moveOffset(x, y, { unit, relative, time, easeFunction, finishedCallback }),
    zoom(scale, { unit, relative, time, easeFunction, finishedCallback }),
    moveLayer(from, to, relative),  // move layer by z position
    resize(w, h)
}
```

## Activate buffers

Makes a buffer visible.

Activate without transition:
```
tily.activateBuffer(buffer);
```

Activate with transition (fade) animation:
```
tily.activateBuffer(buffer, { time: 1, finishedCallback: () => {} }).then(() => {});
```

## Add and configure layers

Buffers have multiple layers. Each layer contains a grid of characters with foreground and background colours.

Create a layer and then add it:
```
const layer = new Tily.TileLayer(buffer);
buffer.addLayer(layer, z);
```

```
const layer = buffer.addLayer(new Tily.TileLayer(buffer), z);
```

Or just create the layer automatically:
```
const layer = buffer.addLayer();
```

Specify the z-ordering for this layer:
```
const layer = buffer.addLayer(null, z);
```

_Note: once a layer is added to a buffer, you can move it around using `buffer.moveLayer()`_

The resulting layer object:
```
// layer
{
    background: 'black',
    clip: true,                 // should each tile clip borders
    centered: false,            // should each tile center it's text
    container: buffer,          // the buffer this layer belongs to
    font: 'sans serif',
    foreground: 'white',
    opacity: 1,
    tiles: [],                  // array of strings for each tile
                                // multiple characters are rendered on top of each other
                                // leave string empty to skip a tile

    getData(),
    static fromData(container, data),

    clear([x1, y1, [x2, y2]]),  // clear from x1/y1 (inclusive) to x2/y2 (exclusive)
    fill(
        char,
        [x1, y1, [x2, y2]],
        foreground = null,
        background = null
    ),
    resize(w, h),

    getTile(x, y),              // get the tile at x/y
    getForeground(x, y),        // get the fg colour at x/y
    getBackground(x, y),        // get the bg colour at x/y
    setTile(
        x, y,
        char,
        foreground = null,
        background = null
    )                           // set the tile at x/y
}
```

## Cell buffers

Define a cell function that returns a `Tily.Cell` with layers, and the buffer will keep generating and caching them as required.

Create a cell buffer:
```
const buffer = new Tily.CellBuffer({
    ...,
    cellWidth: 8,
    cellHeight: 8,
    cellFunction: function(cellBuffer, x, y, resolve, reject) {
        const cell = new Tily.Cell(cellBuffer);
        cell.addLayer(...);
        resolve(cell);
    }
});
```

## Active tiles

Active tiles can be moved around and animated. They are added to buffers and can be z-ordered between different layers.
Active tiles also have their own layers, and layers can have layers - layer settings and animations are nested too.

Create an active tile and add it to a buffer:
```
const tile = new Tily.ActiveTile(x, y, z?);
buffer.addActiveTile(tile);
```

```
const tile = buffer.addActiveTile(new Tily.ActiveTile(x, y));
```

Or just create one automatically:
```
const tile = buffer.addActiveTile();
```

The resulting active tile object:
```
// tile
{
    clip: true,             // clip edges
    wrap: true,             // wrap at edges if clip is true
    flip: true,             // flip x
    font: 'sans serif',
    fontStyle: '',
    fontSize: '',
    foreground: 'white',
    background: 'black',
    centered: false,        // text is centered in tile
    layers: [],
    offset: vec2,           // x and y 0 -> 1, offset from current position
    opacity: 1,
    position: vec2,         // measured in tiles
    rotation: 0,            // radians
    scale: vec2,
    zIndex: 0,
    outline: '',            // a string like 'size colour' eg. '0.1 black', size measured in tiles
    shadow: '',             // a string like 'blur x y colour' eg. '0.1 0.2 0.2 black', blur and offsets measured in tiles
    compositeMode: '',      // a js canvas globalCompositeOperation mode
    getData(),
    static fromData(data),

    addLayer(layer, z),
    moveLayer(from, to, relative),
    removeLayer(z),
    removeAllLayers(),

    animateForeground(fg, { repeat, reverse, alternate, time, easeFunction, callback }),
    animateOutline(outline, { ... }),
    animateShadow(shadow, { ... }),
    animateOffset(x, y, { ... }),
    animateOpacity(opacity, { ... }),
    animateRotation(angle, { ... }),
    animateScale(x, y, { ... })
}
```

_Note_: offset is useful for moving animations, transitioning from position to position.

## Active tile layers

Add layers to active tiles. Each layer has a character or string.

Create a layer and add it:
```
const layer = new Tily.ActiveTileLayer(
    tile,           // top level active tile
    parent          // immediate parent (for nesting layers)
);
tile.addLayer(layer, z);
```

```
const layer = tile.addLayer(new Tily.ActiveTileLayer());
```

Or create one automatically:
```
const layer = tile.addLayer();
```

The resulting layer object:
```
// layer
{
    (same as active tile)

    text: 'abc',    // characters to display for this layer

    animateText('abcde', { ... }),
    animateText(['a', 'b'], { ... }),
    animateText((initialText, i) => {  })   // i: 0 -> 1
}
```
