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
		//this.powerupActive = false;

		this.powerup1Active = false;
		this.powerup2Active = false;
		this.powerupTimer = 0;

		this.invincible = false;

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
			var powerupPos1 = powerup1.position.toString();
			var powerupPos2 = powerup2.position.toString();
			//var powerUpPos = powerUpTest.position.toString();
			this.snakeBody.unshift([this.currX,this.currY]);
			if (currentPos===foodPos1) {  // When snake passes over food
				$(posToId(food1.position)).toggleClass("food");
				removeFromBoard(food1.position);
				food1.generateFood();
			} else if (currentPos===foodPos2) {
				$(posToId(food2.position)).toggleClass("food");
				removeFromBoard(food2.position);
				food2.generateFood();
			} else if (currentPos===powerupPos1 && !this.powerup1Active) {  // what about powerup1 then powerup1 again
				if (this.powerup2Active) {
					powerup2.deactivatePowerup(snake1); //change snake1
					this.powerupTime = 0;
				}
				console.log("contact1: " + currentPos + " " + powerupPos1);
				$(posToId(powerup1.position)).toggleClass(powerup1.powerType);
				powerup1.activatePowerup(snake1); // change snake1
				removeFromBoard(powerup1.position);
				this.currentPowerup = powerup1;
				this.powerup1Active = true;
				var lastSeg = this.snakeBody.pop(); // make this more DRY
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass("snake"); // Remove final segment of snake
				setTimeout(function() {
					powerup1.generatePowerup()
				},10000);
			} else if (currentPos===powerupPos2 && !this.powerup2Active) {
				if (this.powerup1Active) {
					powerup1.deactivatePowerup(snake1); //change snake1
					this.powerupTimer = 0;
				}
				console.log("contact2: " + currentPos + " " + powerupPos2);
				$(posToId(powerup2.position)).toggleClass(powerup2.powerType);
				powerup2.activatePowerup(snake1); // change snake1
				removeFromBoard(powerup2.position);
				this.currentPowerup = powerup2;
				this.powerup2Active = true;
				var lastSeg = this.snakeBody.pop();
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass("snake"); // Remove final segment of snake
				setTimeout(function() {
					powerup2.generatePowerup();
				},10000);
			} else {
				var lastSeg = this.snakeBody.pop(); // make this more DRY
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


		// Return next position of snake head
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


		// Checks for collisions
		this.isValid = function(cell) {
			var valid = false;
			if (cell[0]>=0&&cell[0]<columns&&cell[1]>=0&&cell[1]<rows && !this.checkTailCollision(cell)) {
				return true;
			}
		}

		
		// Checks if snake has collided with itself
		this.checkTailCollision = function(cell) {
			if (this.invincible) {
				return false;
			}
			var body = this.snakeBody.slice(0, -1); 
			for (var i = 0; i < body.length; i++) {
				if (body[i][0] == cell[0] && body[i][1] == cell[1]) {
					return true;
				}
			}
			return false;
		}


		// Checks if position is already occupied by snake or object
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

				if (self.powerup1Active || self.powerup2Active) {
					if (self.powerupTimer>=6000) {
						console.log('finish');
						self.powerup1Active = false;
						self.powerup2Active = false;
						//console.log('sdsdfsd');
						self.currentPowerup.deactivatePowerup(snake1); // change snake1
						self.powerupTimer = 0;
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

		var types = ["speed","invincible","shrink"];

		this.generatePowerup = function() {
			var rand = types[((Math.random() * (1 - 0 + 1) ) << 0)]; // change first '1' to '2'
			switch (rand) {
				case "speed":
					this.powerType = rand;
					this.position = generatePosition();
					$(posToId([this.position[0],this.position[1]])).toggleClass("speed");
					break;
				case "shrink":
					//
					break;
				case "invincible":
					this.powerType = rand;
					this.position = generatePosition();
					$(posToId([this.position[0],this.position[1]])).toggleClass("invincible");
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
					snake.invincible = true;
			}

		}

		this.deactivatePowerup = function(snake) {
			console.log("deactivating");
			switch (this.powerType) {
				case "speed":
					snake.loopTime = 100;
					break;
				case "shrink":
					//
					break;
				case "invincible":
					snake.invincible = false;
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

		// Timeout doesn't work because updateSegments() tries to call powerup(1/2).position
		powerup1 = new Powerup();
		powerup2 = new Powerup();
		powerup1.generatePowerup();
		powerup2.generatePowerup();

	}

	

	//var newGame = new Game([5,20]);


})

