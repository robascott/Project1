$(document).ready(function() {
	
	var board = document.getElementById("board");

	// Board dimensions
	var rows = board.rows.length;
	var columns = board.rows[0].cells.length;


	function Snake(start) {
		
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
		this.updateSegments = function(X,Y) {
			var currentPos = [X,Y].toString();
			var foodPos = foodPosition.toString();
			this.snakeBody.unshift([X,Y]);
			if (currentPos===foodPos) {  // Snake eats food
				foodPosition = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];
				
				while (this.snakeBody.indexOf(foodPosition)!==-1) {  // To avoid placing food on top of snakes
					foodPosition = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];
				}

				board.rows[foodPosition[1]].cells[foodPosition[0]].style.background = "red";
			} else {
				var lastSeg = this.snakeBody.pop();
				board.rows[lastSeg[1]].cells[lastSeg[0]].style.background = "#FFFFCC";
			}
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


		// Move head of snake
		this.move = function() {
			setTimeout(function(){

				var newDirection = self.getNextMove();
				var nextCell = self.getNextCell(newDirection);

				if (self.isValid(nextCell)) {
					self.oldDirection = newDirection;
					
					var nextX = nextCell[0];
					var nextY = nextCell[1];

					self.updateSegments(self.currX,self.currY);

					board.rows[nextY].cells[nextX].style.background = "black";

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

		var foodPosition = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];

		board.rows[foodPosition[1]].cells[foodPosition[0]].style.background = "red";

		this.move();

	}


	function Game(start) {
		var snake = new Snake(start);
	}


	var newGame = new Game([5,20]);

})

