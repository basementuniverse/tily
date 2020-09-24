# ![Tily Logo](https://basementuniverse.github.io/tily/images/tily.svg "Tily Logo") Tily

A basic Javascript tile engine that is (somewhat) inspired by the Windows console API.

### Features

- Uses Canvas to render tiles.
- Switch between buffers with a configurable fade transition.
- Each tile is a string character or multiple characters drawn on top of each other, so rendering is independent of resolution and pixel-ratio.
- Can use Web Fonts and Icon Fonts for custom icons. I recommend using [Web Font Loader](https://github.com/typekit/webfontloader).
- Pan and zoom the camera for scrolling buffers.
- Tiles can have transitions and animations for movement, scaling and rotation amongst other things.
- Cell-loading for infinite or procedurally-generated buffers.

### Setting it up

Just load `tily.min.js` in your page and create a [`Tily.Main`](https://basementuniverse.github.io/tily/Tily.Main.html) instance, passing in the canvas element on which you want to render as an argument, like so:

    <script src="tily.min.js"></script>
    <canvas id="tily-canvas"></canvas>
    <script>

    var tily = new Tily.Main(document.querySelector("#tily-canvas"));

    </script>

[Read the documentation!](https://basementuniverse.github.io/tily/)

### Demos

- [Moving a player around the screen](https://basementuniverse.github.io/tily/demos/movingplayer/index.htm)
- [A really big buffer](https://basementuniverse.github.io/tily/demos/largebuffer/index.htm)
- [Lots of animations and transitions](https://basementuniverse.github.io/tily/demos/animations/index.htm)
- [An infinite procedurally-generated buffer](https://basementuniverse.github.io/tily/demos/proceduralbuffer/index.htm)
- [Map Painter](https://basementuniverse.github.io/tily/demos/mappainter/index.htm)
