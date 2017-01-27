/**
 * Generate a maze.
 * @param {Number} width The maze width.
 * @param {Number} height The maze height.
 * @returns {Object} An object containing information about the maze. The 'tiles' property will be
 * a 2d-array of values where 0 means path and 1 means wall. The 'width' and 'height' properties
 * will contain the width and height of the maze and the 'entrance' and 'exit' properties will be a
 * vec2 instance containing the entrance and exit positions.
 */
function generateMaze(width, height) {
	var PATH = 0,
		WALL = 1;
	var maze = [],
		randomDir = function() {
			var dirs = ["up", "down", "left", "right"];
			dirs.shuffle();
			return dirs;
		};
	
	// Make sure maze width and height are odd numbers and greater than 1
	if (width <= 1 || height <= 1) { return; }
	if (width % 2 == 0) { width++; }
	if (height % 2 == 0) { height++; }
	
	// Fill the maze with walls initially
	for (var x = 0; x < width; x++) {
		maze[x] = [];
		for (var y = 0; y < height; y++) {
			maze[x][y] = WALL;
		}
	}
	
	// Random start position (odd numbers)
	var start = vec2(0, 0);
	while (start.x % 2 == 0) { start.x = Math.randomIntBetween(1, width - 1); }
	while (start.y % 2 == 0) { start.y = Math.randomIntBetween(1, height - 1); }
	maze[start.x][start.y] = PATH;
	
	// Build maze recursively
	(function buildMaze(p) {
		var d = randomDir(),
			p1 = null,
			p2 = null;
		for (var i = 0; i < 4; i++) {
			switch(d[i]) {
				case "up":
					p1 = vec2(p.x, p.y - 1);
					p2 = vec2(p.x, p.y - 2);
					if (p2.y > 0 && maze[p2.x][p2.y] != PATH) {
						maze[p1.x][p1.y] = PATH;
						maze[p2.x][p2.y] = PATH;
						buildMaze(p2);
					}
					break;
				case "down":
					p1 = vec2(p.x, p.y + 1);
					p2 = vec2(p.x, p.y + 2);
					if (p2.y < height - 1 && maze[p2.x][p2.y] != PATH) {
						maze[p1.x][p1.y] = PATH;
						maze[p2.x][p2.y] = PATH;
						buildMaze(p2);
					}
					break;
				case "left":
					p1 = vec2(p.x - 1, p.y);
					p2 = vec2(p.x - 2, p.y);
					if (p2.x > 0 && maze[p2.x][p2.y] != PATH) {
						maze[p1.x][p1.y] = PATH;
						maze[p2.x][p2.y] = PATH;
						buildMaze(p2);
					}
					break;
				case "right":
					p1 = vec2(p.x + 1, p.y);
					p2 = vec2(p.x + 2, p.y);
					if (p2.x < width - 1 && maze[p2.x][p2.y] != PATH) {
						maze[p1.x][p1.y] = PATH;
						maze[p2.x][p2.y] = PATH;
						buildMaze(p2);
					}
					break;
			}
		}
	}(start));
	
	// Pick a cell along the top edge with a path below it for the entrance
	var entrance = vec2(0, 0);
	while (maze[entrance.x][1] == WALL) {
		entrance.x = Math.randomIntBetween(1, width - 1);
	}
	maze[entrance.x][entrance.y] = PATH;
	
	// Pick a cell along the bottom edge with a path above it for the exit
	var exit = vec2(0, height - 1);
	while (maze[exit.x][height - 2] == WALL) {
		exit.x = Math.randomIntBetween(1, width - 1);
	}
	maze[exit.x][exit.y] = PATH;
	
	// Return the maze with it's dimensions and entrance/exit positions
	return {
		tiles: maze,
		width: width,
		height: height,
		entrance: entrance,
		exit: exit
	};
};
