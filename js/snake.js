$(document).ready(function() {
	
	var board = document.getElementById("board");

	var rows = board.rows.length;
	var columns = board.rows[0].cells.length;


	
	function Snake(start) {
		
		this.currX = start[0];
		this.currY = start[1];

		this.snakeLength = 5;


		//this.direction = "right"; doesn't work

		var direction = "right"

		this.snakeBody = [[this.currX,this.currY],[9,10],[8,10],[7,10],[6,10]];


		for (i=0; i<this.snakeLength; i++) {
			var segment = this.snakeBody[i];
			board.rows[segment[1]].cells[segment[0]].style.background = "black";
		}


		$(window).keydown(function(e) {
			if (e.keyCode===87) {
				if (direction!=="down") {
					direction = "up";
				}
			} else if (e.keyCode===83) {
				if (direction!=="up") {
					direction = "down";
				}
			} else if (e.keyCode===68) {
				if (direction!=="left") {
					direction = "right";
				}
			} else if (e.keyCode===65) {
				if (direction!=="right") {
					direction = "left";
				}
			}
		});


		this.updateSegments = function(X,Y) {
			this.snakeBody.unshift([X,Y]);
			var lastSeg = this.snakeBody.pop();
			board.rows[lastSeg[1]].cells[lastSeg[0]].style.background = "#FFFFCC";
			//console.log(this.snakeBody);
		}


		this.nextCell = function() {
			switch (direction) {
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
			self = this;
			setTimeout(function(){

				//console.log(self);

				var nextMove = self.nextCell();
				
				var nextX = nextMove[0];
				var nextY = nextMove[1];

				//console.log(nextX,nextY);

				board.rows[nextY].cells[nextX].style.background = "black";


				if (gameRunning===true) {
					self.move();
				}
			}, 100);

		}

		var gameRunning = true;


		//console.log(this);

		this.move();



	}




	function Game(start) {
		var snake = new Snake(start);

	}


	var newGame = new Game([10,10]);



})

