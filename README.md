# ![](docs/images/tily.svg) Tily

A basic font-based tile engine.

### Features

- Uses Canvas to render tiles.
- Switch between buffers with a configurable fade transition.
- Each tile is a string character or multiple characters drawn on top of each other, so rendering is independent of resolution and pixel-ratio.
- Can use Web Fonts and Icon Fonts for custom icons. I recommend using [Web Font Loader](https://github.com/typekit/webfontloader).
- Pan and zoom the camera for scrolling buffers.
- Tiles can have transitions and animations for movement, scaling and rotation amongst other things.
- Cell-loading for infinite or procedurally-generated buffers.

### Setting it up

Just load `tily.min.js` in your page and create a `Tily.Main` instance, passing in the canvas element on which you want to render as an argument, like so:

```html
<script src="tily.min.js"></script>
<canvas id="tily-canvas"></canvas>
<script>

var tily = new Tily.Main(document.querySelector("#tily-canvas"));

</script>
```

[Quick Reference](tily-reference.md)

[Documentation](https://basementuniverse.github.io/tily/index.html)

### Demos

- [Moving a player around the screen](https://basementuniverse.github.io/tily/demos/movingplayer/index.html)
- [A really big buffer](https://basementuniverse.github.io/tily/demos/largebuffer/index.html)
- [Lots of animations and transitions](https://basementuniverse.github.io/tily/demos/animations/index.html)
- [An infinite procedurally-generated buffer](https://basementuniverse.github.io/tily/demos/proceduralbuffer/index.html)
- [Map Painter](https://basementuniverse.github.io/tily/demos/mappainter/index.html)
