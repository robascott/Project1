$(document).ready(function() {
	
	//Create a HTML Table element.
	var table = document.createElement("TABLE");
	table.id = "board";
	table.border = "1";
	
	var columnCount = 50;
	var rowCount = 35;
	for (var i = 0; i < rowCount; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < columnCount; j++) {
			var cell = row.insertCell(-1);
			cell.id = j.toString() + "-" + i.toString(); //var coor = JSON.parse("[" + string + "]");
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

		this.snakeLength = 16;
		this.snakeBody = [[this.currX,this.currY]]
		this.moves = ["down"];
		this.oldDirection = "down";

		for (i=this.snakeLength-2;i>=0;i--) {  // Build snake
			this.snakeBody.push([5,i+5]);
		}

		for (i=0; i<this.snakeLength; i++) {  // Colour snake
			var segment = this.snakeBody[i];
			board.rows[segment[1]].cells[segment[0]].style.background = "black";
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
			this.snakeBody.unshift([this.currX,this.currY]);
			if (currentPos===foodPos1) {  // When snake passes over food
				food1.generateFood();
				removeElement(foodPos1);
			} else if (currentPos===foodPos2) {
				food2.generateFood();
				removeElement(foodPos2);
			} else {
				var lastSeg = this.snakeBody.pop();
				board.rows[lastSeg[1]].cells[lastSeg[0]].style.background = "#FFFFCC"; // Remove final segment of snake
			}
			board.rows[nextY].cells[nextX].style.background = "black"; // Display new position of head of snake
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
					alert("Game over");
					gameRunning = false;
				}

				if (gameRunning===true) {
					self.move();
				}
			}, 100);

		}

		var gameRunning = true;

		this.move();

	}


	// Food constructor
	var Food = function(pos) {
		this.position = pos;

		this.generateFood = function() {
			this.position = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];
			while (snake1.checkOverlap(this.position) || placedItems.indexOf(this.position)!==-1) {  // To avoid placing food on top of snakes
				this.position = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];
			}
			board.rows[this.position[1]].cells[this.position[0]].style.background = "red"; // Display food
		}
	}


	function removeElement(pos) {
		index = placedItems.indexOf(pos);
		if (index > -1) {
		    placedItems.splice(index, 1);
		}
	}


	function startGame() {
		placedItems = [];

		food1 = new Food([10,15]);
		food2 = new Food([30,30]);

		placedItems.push([10,15]);
		placedItems.push([10,15]);

		board.rows[15].cells[10].style.background = "red";
		board.rows[30].cells[30].style.background = "red";

		snake1 = new Snake([5,20]);
	}

	

	//var newGame = new Game([5,20]);


})

