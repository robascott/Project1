$(document).ready(function() {
	
	var board = document.getElementById("board");

	var rows = board.rows.length;
	var columns = board.rows[0].cells.length;

	
	function Snake(start) {
		
		this.currX = start[0];
		this.currY = start[1];

		this.snakeLength = 5;

		var oldDirection = "right";

		this.moves = ["right"];

		var direction = "right";

		this.snakeBody = [[this.currX,this.currY],[9,10],[8,10],[7,10],[6,10]];


		for (i=0; i<this.snakeLength; i++) {
			var segment = this.snakeBody[i];
			board.rows[segment[1]].cells[segment[0]].style.background = "black";
		}


		var self = this;

		$(window).keydown(function(e) {
			console.log(self.moves.length);
			console.log(self.moves);
			currDir = null;
			if (self.moves.length===0) {
				currDir = oldDirection;
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


		/*$(window).keydown(function(e) {
			if (e.keyCode===87) {
				if (oldDirection!=="down") {
					direction = "up";
				}
			} else if (e.keyCode===83) {
				if (oldDirection!=="up") {
					direction = "down";
				}
			} else if (e.keyCode===68) {
				if (oldDirection!=="left") {
					direction = "right";
				}
			} else if (e.keyCode===65) {
				if (oldDirection!=="right") {
					direction = "left";
				}
			}
		});*/


		this.updateSegments = function(X,Y) {
			var currentPos = [X,Y].toString();
			var foodPos = foodPosition.toString();
			this.snakeBody.unshift([X,Y]);
			if (currentPos===foodPos) {
				console.log("Snake length: " + this.snakeLength);
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


		this.getNextMove = function() {
			if (this.moves.length===0) {
				return oldDirection;
			} else {
				return this.moves.pop();
			}
		}


		this.nextCell = function(dir) {
			switch (dir) {
				case "up":
					this.currY -= 1;
					this.updateSegments(this.currX,this.currY);
					return [this.currX,this.currY];
					break;
				case "down":
					this.currY += 1;
					this.updateSegments(this.currX,this.currY);
					return [this.currX,this.currY];
					break;
				case "right":
					this.currX += 1;
					this.updateSegments(this.currX,this.currY);
					return [this.currX,this.currY];
					break;
				case "left":
					this.currX -= 1;
					this.updateSegments(this.currX,this.currY);
					return [this.currX,this.currY];
			}
		}


		this.move = function() {
			//self = this;
			setTimeout(function(){


				var newDirection = self.getNextMove();
				var nextMove = self.nextCell(newDirection);

				oldDirection = newDirection;
				
				var nextX = nextMove[0];
				var nextY = nextMove[1];

				board.rows[nextY].cells[nextX].style.background = "black";



				if (gameRunning===true) {
					self.move();
				}
			}, 100);

		}

		var gameRunning = true;


		
		var foodPosition = [(Math.floor(Math.random() * columns)),(Math.floor(Math.random() * rows))];

		//console.log("food:");
		//console.log(foodPosition);

		board.rows[foodPosition[1]].cells[foodPosition[0]].style.background = "red";

		this.move();



	}


	function Game(start) {
		var snake = new Snake(start);

	}


	var newGame = new Game([10,10]);



})

