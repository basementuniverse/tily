/***********************************************************************
Add/Remove buffer layers
***********************************************************************/
QUnit.module("Add/Remove buffer layers", {
	before: function() {
		this.testBuffer = new Tily.Buffer(4, 4);
		this.testBuffer.tempId = "testBuffer";
	},
	beforeEach: function() {
		this.testBuffer.layers = [];
	},
	after: function() {
		delete this.testBuffer;
	}
});

QUnit.test("Add a layer", function(assert) {
	var testLayer = new Tily.TileLayer();
	testLayer.tempId = "testLayer";
	this.testBuffer.addLayer(testLayer);
	assert.equal(this.testBuffer.layers.length, 1);
	assert.equal(this.testBuffer.layers[0].tempId, "testLayer");
	assert.equal(this.testBuffer.layers[0].container.tempId, "testBuffer");
});

QUnit.test("Add layers to the top", function(assert) {
	var testLayer1 = new Tily.TileLayer(),
		testLayer2 = new Tily.TileLayer(),
		testLayer3 = new Tily.TileLayer();
	testLayer1.tempId = "testLayer1";
	testLayer2.tempId = "testLayer2";
	testLayer3.tempId = "testLayer3";
	this.testBuffer.addLayer(testLayer1);
	this.testBuffer.addLayer(testLayer2);
	this.testBuffer.addLayer(testLayer3);
	assert.equal(this.testBuffer.layers[0].tempId, "testLayer1");
	assert.equal(this.testBuffer.layers[1].tempId, "testLayer2");
	assert.equal(this.testBuffer.layers[2].tempId, "testLayer3");
});

QUnit.test("Add layers to the bottom", function(assert) {
	var testLayer1 = new Tily.TileLayer(),
		testLayer2 = new Tily.TileLayer(),
		testLayer3 = new Tily.TileLayer();
	testLayer1.tempId = "testLayer1";
	testLayer2.tempId = "testLayer2";
	testLayer3.tempId = "testLayer3";
	this.testBuffer.addLayer(testLayer1, -1);
	this.testBuffer.addLayer(testLayer2, -1);
	this.testBuffer.addLayer(testLayer3, -1);
	assert.equal(this.testBuffer.layers[0].tempId, "testLayer3");
	assert.equal(this.testBuffer.layers[1].tempId, "testLayer2");
	assert.equal(this.testBuffer.layers[2].tempId, "testLayer1");
});

QUnit.test("Add layer to a specific z-index", function(assert) {
	var testLayer1 = new Tily.TileLayer(),
		testLayer2 = new Tily.TileLayer(),
		testLayer3 = new Tily.TileLayer(),
		testLayer4 = new Tily.TileLayer(),
		testLayer5 = new Tily.TileLayer();
	testLayer1.tempId = "testLayer1";
	testLayer2.tempId = "testLayer2";
	testLayer3.tempId = "testLayer3";
	testLayer4.tempId = "testLayer4";
	testLayer5.tempId = "testLayer5";
	this.testBuffer.addLayer(testLayer1);
	this.testBuffer.addLayer(testLayer2);
	this.testBuffer.addLayer(testLayer3);
	this.testBuffer.addLayer(testLayer4);
	this.testBuffer.addLayer(testLayer5, 2);
	assert.equal(this.testBuffer.layers[0].tempId, "testLayer1");
	assert.equal(this.testBuffer.layers[1].tempId, "testLayer2");
	assert.equal(this.testBuffer.layers[2].tempId, "testLayer5");
	assert.equal(this.testBuffer.layers[3].tempId, "testLayer3");
	assert.equal(this.testBuffer.layers[4].tempId, "testLayer4");
});

QUnit.test("Remove the top layer", function(assert) {
	var testLayer1 = new Tily.TileLayer(),
		testLayer2 = new Tily.TileLayer(),
		testLayer3 = new Tily.TileLayer();
	testLayer1.tempId = "testLayer1";
	testLayer2.tempId = "testLayer2";
	testLayer3.tempId = "testLayer3";
	this.testBuffer.addLayer(testLayer1);
	this.testBuffer.addLayer(testLayer2);
	this.testBuffer.addLayer(testLayer3);
	var removedLayer = this.testBuffer.removeLayer();
	assert.equal(removedLayer.tempId, "testLayer3");
	assert.equal(this.testBuffer.layers.length, 2);
	assert.equal(this.testBuffer.layers[0].tempId, "testLayer1");
	assert.equal(this.testBuffer.layers[1].tempId, "testLayer2");
});

QUnit.test("Remove the bottom layer", function(assert) {
	var testLayer1 = new Tily.TileLayer(),
		testLayer2 = new Tily.TileLayer(),
		testLayer3 = new Tily.TileLayer();
	testLayer1.tempId = "testLayer1";
	testLayer2.tempId = "testLayer2";
	testLayer3.tempId = "testLayer3";
	this.testBuffer.addLayer(testLayer1);
	this.testBuffer.addLayer(testLayer2);
	this.testBuffer.addLayer(testLayer3);
	var removedLayer = this.testBuffer.removeLayer(-1);
	assert.equal(removedLayer.tempId, "testLayer1");
	assert.equal(this.testBuffer.layers.length, 2);
	assert.equal(this.testBuffer.layers[0].tempId, "testLayer2");
	assert.equal(this.testBuffer.layers[1].tempId, "testLayer3");
});

QUnit.test("Remove a layer from a specific z-index", function(assert) {
	var testLayer1 = new Tily.TileLayer(),
		testLayer2 = new Tily.TileLayer(),
		testLayer3 = new Tily.TileLayer(),
		testLayer4 = new Tily.TileLayer(),
		testLayer5 = new Tily.TileLayer();
	testLayer1.tempId = "testLayer1";
	testLayer2.tempId = "testLayer2";
	testLayer3.tempId = "testLayer3";
	testLayer4.tempId = "testLayer4";
	testLayer5.tempId = "testLayer5";
	this.testBuffer.addLayer(testLayer1);
	this.testBuffer.addLayer(testLayer2);
	this.testBuffer.addLayer(testLayer3);
	this.testBuffer.addLayer(testLayer4);
	this.testBuffer.addLayer(testLayer5);
	var removedLayer = this.testBuffer.removeLayer(2);
	assert.equal(removedLayer.tempId, "testLayer3");
	assert.equal(this.testBuffer.layers.length, 4);
	assert.equal(this.testBuffer.layers[0].tempId, "testLayer1");
	assert.equal(this.testBuffer.layers[1].tempId, "testLayer2");
	assert.equal(this.testBuffer.layers[2].tempId, "testLayer4");
	assert.equal(this.testBuffer.layers[3].tempId, "testLayer5");
});

QUnit.test("Remove all layers", function(assert) {
	var testLayer1 = new Tily.TileLayer(),
		testLayer2 = new Tily.TileLayer(),
		testLayer3 = new Tily.TileLayer();
	this.testBuffer.addLayer(testLayer1);
	this.testBuffer.addLayer(testLayer2);
	this.testBuffer.addLayer(testLayer3);
	assert.equal(this.testBuffer.layers.length, 3);
	this.testBuffer.removeAllLayers();
	assert.equal(this.testBuffer.layers.length, 0);
});

/***********************************************************************
Move buffer layers
***********************************************************************/
QUnit.module("Move buffer layers", {
	before: function(assert) {
		this.testBuffer = new Tily.Buffer(4, 4);
		this.testBuffer.tempId = "testBuffer";
	},
	beforeEach: function() {
		var testLayer1 = new Tily.TileLayer(),
			testLayer2 = new Tily.TileLayer(),
			testLayer3 = new Tily.TileLayer(),
			testLayer4 = new Tily.TileLayer(),
			testLayer5 = new Tily.TileLayer();
		testLayer1.tempId = "testLayer1";
		testLayer2.tempId = "testLayer2";
		testLayer3.tempId = "testLayer3";
		testLayer4.tempId = "testLayer4";
		testLayer5.tempId = "testLayer5";
		this.testBuffer.addLayer(testLayer1);
		this.testBuffer.addLayer(testLayer2);
		this.testBuffer.addLayer(testLayer3);
		this.testBuffer.addLayer(testLayer4);
		this.testBuffer.addLayer(testLayer5);
	},
	afterEach: function() {
		this.testBuffer.removeAllLayers();
	},
	after: function() {
		delete this.testBuffer;
	}
});

QUnit.assert.checkLayers = function(layers, tempIds) {
	if (layers.length != tempIds.length) {
		this.pushResult({
			result: false,
			actual: layers.length,
			expected: tempIds.length,
			message: "Layers length doesn't match tempIds length"
		});
		return;
	}
	var layerIds = layers.map(i => i.tempId),
		result = true;
	for (var i = 0; i < layerIds.length; i++) {
		if (layerIds[i] != tempIds[i]) {
			result = false;
			break;
		}
	}
	this.pushResult({
		result: result,
		actual: layerIds,
		expected: tempIds,
		message: result ? "Layer Ids match temp Ids" : "Layer Ids don't match temp Ids"
	});
};

QUnit.test("Move a layer to a specific z-index", function(assert) {
	this.testBuffer.moveLayer(1, 3);
	assert.checkLayers(
		this.testBuffer.layers,
		[
			"testLayer1",
			"testLayer3",
			"testLayer4",
			"testLayer2",
			"testLayer5"
		]
	);
});

QUnit.test("Move a layer to a specific z-index < 0 (ie. to the beginning)", function(assert) {
	this.testBuffer.moveLayer(3, -1);
	assert.checkLayers(
		this.testBuffer.layers,
		[
			"testLayer4",
			"testLayer1",
			"testLayer2",
			"testLayer3",
			"testLayer5"
		]
	);
});

QUnit.test("Move a layer to a specific z-index > length (ie. to the end)", function(assert) {
	this.testBuffer.moveLayer(3, 7);
	assert.checkLayers(
		this.testBuffer.layers,
		[
			"testLayer1",
			"testLayer2",
			"testLayer3",
			"testLayer5",
			"testLayer4"
		]
	);
});

QUnit.test("Move a layer relatively to its current z-index (forward)", function(assert) {
	this.testBuffer.moveLayer(2, 1, true);
	assert.checkLayers(
		this.testBuffer.layers,
		[
			"testLayer1",
			"testLayer2",
			"testLayer4",
			"testLayer3",
			"testLayer5"
		]
	);
});

QUnit.test("Move a layer relatively to its current z-index (backward)", function(assert) {
	this.testBuffer.moveLayer(2, -1, true);
	assert.checkLayers(
		this.testBuffer.layers,
		[
			"testLayer1",
			"testLayer3",
			"testLayer2",
			"testLayer4",
			"testLayer5"
		]
	);
});

QUnit.test("Move a layer relatively to a z-index < 0 (ie. to the beginning)", function(assert) {
	this.testBuffer.moveLayer(2, -5, true);
	assert.checkLayers(
		this.testBuffer.layers,
		[
			"testLayer3",
			"testLayer1",
			"testLayer2",
			"testLayer4",
			"testLayer5"
		]
	);
});

QUnit.test("Move a layer relatively to a z-index > length (ie. to the end)", function(assert) {
	this.testBuffer.moveLayer(2, 5, true);
	assert.checkLayers(
		this.testBuffer.layers,
		[
			"testLayer1",
			"testLayer2",
			"testLayer4",
			"testLayer5",
			"testLayer3"
		]
	);
});

QUnit.test("Try to move a layer that doesn't exist (< 0)", function(assert) {
	var result = this.testBuffer.moveLayer(-1, 0);
	assert.ok(!result);
});

QUnit.test("Try to move a layer that doesn't exist (> length)", function(assert) {
	var result = this.testBuffer.moveLayer(10, 0);
	assert.ok(!result);
});

QUnit.test("Try to move a layer when there is only 1 layer", function(assert) {
	this.testBuffer.removeAllLayers();
	this.testBuffer.addLayer(new Tily.TileLayer());
	assert.equal(this.testBuffer.layers.length, 1);
	var result = this.testBuffer.moveLayer(0, 0);
	assert.ok(!result);
});