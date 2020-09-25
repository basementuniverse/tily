/***********************************************************************
Resize buffer/tile layers
***********************************************************************/
QUnit.module("Resize buffer/tile layers", {
  beforeEach: function() {
    this.testBuffer = new Tily.Buffer(5, 5);
    this.testBuffer.addLayer(new Tily.TileLayer());
    this.testBuffer.addLayer(new Tily.TileLayer());
    this.testBuffer.addLayer(new Tily.TileLayer());

    // Fill layers with tiles
    for (var x = 0; x < 5; x++) {
      for (var y = 0; y < 5; y++) {
        var c = (x == 0 || x == 4 || y == 0 || y == 4) ? "c" : "a";
        this.testBuffer.layers[0].setTile(x, y, c);
        this.testBuffer.layers[1].setTile(x, y, c);
        this.testBuffer.layers[2].setTile(x, y, c);
      }
    }
  },
  afterEach: function() {
    delete this.testBuffer;
  }
});

QUnit.test("Resize layer to the same size", function(assert) {
  this.testBuffer.resize(5, 5);
  assert.deepEqual(
    this.testBuffer.layers[0].tiles.join("."),
    "c.c.c.c.c.c.a.a.a.c.c.a.a.a.c.c.a.a.a.c.c.c.c.c.c"
  );
  assert.deepEqual(
    this.testBuffer.layers[1].tiles.join("."),
    "c.c.c.c.c.c.a.a.a.c.c.a.a.a.c.c.a.a.a.c.c.c.c.c.c"
  );
  assert.deepEqual(
    this.testBuffer.layers[2].tiles.join("."),
    "c.c.c.c.c.c.a.a.a.c.c.a.a.a.c.c.a.a.a.c.c.c.c.c.c"
  );
});

QUnit.test("Resize layer to the a smaller size", function(assert) {
  this.testBuffer.resize(4, 3);
  assert.deepEqual(
    this.testBuffer.layers[0].tiles.join("."),
    "c.c.c.c.c.a.a.a.c.a.a.a"
  );
  assert.deepEqual(
    this.testBuffer.layers[1].tiles.join("."),
    "c.c.c.c.c.a.a.a.c.a.a.a"
  );
  assert.deepEqual(
    this.testBuffer.layers[2].tiles.join("."),
    "c.c.c.c.c.a.a.a.c.a.a.a"
  );
});

QUnit.test("Resize layer to the a larger size", function(assert) {
  this.testBuffer.resize(6, 7);
  assert.deepEqual(
    this.testBuffer.layers[0].tiles.join("."),
    "c.c.c.c.c..c.a.a.a.c..c.a.a.a.c..c.a.a.a.c..c.c.c.c.c............."
  );
  assert.deepEqual(
    this.testBuffer.layers[1].tiles.join("."),
    "c.c.c.c.c..c.a.a.a.c..c.a.a.a.c..c.a.a.a.c..c.c.c.c.c............."
  );
  assert.deepEqual(
    this.testBuffer.layers[2].tiles.join("."),
    "c.c.c.c.c..c.a.a.a.c..c.a.a.a.c..c.a.a.a.c..c.c.c.c.c............."
  );
});
