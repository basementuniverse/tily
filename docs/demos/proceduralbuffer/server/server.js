// Note: you will need to install alea and simplex-noise libraries and have tily.min.js
// as a local file to run this server
var http = require("http"),
  url = require("url"),
  Alea = require("alea"),
  SimplexNoise = require("simplex-noise"),
  Tily = require("./tily.min.js.js.js.js"),
  settings = {
    ip: "127.0.0.1",
    port: 1337,
    cellSize: 16,
    seed: 12345
  };

// Character codes for the scenery_icons font
var sceneryIcons = {
  "grass": "c",
  "mountain": "d",
  "mountainsnow": "e",
  "tree": "y",
  "treetrunk": "3",
  "water": "6"
};

// Create the cell server
http.createServer(function(request, response) {
  var urlParts = url.parse(request.url, true),
    cellX = urlParts.query.x || 0,
    cellY = urlParts.query.y || 0;

  // Initialise seeded PRNGs and noise generators
  var waterSeed = new Alea((settings.seed + 1) % 65536),
    treeSeed = new Alea((settings.seed + 2) % 65536),
    mountainSeed = new Alea((settings.seed + 3) % 65536);
  var waterNoise = new SimplexNoise(waterSeed),
    treeNoise = new SimplexNoise(treeSeed),
    mountainNoise = new SimplexNoise(mountainSeed);

  // Create a cell and some layers
  var cell = new Tily.Cell({  // Using shim object for cellbuffer
      options: { cellWidth: settings.cellSize, cellHeight: settings.cellSize }
    }),
    land = new Tily.TileLayer(cell),
    water = new Tily.TileLayer(cell),
    trees = new Tily.TileLayer(cell),
    treeTrunks = new Tily.TileLayer(cell),
    mountains = new Tily.TileLayer(cell),
    mountainSnow = new Tily.TileLayer(cell);

  // Set layer properties
  land.font = "scenery_icons";
  land.foreground = "#009245";
  land.background = "#39b54a";
  water.font = "scenery_icons";
  water.foreground = "#79c8e9";
  water.background = "#29abe2";
  trees.font = "scenery_icons";
  trees.foreground = "#006837";
  treeTrunks.font = "scenery_icons";
  treeTrunks.foreground = "#754c24";
  mountains.font = "scenery_icons";
  mountains.foreground = "#504b48";
  mountainSnow.font = "scenery_icons";
  mountainSnow.foreground = "#e6e6e6";

  // Add the layers to the cell
  cell.addLayer(land);
  cell.addLayer(water);
  cell.addLayer(treeTrunks);
  cell.addLayer(trees);
  cell.addLayer(mountains);
  cell.addLayer(mountainSnow);

  // Fill in layer tiles with simplex noise terrain
  for (var y = 0; y < settings.cellSize; y++) {
    for (var x = 0; x < settings.cellSize; x++) {
      var tileX = x + (cellX * settings.cellSize),
        tileY = y + (cellY * settings.cellSize),
        w = Math.abs(waterNoise.noise2D(tileX / 32, tileY / 32)) < 0.12,
        t = Math.abs(treeNoise.noise2D(tileX / 48, tileY / 48)) > 0.42,
        m = Math.abs(mountainNoise.noise2D(tileX / 24, tileY / 24)) < 0.04;
      land.setTile(x, y, sceneryIcons.grass);
      if (w) {
        water.setTile(x, y, sceneryIcons.water);
      } else {
        if (m) {
          mountains.setTile(x, y, sceneryIcons.mountain);
          mountainSnow.setTile(x, y, sceneryIcons.mountainsnow);
        } else if (t) {
          trees.setTile(x, y, sceneryIcons.tree);
          treeTrunks.setTile(x, y, sceneryIcons.treetrunk);
        }
      }
    }
  }

  // Respond with the cell data
  response.writeHead(
    200,
    {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    }
  );
  response.end(cell.serialize());
  console.log("Sent cell " + cellX + ", " + cellY);
}).listen(settings.port, settings.ip);
console.log("Server running at http://" + settings.ip + ":" + settings.port + "/");
