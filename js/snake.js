$(document).ready(function() {
	
	//Create board
	var table = document.createElement("TABLE");
	table.id = "board";
	table.border = "1";
	
	var columnCount = 50;
	var rowCount = 35;
	for (var i = 0; i < rowCount; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < columnCount; j++) {
			var cell = row.insertCell(-1);
			cell.id = j.toString() + "-" + i.toString();
		}
	}

	// Wait until table is loaded
	$("#board").waitUntilExists(startGame);

	var container = document.getElementById("boardcontainer");
	container.appendChild(table);

	var board = document.getElementById("board");

	// Board dimensions
	var rows = board.rows.length;
	var columns = board.rows[0].cells.length;


	var Snake = function(start) {
		
		this.currX = start[0];
		this.currY = start[1];

		this.loopTime = 100;

		this.currentPowerup;
		this.powerupActive = false;
		this.powerupTimer = 0;

		this.snakeLength = 16;
		this.snakeBody = [[this.currX,this.currY]]
		this.moves = ["down"];
		this.oldDirection = "down";

		for (i=this.snakeLength-2;i>=0;i--) {  // Build snake
			this.snakeBody.push([5,i+5]);
		}

		for (i=0; i<this.snakeLength; i++) {  // Colour snake
			var segment = this.snakeBody[i];
			$(posToId([segment[0],segment[1]])).toggleClass("snake");
			//board.rows[segment[1]].cells[segment[0]].style.background = "black";
		}

		var self = this;

		// Keypress event listeners
		$(window).keydown(function(e) {
			currDir = null;
			if (self.moves.length===0) {
				currDir = self.oldDirection;
			}
			if (e.keyCode===87) {  // W key
				if (self.moves[0]!=="down" && self.moves[0]!=="up" && currDir!=="down") {
					self.moves.unshift("up");
				}
			} else if (e.keyCode===83) {  // S key
				if (self.moves[0]!=="up" && self.moves[0]!=="down" && currDir!=="up") {
					self.moves.unshift("down");
				}
			} else if (e.keyCode===68) {  // D key
				if (self.moves[0]!=="left" && self.moves[0]!=="right" && currDir!=="left") {
					self.moves.unshift("right");
				}
			} else if (e.keyCode===65) {  // A key
				if (self.moves[0]!=="right" && self.moves[0]!=="left" && currDir!=="right") {
					self.moves.unshift("left");
				}
			}
		});


		// Move snake's position on board
		this.updateSegments = function(nextX,nextY) {
			var currentPos = [this.currX,this.currY].toString();
			var foodPos1 = food1.position.toString();
			var foodPos2 = food2.position.toString();
			var powerUpPos = powerUpTest.position.toString();
			this.snakeBody.unshift([this.currX,this.currY]);
			if (currentPos===foodPos1) {  // When snake passes over food
				$(posToId(food1.position)).toggleClass("food");
				removeFromBoard(food1.position);
				food1.generateFood();
			} else if (currentPos===foodPos2) {
				$(posToId(food2.position)).toggleClass("food");
				removeFromBoard(food2.position);
				food2.generateFood();
			} else if (currentPos===powerUpPos) {
				$(posToId(powerUpTest.position)).toggleClass("speed");
				powerUpTest.activatePowerup(snake1);
				removeFromBoard(powerUpTest.position);
				this.currentPowerup = powerUpTest;
				this.powerupActive = true;
			} else {
				var lastSeg = this.snakeBody.pop();
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass("snake"); // Remove final segment of snake
			}
			$(posToId([nextX,nextY])).toggleClass("snake"); // Display new position of head of snake
		}


		// Return snake's next direction
		this.getNextMove = function() {
			if (this.moves.length===0) {
				return this.oldDirection;
			} else {
				return this.moves.pop();
			}
		}


		// Return next position of snake haid
		this.getNextCell = function(dir) {
			switch (dir) {
				case "up":
					this.currY -= 1;
					break;
				case "down":
					this.currY += 1;
					break;
				case "right":
					this.currX += 1;
					break;
				case "left":
					this.currX -= 1;
			}
			return [this.currX,this.currY];
		}


		// Check for collisions
		this.isValid = function(cell) {
			var valid = false;
			if (cell[0]>=0&&cell[0]<columns&&cell[1]>=0&&cell[1]<rows && !this.checkTailCollision(cell)) {
				return true;
			}
		}

		
		// Check if snake has collided with itself
		this.checkTailCollision = function(cell) {
			var body = this.snakeBody.slice(0, -1); 
			for (var i = 0; i < body.length; i++) {
				if (body[i][0] == cell[0] && body[i][1] == cell[1]) {
					return true;
				}
			}
			return false;
		}


		this.checkOverlap = function(pos) {
			for (var i = 0; i < this.snakeBody.length; i++) {
				if (this.snakeBody[i][0] == pos[0] && this.snakeBody[i][1] == pos[1]) {
					return true;
				}
			}
			return false;
		}


		// Move snake
		this.move = function() {
			setTimeout(function(){

				var newDirection = self.getNextMove();
				var nextCell = self.getNextCell(newDirection);

				if (self.isValid(nextCell)) {
					self.oldDirection = newDirection;
					
					var nextX = nextCell[0];
					var nextY = nextCell[1];

					self.updateSegments(nextX,nextY);

					self.snakeLength++;
				} else {
					console.log("Game over");
					gameRunning = false;
				}

				if (self.powerupActive) {
					if (self.powerupTimer>=10000) {
						self.powerupActive = false;
						self.currentPowerup.deactivatePowerup(snake1);
					}
					self.powerupTimer += self.loopTime;
				}

				if (gameRunning===true) {
					self.move();
				}
			}, self.loopTime);

		}

		var gameRunning = true;

		this.move();

	}


	// Food constructor
	var Food = function(pos) {
		this.position = pos;

		this.generateFood = function() {
			this.position = generatePosition();
			$(posToId([this.position[0],this.position[1]])).toggleClass("food");  // Display food
			placedItems.push(this.position);
		}
	}


	var Powerup = function(snake) {
		this.position;
		this.powerType;

		var types = ["speed","shrink","invincible"];

		this.generatePowerup = function() {
			//var rand = types[((Math.random() * (2 - 0 + 1) ) << 0)];
			var type = types[0];
			switch (type) {
				case "speed":
					this.powerType = type;
					this.position = generatePosition();
					$(posToId([this.position[0],this.position[1]])).toggleClass("speed");
					break;
				case "shrink":
					//
					break;
				case "invincible":
					//
			}
			placedItems.push(this.position);
		}

		this.activatePowerup = function(snake) {
			switch (this.powerType) {
				case "speed":
					snake.loopTime -= 50;
					break;
				case "shrink":
					//
					break;
				case "invincible":
					//
			}

		}

		this.deactivatePowerup = function(snake) {
			switch (this.powerType) {
				case "speed":
					snake.loopTime = 100;
					break;
				case "shrink":
					//
					break;
				case "invincible":
					//
			}
		}


	}


	function generatePosition() {
		var pos = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];
		while (snake1.checkOverlap(pos) || isItemInArray(placedItems,pos)) {  // To avoid placing food on top of snakes
			pos = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];
		}
		return pos;
	}


	function idToPos(id) {  // Not needed atm
		var splitPos = idString.split("-");
		return [parseInt(splitPos[0]),parseInt(splitPos[1])];
	}

	function posToId(pos) {
		return "#" + pos[0] + "-" + pos[1];
	}

	function isItemInArray(array, item) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][0] == item[0] && array[i][1] == item[1]) {
	            return true;   // Found it
	          }
	        }
	    return false;   // Not found
	  }

	function findIndex(array,item) {
		for (var i = 0; i < array.length; i++) {
		    if (array[i][0] == item[0] && array[i][1] == item[1]) {
		        return i;
		    }
		}
		console.log("Error: not found");
	}

	function removeFromBoard(pos) { // not working
		index = findIndex(placedItems,pos);
		if (index > -1) {
		    placedItems.splice(index, 1);
		}
	}


	// Set up snakes, food and power-ups
	function startGame() {

		placedItems = [];

		snake1 = new Snake([5,20]);

		food1 = new Food();
		food2 = new Food();

		food1.generateFood();
		food2.generateFood();

		powerUpTest = new Powerup();
		powerUpTest.generatePowerup();

	}

	

	//var newGame = new Game([5,20]);


})

