# ![](../images/tily.svg) Tily

A basic font-based tile engine.

### Setting it up

Just load `tily.min.js` in your page and create a `Tily.Main` instance, passing in the canvas element on which you want to render as an argument, like so:

```html
<script src="tily.min.js"></script>
<canvas id="tily-canvas"></canvas>
<script>

var tily = new Tily.Main(document.querySelector("#tily-canvas"));

</script>
```
