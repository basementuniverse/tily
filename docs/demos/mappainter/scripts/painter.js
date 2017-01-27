var painter = (function() {
	"use strict";
	
	// Resize the buffer and fill in empty parts with land tiles
	function resize(width, height) {
		buffer.resize(width, height);
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				if (!layers.land.getTile(x, y)) {
					drawLand(vec2(x, y));
				}
			}
		}
	}
	
	// Handle click/tap events
	function click(p) {
		switch (tool) {
			case "pan": break;
			default:
				var t = buffer.getPosition(p.x, p.y);
				draw(t);
				break;
		}
	}
	
	// Handle drag events
	function drag(p, dragStart) {
		switch (tool) {
			case "pan":
				buffer.moveOffset(dragStart.x - p.x, dragStart.y - p.y, { unit: "px" });
				break;
			default:
				var t = buffer.getPosition(p.x, p.y);
				if (previousTile === null || !vec2.eq(t, previousTile)) {
					previousTile = t;
					draw(t);
				}
				break;
		}
	}
	
	// Draw tiles onto the buffer
	function draw(p) {
		switch (tool) {
			case "land": drawLand(p); break;
			case "water": drawWater(p); break;
			case "tree": drawTree(p); break;
			case "mountain": drawMountain(p); break;
			case "road": drawRoad(p); break;
			case "house": drawHouse(p); break;
			case "office": drawOffice(p); break;
			default: break;
		}
		
		// Check water shores and road borders around the clicked tile
		var t = null;
		for (var x = Math.max(p.x - 1, 0); x <= Math.min(p.x + 1, buffer.size.width); x++) {
			for (var y = Math.max(p.y - 1, 0); y <= Math.min(p.y + 1, buffer.size.height); y++) {
				t = vec2(x, y);
				removeShores(t);
				checkShores(t);
				checkRoads(t);
			}
		}
	}
	
	// Check water tiles and create shore active tiles for the borders
	function checkShores(p) {
		var x = p.x,
			y = p.y,
			shore = new Tily.ActiveTile(x, y, 1),
			layer = c => {
				var layer = new Tily.ActiveTileLayer(shore, shore);
				layer.text = c;
				shore.addLayer(layer);
			};
		shore.name = "shore";
		shore.font = "scenery_icons";
		shore.scale = vec2(1.05, 1.05);
		shore.foreground = "#39b54a";
		if (layers.water.getTile(x, y) == sceneryIcons.water) {
			var isWater = (x, y) => (
					x < 0 || x >= buffer.size.width ||
					y < 0 || y >= buffer.size.height
				) || layers.water.getTile(x, y) == sceneryIcons.water,
				t = isWater(x, y - 1),
				b = isWater(x, y + 1),
				l = isWater(x - 1, y),
				r = isWater(x + 1, y),
				tl = isWater(x - 1, y - 1),
				tr = isWater(x + 1, y - 1),
				bl = isWater(x - 1, y + 1),
				br = isWater(x + 1, y + 1);
			if (t && b && !l) { layer(sceneryIcons.shoreleft); }
			if (t && b && !r) { layer(sceneryIcons.shoreright); }
			if (!t && l && r) { layer(sceneryIcons.shoretop); }
			if (!b && l && r) { layer(sceneryIcons.shorebottom); }
			if (!t && b && l && !r) { layer(sceneryIcons.shoretopright); }
			if (t && !b && l && !r) { layer(sceneryIcons.shorebottomright); }
			if (!t && b && !l && r) { layer(sceneryIcons.shoretopleft); }
			if (t && !b && !l && r) { layer(sceneryIcons.shorebottomleft); }
			if (!t && b && !l && !r) { layer(sceneryIcons.shoretopleftright); }
			if (!t && !b && l && !r) { layer(sceneryIcons.shoretopbottomright); }
			if (t && !b && !l && !r) { layer(sceneryIcons.shorebottomleftright); }
			if (!t && !b && !l && r) { layer(sceneryIcons.shoretopbottomleft); }
			if (!t && !b && !l && !r) { layer(sceneryIcons.shoretopbottomleftright); }
			if (t && l && !tl) { layer(sceneryIcons.shorecornertopleft); }
			if (t && r && !tr) { layer(sceneryIcons.shorecornertopright); }
			if (b && l && !bl) { layer(sceneryIcons.shorecornerbottomleft); }
			if (b && r && !br) { layer(sceneryIcons.shorecornerbottomright); }
		}
		if (shore.layers.length) {
			buffer.addActiveTile(shore);
		}
	}
	
	// Remove shore active tiles
	function removeShores(p) {
		var tileInfo = buffer.getTileInfo(p.x, p.y);
		for (var i = tileInfo.activeTiles.length; i--;) {
			if (tileInfo.activeTiles[i].name == "shore") {
				buffer.removeActiveTile(tileInfo.activeTiles[i]);
			}
		}
	}
	
	// Check road tiles and create the proper road types
	function checkRoads(p) {
		var x = p.x,
			y = p.y;
		if (layers.roads.getTile(x, y) != "") {
			var isRoad = (x, y) => layers.roads.getTile(x, y) != "",
				t = isRoad(x, y - 1),
				b = isRoad(x, y + 1),
				l = isRoad(x - 1, y),
				r = isRoad(x + 1, y),
				c = " ",
				m = " ";
			if (!t && !b && l && r) {
				c = roadIcons.roadleftright;
				m = roadIcons.roadmarkingsleftright;
			}
			if (t && b && !l && !r) {
				c = roadIcons.roadtopbottom;
				m = roadIcons.roadmarkingstopbottom;
			}
			if (t && !b && !l && r) {
				c = roadIcons.roadtopright;
				m = roadIcons.roadmarkingstopright;
			}
			if (t && !b && l && !r) {
				c = roadIcons.roadtopleft;
				m = roadIcons.roadmarkingstopleft;
			}
			if (!t && b && !l && r) {
				c = roadIcons.roadbottomright;
				m = roadIcons.roadmarkingsbottomright;
			}
			if (!t && b && l && !r) {
				c = roadIcons.roadbottomleft;
				m = roadIcons.roadmarkingsbottomleft;
			}
			if (t && b && l && r) {
				c = roadIcons.roadtopbottomleftright;
				m = roadIcons.roadmarkingstopbottomleftright;
			}
			if (t && !b && l && r) {
				c = roadIcons.roadtopleftright;
				m = roadIcons.roadmarkingstopleftright;
			}
			if (t && b && !l && r) {
				c = roadIcons.roadtopbottomright;
				m = roadIcons.roadmarkingstopbottomright;
			}
			if (t && b && l && !r) {
				c = roadIcons.roadtopbottomleft;
				m = roadIcons.roadmarkingstopbottomleft;
			}
			if (!t && b && l && r) {
				c = roadIcons.roadbottomleftright;
				m = roadIcons.roadmarkingsbottomleftright;
			}
			if (t && !b && !l && !r) {
				c = roadIcons.roadtop;
				m = roadIcons.roadmarkingstop;
			}
			if (!t && b && !l && !r) {
				c = roadIcons.roadbottom;
				m = roadIcons.roadmarkingsbottom;
			}
			if (!t && !b && l && !r) {
				c = roadIcons.roadleft;
				m = roadIcons.roadmarkingsleft;
			}
			if (!t && !b && !l && r) {
				c = roadIcons.roadright;
				m = roadIcons.roadmarkingsright;
			}
			if (x == 0 && c == roadIcons.roadright) {
				c = roadIcons.roadleftright;
				m = roadIcons.roadmarkingsleftright;
			}
			if (x == buffer.size.width - 1 && c == roadIcons.roadleft) {
				c = roadIcons.roadleftright;
				m = roadIcons.roadmarkingsleftright;
			}
			if (y == 0 && c == roadIcons.roadbottom) {
				c = roadIcons.roadtopbottom;
				m = roadIcons.roadmarkingstopbottom;
			}
			if (y == buffer.size.height - 1 && c == roadIcons.roadtop) {
				c = roadIcons.roadtopbottom;
				m = roadIcons.roadmarkingstopbottom;
			}
			layers.roads.setTile(x, y, c);
			layers.roadMarkings.setTile(x, y, m);
			if (layers.water.getTile(x, y) == sceneryIcons.water) {
				layers.roadBridges.setTile(x, y, roadBridges[c]);
			}
		}
	}
	
	// Erase scenery tiles from the buffer
	function erase(p, exceptRoads) {
		layers.treeTrunks.setTile(p.x, p.y, "");
		layers.trees.setTile(p.x, p.y, "");
		layers.mountains.setTile(p.x, p.y, "");
		layers.mountainSnow.setTile(p.x, p.y, "");
		if (!exceptRoads) {
			layers.roads.setTile(p.x, p.y, "");
			layers.roadMarkings.setTile(p.x, p.y, "");
			layers.roadBridges.setTile(p.x, p.y, "");
		}
		
		// Remove house/office active tiles
		var tileInfo = buffer.getTileInfo(p.x, p.y);
		for (var i = tileInfo.activeTiles.length; i--;) {
			buffer.removeActiveTile(tileInfo.activeTiles[i]);
		}
	}
	
	// Draw grass tiles
	function drawLand(p) {
		// Remove water
		layers.water.setTile(p.x, p.y, "");
		
		// Remove all other tiles
		erase(p);
		
		// Draw random grass tiles
		var c = [" ", " ", " ", "a", "a", "b", "b", "c", "c", "ab", "bc", "ac", "abc"];
		layers.land.setTile(p.x, p.y, c[Math.randomIntBetween(0, c.length - 1)]);
	}
	
	// Draw water tiles
	function drawWater(p) {
		layers.water.setTile(p.x, p.y, sceneryIcons.water);
		
		// Remove all other tiles except roads
		erase(p, true);
		
		// If there is a road tile at this position, add a road bridge tile
		var road = layers.roads.getTile(p.x, p.y)
		if (road != "") {
			layers.roadMarkings.setTile(p.x, p.y, roadBridges[road]);
		}
	}
	
	// Draw tree tiles
	function drawTree(p) {
		// Cannot place trees on water
		if (layers.water.getTile(p.x, p.y) == sceneryIcons.water) { return; }
		
		// Select random trees and their corresponding tree trunks
		var trees = [
				"w", "x", "y", "z", "0", "wx", "wy", "wz", "w0", "xy", "xz", "x0", "yz", "y0",
				"z0", "wxy", "wxz", "wx0", "wyz", "wy0", "wz0"
			],
			trunks = [
				"1", "2", "3", "4", "5", "12", "13", "14", "15", "23", "24", "25", "34", "35",
				"45", "123", "124", "125", "134", "135", "145"
			],
			c = Math.randomIntBetween(0, trees.length - 1);
		
		// Remove all other tiles
		erase(p);
		
		// Draw trees and tree trunks
		layers.treeTrunks.setTile(p.x, p.y, trunks[c]);
		layers.trees.setTile(p.x, p.y, trees[c]);
	}
	
	// Draw mountain tiles
	function drawMountain(p) {
		// Cannot place mountains on water
		if (layers.water.getTile(p.x, p.y) == sceneryIcons.water) { return; }
		
		// Remove all other tiles
		erase(p);
		
		// Draw mountains and mountain snow
		layers.mountains.setTile(p.x, p.y, sceneryIcons.mountain);
		layers.mountainSnow.setTile(p.x, p.y, sceneryIcons.mountainsnow);
	}
	
	// Draw road tiles
	function drawRoad(p) {
		// Remove all other tiles
		erase(p);
		
		// Mark roads with a space (actual road tiles will be placed in checkRoads())
		layers.roads.setTile(p.x, p.y, " ");
	}
	
	// Draw house active tiles
	function drawHouse(p) {
		// Cannot place house tiles on water
		if (layers.water.getTile(p.x, p.y) == sceneryIcons.water) { return; }
		
		// Remove all other tiles
		erase(p);
		
		// Create a random house active tile
		switch (Math.randomIntBetween(1, 3)) {
			case 1: buffer.addActiveTile(house1(p)); break;
			case 2: buffer.addActiveTile(house2(p)); break;
			case 3: buffer.addActiveTile(house3(p)); break;
			default: break;
		}
	}
	
	// House 1
	function house1(p) {
		var house = new Tily.ActiveTile(p.x, p.y),
			body = new Tily.ActiveTileLayer(house, house),
			door = new Tily.ActiveTileLayer(house, house),
			roof = new Tily.ActiveTileLayer(house, house),
			windows = new Tily.ActiveTileLayer(house, house);
		house.font = "building_icons";
		body.foreground = "#c1272d";
		door.foreground = "#603813";
		roof.foreground = "#42210b";
		windows.foreground = "#b0deff";
		body.text = buildingIcons.house1body;
		door.text = buildingIcons.house1door;
		roof.text = buildingIcons.house1roof;
		windows.text = buildingIcons.house1windows;
		house.addLayer(body);
		house.addLayer(door);
		house.addLayer(roof);
		house.addLayer(windows);
		return house;
	}
	
	// House 2
	function house2(p) {
		var house = new Tily.ActiveTile(p.x, p.y),
			body = new Tily.ActiveTileLayer(house, house),
			door = new Tily.ActiveTileLayer(house, house),
			roof = new Tily.ActiveTileLayer(house, house),
			windows = new Tily.ActiveTileLayer(house, house);
		house.font = "building_icons";
		body.foreground = "#c1272d";
		door.foreground = "#603813";
		roof.foreground = "#42210b";
		windows.foreground = "#b0deff";
		body.text = buildingIcons.house2body;
		door.text = buildingIcons.house2door;
		roof.text = buildingIcons.house2roof;
		windows.text = buildingIcons.house2windows;
		house.addLayer(body);
		house.addLayer(door);
		house.addLayer(roof);
		house.addLayer(windows);
		return house;
	}
	
	// House 3
	function house3(p) {
		var house = new Tily.ActiveTile(p.x, p.y),
			body = new Tily.ActiveTileLayer(house, house),
			doors = new Tily.ActiveTileLayer(house, house),
			roof = new Tily.ActiveTileLayer(house, house),
			windows = new Tily.ActiveTileLayer(house, house);
		house.font = "building_icons";
		body.foreground = "#c1272d";
		doors.foreground = "#603813";
		roof.foreground = "#42210b";
		windows.foreground = "#b0deff";
		body.text = buildingIcons.house3body;
		doors.text = buildingIcons.house3doors;
		roof.text = buildingIcons.house3roof;
		windows.text = buildingIcons.house3windows;
		house.addLayer(body);
		house.addLayer(doors);
		house.addLayer(roof);
		house.addLayer(windows);
		return house;
	}
	
	// Draw office active tiles
	function drawOffice(p) {
		// Cannot place office tiles on water
		if (layers.water.getTile(p.x, p.y) == sceneryIcons.water) { return; }
		
		// Remove all other tiles
		erase(p);
		
		// Create a random house active tile
		switch (Math.randomIntBetween(1, 3)) {
			case 1: buffer.addActiveTile(office1(p)); break;
			case 2: buffer.addActiveTile(office2(p)); break;
			case 3: buffer.addActiveTile(office3(p)); break;
			default: break;
		}
	}
	
	// Office 1
	function office1(p) {
		var office = new Tily.ActiveTile(p.x, p.y),
			body = new Tily.ActiveTileLayer(office, office),
			door = new Tily.ActiveTileLayer(office, office),
			logo1 = new Tily.ActiveTileLayer(office, office),
			logo2 = new Tily.ActiveTileLayer(office, office),
			windows = new Tily.ActiveTileLayer(office, office);
		office.font = "building_icons";
		body.foreground = "#998675";
		door.foreground = "#c1272d";
		logo1.foreground = "#ff0";
		logo2.foreground = "#222";
		windows.foreground = "#b0deff";
		body.text = buildingIcons.office1body;
		door.text = buildingIcons.office1door;
		logo1.text = buildingIcons.office1logolayer1;
		logo2.text = buildingIcons.office1logolayer2;
		windows.text = buildingIcons.office1windows;
		office.addLayer(body);
		office.addLayer(door);
		office.addLayer(logo2);
		office.addLayer(logo1);
		office.addLayer(windows);
		return office;
	}
	
	// Office 2
	function office2(p) {
		var office = new Tily.ActiveTile(p.x, p.y),
			body = new Tily.ActiveTileLayer(office, office),
			door = new Tily.ActiveTileLayer(office, office),
			sign = new Tily.ActiveTileLayer(office, office),
			windows = new Tily.ActiveTileLayer(office, office);
		office.font = "building_icons";
		body.foreground = "#998675";
		door.foreground = "#c1272d";
		sign.foreground = "#fb0";
		windows.foreground = "#b0deff";
		body.text = buildingIcons.office2body;
		door.text = buildingIcons.office2door;
		sign.text = buildingIcons.office2sign;
		windows.text = buildingIcons.office2windows;
		office.addLayer(body);
		office.addLayer(door);
		office.addLayer(sign);
		office.addLayer(windows);
		return office;
	}
	
	// Office 3
	function office3(p) {
		var office = new Tily.ActiveTile(p.x, p.y),
			body = new Tily.ActiveTileLayer(office, office),
			chimney = new Tily.ActiveTileLayer(office, office),
			doors = new Tily.ActiveTileLayer(office, office),
			logo1 = new Tily.ActiveTileLayer(office, office),
			logo2 = new Tily.ActiveTileLayer(office, office);
		office.font = "building_icons";
		body.foreground = "#998675";
		chimney.foreground = "#b0a79e";
		doors.foreground = "#c1272d";
		logo1.foreground = "#ff0";
		logo2.foreground = "#222";
		body.text = buildingIcons.office3body;
		chimney.text = buildingIcons.office3chimney;
		doors.text = buildingIcons.office3doors;
		logo1.text = buildingIcons.office3logolayer1;
		logo2.text = buildingIcons.office3logolayer2;
		office.addLayer(body);
		office.addLayer(chimney);
		office.addLayer(doors);
		office.addLayer(logo2);
		office.addLayer(logo1);
		return office;
	}
	
	// Download a text file
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
	
	var DEFAULT_WIDTH = 16,
		DEFAULT_HEIGHT = 16,
		MIN_WIDTH = 4,
		MIN_HEIGHT = 4,
		MAX_WIDTH = 64,
		MAX_HEIGHT = 64;
	var tily = null,
		buffer = null,
		layers = {
			water: null,
			land: null,
			treeTrunks: null,
			trees: null,
			mountains: null,
			mountainSnow: null,
			roads: null,
			roadMarkings: null,
			roadBridges: null
		},
		tool = "pan",
		previousTool = "pan",
		previousTile = null;
	return {
		
		// Initialise the buffer painter
		initialise: function(canvas) {
			tily = new Tily.Main(canvas);
			var hammer = new Hammer.Manager(canvas, { recognizers: [
				[Hammer.Tap],
				[Hammer.Pan],
				[Hammer.Pinch]
			] });
			
			// Toolbar button events
			var toolChanged = function(e, t) {
				if (e) {
					var target = e.currentTarget.getAttribute("for");
					tool = document.querySelector("#" + target).value;
				} else {
					tool = t;
					document.querySelector("#" + t).checked = true;
				}
				canvas.setAttribute("class", "tool-" + tool);
			};
			document.querySelector("#button-save").addEventListener("click", painter.save);
			document.querySelector("#button-pan").addEventListener("click", toolChanged, false);
			document.querySelector("#button-land").addEventListener("click", toolChanged, false);
			document.querySelector("#button-water").addEventListener("click", toolChanged, false);
			document.querySelector("#button-tree").addEventListener("click", toolChanged, false);
			document.querySelector("#button-mountain").addEventListener("click", toolChanged, false);
			document.querySelector("#button-road").addEventListener("click", toolChanged, false);
			document.querySelector("#button-house").addEventListener("click", toolChanged, false);
			document.querySelector("#button-office").addEventListener("click", toolChanged, false);
			
			// Toolbar size input events
			var widthInput = document.querySelector("#input-width"),
				heightInput = document.querySelector("#input-height"),
				sizeChanged = function(e) {
					var width = Math.clamp(parseInt(widthInput.value), MIN_WIDTH, MAX_WIDTH),
						height = Math.clamp(parseInt(heightInput.value), MIN_HEIGHT, MAX_HEIGHT);
					widthInput.value = width;
					heightInput.value = height;
					resize(width, height);
				};
			widthInput.addEventListener("change", sizeChanged);
			heightInput.addEventListener("change", sizeChanged);
			
			// User input events
			var dragStart = null,
				pinchStart = null;
			hammer.on("tap", function(e) {
				if (!tily.activeBuffer) { return; }
				var p = vec2.mul(vec2(e.center.x, e.center.y), window.devicePixelRatio);
				p.y -= 50;	// Correct for toolbar height
				click(p);
			});
			hammer.on("panstart", function(e) {
				if (!tily.activeBuffer) { return; }
				var p = vec2.mul(vec2(e.center.x, e.center.y), window.devicePixelRatio);
				dragStart = vec2.add(tily.activeBuffer.offsetPixels, p);
				dragStart.y -= 50;	// Correct for toolbar height
			});
			hammer.on("panend", function(e) {
				dragStart = null;
			});
			hammer.on("pan", function(e) {
				if (!tily.activeBuffer || !dragStart) { return; }
				var p = vec2.mul(vec2(e.center.x, e.center.y), window.devicePixelRatio);
				p.y -= 50;	// Correct for toolbar height
				drag(p, dragStart);
			});
			hammer.on("pinchstart", function(e) {
				if (!tily.activeBuffer) { return; }
				pinchStart = tily.activeBuffer.scale;
			});
			hammer.on("pinchend", function(e) { pinchStart = null; });
			hammer.on("pinch", function(e) {
				if (!tily.activeBuffer) { return; }
				tily.activeBuffer.zoom(pinchStart / e.scale);
			});
			window.addEventListener("wheel", function(e) {
				if (!tily.activeBuffer) { return; }
				var deltaScale = e.deltaY > 0 ? 1 : -1;
				tily.activeBuffer.zoom(tily.activeBuffer.scale + deltaScale, { time: 0.1 });
			}, false);
			window.addEventListener("keydown", function(e) {
				switch (e.key) {
					case "l": toolChanged(null, "land"); break;
					case "w": toolChanged(null, "water"); break;
					case "t": toolChanged(null, "tree"); break;
					case "m": toolChanged(null, "mountain"); break;
					case "r": toolChanged(null, "road"); break;
					case "h": toolChanged(null, "house"); break;
					case "o": toolChanged(null, "office"); break;
					case " ":
						if (tool != "pan") {
							previousTool = tool;
							toolChanged(null, "pan");
						}
						break;
					default: break;
				}
			});
			window.addEventListener("keyup", function(e) {
				switch (e.key) {
					case " ":
						if (previousTool != null) {
							toolChanged(null, previousTool);
							previousTool = null;
						}
						break;
					default: break;
				}
			});
			
			// Set up dropzone
			Dropzone.autoDiscover = false;
			Dropzone.autoProcessQueue = false;
			var dropzone = new Dropzone("#content", { url: "/" });
			dropzone.on("addedfile", function(file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					painter.load(e.target.result);
				};
				reader.readAsText(file);
			});
			
			// Create initial buffer
			widthInput.value = DEFAULT_WIDTH;
			heightInput.value = DEFAULT_HEIGHT;
			buffer = new Tily.Buffer(DEFAULT_WIDTH, DEFAULT_HEIGHT, {
				clampCamera: true,
				initialScale: 8
			});
			
			// Create buffer layers
			// Land
			layers.land = new Tily.TileLayer(buffer);
			layers.land.font = "scenery_icons";
			layers.land.background = "#39b54a";
			layers.land.foreground = "#009245";
			
			// Water
			layers.water = new Tily.TileLayer(buffer);
			layers.water.font = "scenery_icons";
			layers.water.background = "#29abe2";
			layers.water.foreground = "#79c8e9";
			
			// Tree trunks
			layers.treeTrunks = new Tily.TileLayer(buffer);
			layers.treeTrunks.font = "scenery_icons";
			layers.treeTrunks.foreground = "#754c24";
			
			// Trees
			layers.trees = new Tily.TileLayer(buffer);
			layers.trees.font = "scenery_icons";
			layers.trees.foreground = "#006837";
			
			// Mountains
			layers.mountains = new Tily.TileLayer(buffer);
			layers.mountains.font = "scenery_icons";
			layers.mountains.foreground = "#504b48";
			
			// Mountain snow
			layers.mountainSnow = new Tily.TileLayer(buffer);
			layers.mountainSnow.font = "scenery_icons";
			layers.mountainSnow.foreground = "#e6e6e6";
			
			// Roads
			layers.roads = new Tily.TileLayer(buffer);
			layers.roads.font = "road_icons";
			layers.roads.foreground = "#4d4d4d";
			
			// Road markings
			layers.roadMarkings = new Tily.TileLayer(buffer);
			layers.roadMarkings.font = "road_icons";
			layers.roadMarkings.foreground = "#e6e6e6";
			
			// Road bridges
			layers.roadBridges = new Tily.TileLayer(buffer);
			layers.roadBridges.font = "road_icons";
			layers.roadBridges.foreground = "#7d756f";
			
			// Add layers to the buffer
			buffer.addLayer(layers.land);
			buffer.addLayer(layers.water);
			buffer.addLayer(layers.treeTrunks);
			buffer.addLayer(layers.trees);
			buffer.addLayer(layers.mountains);
			buffer.addLayer(layers.mountainSnow);
			buffer.addLayer(layers.roads);
			buffer.addLayer(layers.roadMarkings);
			buffer.addLayer(layers.roadBridges);
			
			// Fill land layer with tiles
			for (var x = 0; x < DEFAULT_WIDTH; x++) {
				for (var y = 0; y < DEFAULT_HEIGHT; y++) {
					drawLand(vec2(x, y));
				}
			}
			tily.activateBuffer(buffer);
		},
		
		// Load a buffer from the specified data
		load: function(data) {
			buffer = Tily.Buffer.deserialize(data);
			layers.land = buffer.layers[0];
			layers.water = buffer.layers[1];
			layers.treeTrunks = buffer.layers[2];
			layers.trees = buffer.layers[3];
			layers.mountains = buffer.layers[4];
			layers.mountainSnow = buffer.layers[5];
			layers.roads = buffer.layers[6];
			layers.roadMarkings = buffer.layers[7];
			layers.roadBridges = buffer.layers[8];
			tily.activateBuffer(buffer);
			document.querySelector("#input-width").value = buffer.size.width;
			document.querySelector("#input-height").value = buffer.size.height;
		},
		
		// Save and download the buffer as JSON data
		save: function() {
			download("map.json", buffer.serialize());
		}
	};
}());