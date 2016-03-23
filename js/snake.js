$(document).ready(function() {
	
	// Create board
	var table = document.createElement("TABLE");
	table.id = "board";
	
	var columnCount = 50;
	var rowCount = 30;
	for (var i = 0; i < rowCount; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < columnCount; j++) {
			var cell = row.insertCell(-1);
			cell.id = j.toString() + "-" + i.toString();
		}
	}

	var container = document.getElementById("screen");
	container.appendChild(table);

	var board = document.getElementById("board");

	var width = board.offsetWidth;
	var height = board.offsetHeight;
	
	$("#boardcontainer").css("width",width+80);
	$("#screen").css("width",width+60);
	$("#screen").css("height",height+60);
	$("#topbar").css("width",width+60);


	// Board dimensions
	var rows = board.rows.length;
	var columns = board.rows[0].cells.length;

	
	// Global variables
	var winner;
	var mode;
	var timerInterval;

	var gameRunning = false;
	var loaded = false;
	var timeUp = false;
	var endScreenShown = false;


	// Event listeners

	$("#howtobutton").click(function(e){
		$("#startscreen").css("visibility","hidden");
		$("#howto").css("visibility","visible");
	});

	$("#backbutton").click(function(e){
		$("#howto").css("visibility","hidden");
		$("#startscreen").css("visibility","visible");
	});

	$("#startbutton2").click(function(e){
		mode = "two";
		$("#time").html('2:00');
		$("#topbar").css("visibility","visible");
		if (loaded) {
			startGame();
		} else {
			$("#board").waitUntilExists(startGame);
		}
		$("#startscreen").css("visibility","hidden");
		loaded = true;
	});

	$("#startbutton1").click(function(e){
		mode = "single";
		$("#time").html('2:00');
		$("#p2scorebox").css("visibility","hidden");
		$("#topbar").css("visibility","visible");
		if (loaded) {
			startGame();
		} else {
			$("#board").waitUntilExists(startGame);
		}
		$("#startscreen").css("visibility","hidden");
		loaded = true;
	});

	$("#restartbutton").click(function(e){
		snake1 = null;
		snake2 = null
		food1 = null;
		food2 = null;
		powerup1 = null;
		powerup2 = null;
		endScreenShown = false;
		$("#board").removeClass();
		$('#p1scoreno').html("0");
		$('#p2scoreno').html("0");
		$("#time").html('2:00');
		$("#endscreen").css("visibility","hidden");
		$("td").removeClass();
		startGame();
	});

	$("#menubutton").click(function(e){
		snake1 = null;
		snake2 = null
		food1 = null;
		food2 = null;
		powerup1 = null;
		powerup2 = null;
		endScreenShown = false;
		$("#board").removeClass();
		$("#p2scorebox").css("visibility","");
		$('#p1scoreno').html("0");
		$('#p2scoreno').html("0");
		$("#endscreen").css("visibility","hidden");
		$("#topbar").css("visibility","hidden");
		$("td").removeClass();
		$("#startscreen").css("visibility","visible");
		timeUp = false;
	});


	function startTimer(duration, display) {
		var timer = duration, minutes, seconds;
		timerInterval = setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.textContent = minutes + ":" + seconds;

			if (--timer < 0) {
				gameRunning = false;
				timeUp = true;
				if (mode==="two") {
					if (snake1.score>snake2.score) {
						winner = "1";
					} else if (snake1.score<snake2.score) {
						winner = "2";
					} else {
						winner = "draw";
					}
				}
				clearInterval(timerInterval);
				displayEndScreen();
			}
		}, 1000);
	}


	function displayEndScreen() {
		if (mode==="single") {
			$("#winner").html("Score: " + snake1.score);
		} else {
			if (winner==="none") {
				$("#winner").html("No winner");
			} else if (winner==="draw") {
				$("#winner").html("Draw")
			} else {
				$("#winner").html("Player " + winner + " wins");
			}
		}
		$('#endscreen').css('visibility','visible').hide().fadeIn(1400);
	}


	// Snake object
	var Snake = function(start,player) {
		
		this.currX = start[0];
		this.currY = start[1];

		this.snakeLength = 8;
		this.snakeBody = [[this.currX,this.currY]]

		this.player = player;
		this.score = 0;

		this.loopTime = 100;
		this.powerupTimer = 0;
		this.snakeCSS;

		this.currentPowerup;
		this.powerup1Active = false;
		this.powerup2Active = false;

		this.invincible = false;
		this.losingMove = false;
		
		this.moves = ["down"]; 
		this.oldDirection = "down";
		
		if (player==="1") {
			var opponent = "2";
			this.snakeCSS = "snake1";
		} else {
			var opponent = "1";
			this.snakeCSS = "snake2";
		}
		for (i=this.currY-1; i>this.currY-this.snakeLength;i--) {  // Build snake
			this.snakeBody.push([this.currX,i]);
		}

		for (i=0; i<this.snakeLength; i++) {  // Colour snake
			var segment = this.snakeBody[i];
			$(posToId([segment[0],segment[1]])).toggleClass(this.snakeCSS);
		}

		var self = this;

		if (player==="1") {
			// Keypress event listeners
			$(window).keydown(function(e) {
				var currDir = null;
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
		} else {
			$(window).keydown(function(e) {
				var currDir = null;
				if (self.moves.length===0) {
					currDir = self.oldDirection;
				}
				if (e.keyCode===73) {  // I key
					if (self.moves[0]!=="down" && self.moves[0]!=="up" && currDir!=="down") {
						self.moves.unshift("up");
					}
				} else if (e.keyCode===75) {  // K key
					if (self.moves[0]!=="up" && self.moves[0]!=="down" && currDir!=="up") {
						self.moves.unshift("down");
					}
				} else if (e.keyCode===76) {  // L key
					if (self.moves[0]!=="left" && self.moves[0]!=="right" && currDir!=="left") {
						self.moves.unshift("right");
					}
				} else if (e.keyCode===74) {  // J key
					if (self.moves[0]!=="right" && self.moves[0]!=="left" && currDir!=="right") {
						self.moves.unshift("left");
					}
				}
			});
		}


		// Update score
		this.updateScore = function() {
			if (player==="1") {
				$('#p1scoreno').html(this.score);
			} else {
				$('#p2scoreno').html(this.score);
			}
		}


		// Move snake's position on board
		this.updateSegments = function(nextX,nextY) {
			var currentPos = [this.currX,this.currY].toString();
			var foodPos1 = food1.position.toString();
			var foodPos2 = food2.position.toString();
			var powerupPos1 = powerup1.position.toString();
			var powerupPos2 = powerup2.position.toString();
			this.snakeBody.unshift([this.currX,this.currY]);
			if (currentPos===foodPos1) {
				$(posToId(food1.position)).toggleClass("food");
				removeFromBoard(food1.position);
				food1.generateFood();
				this.score += 10;
				this.updateScore();
				this.snakeLength++;
			} else if (currentPos===foodPos2) {
				$(posToId(food2.position)).toggleClass("food");
				removeFromBoard(food2.position);
				food2.generateFood();
				this.score += 10;
				this.updateScore();
				this.snakeLength++;
			} else if (currentPos===powerupPos1) {
				if (this.powerup2Active) {
					if (powerup1.powerType!=="shrink") {
						powerup2.deactivatePowerup(this,false);
						this.powerup2Active = false;
						this.powerupTimer = 0;
					}
				}
				if (powerup1.powerType!=="shrink") {
					this.currentPowerup = powerup1;
					this.powerup1Active = true;
				}
				$(posToId(powerup1.position)).toggleClass(powerup1.powerType);
				powerup1.activatePowerup(this);
				removeFromBoard(powerup1.position);
				var lastSeg = this.snakeBody.pop();
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass(this.snakeCSS); // Remove final segment of snake
				powerup1.position = "";
				setTimeout(function() {
					powerup1.generatePowerup()
				},10000);
			} else if (currentPos===powerupPos2) {
				if (this.powerup1Active) {
					if (powerup2.powerType!=="shrink") {
						powerup1.deactivatePowerup(this,false);
						this.powerup1Active = false;
						this.powerupTimer = 0;
					}
				}
				if (powerup2.powerType!=="shrink") {
					this.currentPowerup = powerup2;
					this.powerup2Active = true;
				}
				$(posToId(powerup2.position)).toggleClass(powerup2.powerType);
				powerup2.activatePowerup(this);
				removeFromBoard(powerup2.position);
				var lastSeg = this.snakeBody.pop();
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass(this.snakeCSS); // Remove final segment of snake
				powerup2.position = "";
				setTimeout(function() {
					powerup2.generatePowerup();
				},10000);
			} else {
				var lastSeg = this.snakeBody.pop();
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass(this.snakeCSS); // Remove final segment of snake
			}
			$(posToId([nextX,nextY])).toggleClass(this.snakeCSS); // Display new position of head of snake
		}


		// Returns snake's next direction
		this.getNextMove = function() {
			if (this.moves.length===0) {
				return this.oldDirection;
			} else {
				return this.moves.pop();
			}
		}


		// Returns next position of snake head
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
			winner = opponent;
			this.losingMove = true;
			gameRunning = false;
		}

		
		// Checks if snake has collided with itself or other snake
		this.checkTailCollision = function(cell) {
			if (this.invincible) {
				return false;
			}
			var myBody = this.snakeBody.slice(0, -1);
			if (player==="1") {
				var otherBody = snake2.snakeBody.slice(0, -1);
			} else {
				var otherBody = snake1.snakeBody.slice(0, -1);
			}
			for (var i=0; i<myBody.length; i++) {
				if (myBody[i][0] == cell[0] && myBody[i][1] == cell[1]) {
					return true;
				}
			}
			for (var i=0; i<otherBody.length; i++) {
				if (otherBody[i][0] == cell[0] && otherBody[i][1] == cell[1]) {
					return true;
				}
			}
			return false;
		}


		// Checks if position is already occupied by snake
		this.checkOverlap = function(pos) {
			var isOverlap = false;
			for (var i = 0; i < snake1.snakeBody.length; i++) {
				if (snake1.snakeBody[i][0] == pos[0] && snake1.snakeBody[i][1] == pos[1]) {
					return true;
				}
			}
			for (var i = 0; i < snake2.snakeBody.length; i++) {
				if (snake2.snakeBody[i][0] == pos[0] && snake2.snakeBody[i][1] == pos[1]) {
					return true;
				}
			}
			return isOverlap;
		}

		var counter = 2; // for flashing snake

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

				} else {
					$(posToId(self.snakeBody[0])).removeClass();
					$(posToId(self.snakeBody[0])).addClass("crash"); // Show collision
					$("#board").addClass('board-gameover');
					setTimeout(function() {
						if (snake1.losingMove && snake2.losingMove) {
							clearInterval(timerInterval);
							console.log("No winner");
							winner = "none";
							gameRunning = false;
							if (endScreenShown!==true) {
								displayEndScreen();
								endScreenShown = true;
							}
						} else {
							clearInterval(timerInterval);
							console.log("Game over");
							console.log("Player " + winner + " wins!");
							gameRunning = false;
							displayEndScreen();
						}
					},100)
				}


				if (self.powerup1Active || self.powerup2Active) {
					if (self.currentPowerup.powerType==="invincible") {
						if (self.powerupTimer>=4000 && self.powerupTimer<6000) {
							if (counter%2==0) {
								for (i=0; i<self.snakeBody.length; i++) {
									$(posToId(self.snakeBody[i])).removeClass("invincibleSnake");
								}
								for (i=0; i<self.snakeBody.length; i++) {
									$(posToId(self.snakeBody[i])).addClass("snake" + self.player);
								}
								self.snakeCSS = "snake" + self.player;
							} else {
								for (i=0; i<self.snakeBody.length; i++) {
									$(posToId(self.snakeBody[i])).removeClass("snake" + self.player);
								}
								for (i=0; i<self.snakeBody.length; i++) {
									$(posToId(self.snakeBody[i])).addClass("invincibleSnake");
								}
								self.snakeCSS = "invincibleSnake";
							}
							counter++;
						}
					}

					if (self.powerupTimer>=6000) {
						self.powerup1Active = false;
						self.powerup2Active = false;
						self.currentPowerup.deactivatePowerup(self,true);
						self.powerupTimer = 0;
					}
					self.powerupTimer += self.loopTime;
				}

				if (gameRunning===true) { // for testing purposes
					self.move();
				}
		
			}, self.loopTime);

		}

		gameRunning = true;

		if (mode==="single" && this.player==="2") {
			// do nothing
		} else {
			this.move();
		}

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


	// Power-up constructor
	var Powerup = function(snake) {
		this.position;
		this.powerType;

		this.rand = function(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		this.generateWeighedList = function(list, weight) {
			var weighed_list = [];

		  for (var i = 0; i < weight.length; i++) {
		  	var multiples = weight[i] * 100;

		    for (var j = 0; j < multiples; j++) {
		    	weighed_list.push(list[i]);
		    }
		  }
		  return weighed_list;
		};
		 
		var types = ["speed","invincible","shrink"];
		var weight = [0.33, 0.33, 0.33];
		var weighedList = this.generateWeighedList(types, weight);

		this.generatePowerup = function() {
			if (gameRunning===true) {
				var randomNum = this.rand(0, weighedList.length-1);
				var rand = weighedList[randomNum]
				this.powerType = rand;
				this.position = generatePosition();
				$(posToId([this.position[0],this.position[1]])).toggleClass(rand);
				placedItems.push(this.position);
			}
		}

		this.activatePowerup = function(snake) {
			switch (this.powerType) {
				case "speed":
					snake.loopTime -= 45;
					break;
				case "shrink":
					if (snake.snakeLength > 4) {
						var reducedLength = Math.floor(snake.snakeLength/2);
						for (i=0; i<reducedLength; i++) {
							var lastSeg = snake.snakeBody.pop();
							$(posToId([lastSeg[0],lastSeg[1]])).removeClass();
							snake.snakeLength--;
						}
					}
					break;
				case "invincible":
					snake.invincible = true;
					for (i=0; i<snake.snakeBody.length; i++) {
						$(posToId(snake.snakeBody[i])).removeClass(snake.snakeCSS);
						$(posToId(snake.snakeBody[i])).toggleClass("invincibleSnake");
					}
					$(posToId(snake.snakeBody[0])).toggleClass("invincibleSnake");
					snake.snakeCSS = "invincibleSnake";
			}
		}

		this.deactivatePowerup = function(snake,timeoutFlag) {
			switch (this.powerType) {
				case "speed":
					snake.loopTime = 100;
					break;
				case "shrink":
					// nothing to do
					break;
				case "invincible":
					snake.invincible = false;
					if (snake.player==="1") {
						regularCSS = "snake1";
					} else {
						regularCSS = "snake2";
					}
					for (i=0; i<snake.snakeBody.length; i++) {
						$(posToId(snake.snakeBody[i])).removeClass(snake.snakeCSS)
						$(posToId(snake.snakeBody[i])).addClass(regularCSS);
					}
					if (timeoutFlag===false) {
						$(posToId(snake.snakeBody[0])).toggleClass(regularCSS);
					}
					snake.snakeCSS = regularCSS;

			}
		}
	}


	// Generates a random position on the board that isn't already occupied by an object
	function generatePosition() {
		var pos = [(Math.floor(Math.random() * (columns-2-1+1)) + 1),(Math.floor(Math.random() * (rows-2-1+1)) + 1)];
		while (snake1.checkOverlap(pos) || snake2.checkOverlap(pos) || isItemInArray(placedItems,pos)) {  // To avoid placing food on top of snakes
			pos = [(Math.floor(Math.random() * (columns-2-1+1)) + 1),(Math.floor(Math.random() * (rows-2-1+1)) + 1)];
		}
		return pos;
	}

	// Converts a coordinate into a CSS ID
	function posToId(pos) {
		return "#" + pos[0] + "-" + pos[1];
	}


	function isItemInArray(array, item) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][0] == item[0] && array[i][1] == item[1]) {
	            return true;
	          }
	        }
	    return false;
	  }

	// Finds the index of an item in a 2-dimensional array
	function findIndex(array,item) {
		for (var i = 0; i < array.length; i++) {
		    if (array[i][0] == item[0] && array[i][1] == item[1]) {
		        return i;
		    }
		}
		console.log("Error: not found");
	}

	// Removes food or power-up from placedItems array
	function removeFromBoard(pos) {
		index = findIndex(placedItems,pos);
		if (index > -1) {
		    placedItems.splice(index, 1);
		}
	}


	// Set up snakes, food and power-ups
	function startGame() {

		display = document.querySelector('#time');
		startTimer(119, display); // Set timer

		placedItems = [];

		snake1 = new Snake([4,10],"1");
		if (mode==="two") {
			snake2 = new Snake([45,10],"2");
		} else {
			snake2 = new Snake([-1,-1],"2");
		}
		
		food1 = new Food();
		food2 = new Food();

		food1.generateFood();
		food2.generateFood();

		powerup1 = new Powerup();
		powerup2 = new Powerup();
		powerup1.generatePowerup();
		powerup2.generatePowerup();

	}

})
