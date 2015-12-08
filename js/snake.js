$(document).ready(function() {
	
	//Create board
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

	var loaded = false;

	$("#startbutton").click(function(e){
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

	$("#restartbutton").click(function(e){
		$("#time").html('2:00');
		$("#endscreen").css("visibility","hidden");
		$("td").removeClass();
		startGame();
	});


	$("#menubutton").click(function(e){
		$("#endscreen").css("visibility","hidden");
		$("#topbar").css("visibility","hidden");
		$("td").removeClass();
		$("#startscreen").css("visibility","visible");
	});


	var container = document.getElementById("screen");
	container.appendChild(table);

	var board = document.getElementById("board");

	var screenBox = document.getElementById("screen");

	var width = board.offsetWidth;
	var height = board.offsetHeight;
	$("#boardcontainer").css("max-width",width + 80);

	
	$("#screen").css("max-width",width+60);
	$("#screen").css("height",height+60);

	$("#topbar").css("width",width+60);

	var screenWidth = screenBox.offsetWidth;
	var screenHeight = screenBox.offsetHeight;

	// Board dimensions
	var rows = board.rows.length;
	var columns = board.rows[0].cells.length;


	var gameRunning = false;
	var winner;

	var timeUp = false;

	var timerInterval;

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
				if (snake1.score>snake2.score) {
					winner = "1";
				} else if (snake1.score<snake2.score) {
					winner = "2";
				} else {
					winner = "draw";
				}
				clearInterval(timerInterval);
				displayEndScreen();
			}
		}, 1000);
	}


	function displayEndScreen() {
		if (winner==="none") {
			$("#winner").html("No winner");
		} else if (winner==="draw") {
			$("#winner").html("Draw")
		} else {
			$("#winner").html("Player " + winner + " wins");
		}
		$("#endscreen").css("visibility","visible");
	}


	var Snake = function(start,player) {
		
		this.currX = start[0];
		this.currY = start[1];

		this.loopTime = 100;

		this.score = 0;

		this.snakeCSS;

		this.player = player;

		this.currentPowerup;

		this.powerup1Active = false;
		this.powerup2Active = false;
		this.powerupTimer = 0;

		this.invincible = false;

		this.losingMove = false;

		this.snakeLength = 8;
		this.snakeBody = [[this.currX,this.currY]]
		this.moves = ["down"];
		this.oldDirection = "down";

		
		if (player==="1") {
			var opponent = "2";
			this.snakeCSS = "snake1";
			for (i=this.snakeLength-2;i>=0;i--) {  // Build snake
				this.snakeBody.push([3,i+5]);
			}
		} else {
			var opponent = "1";
			this.snakeCSS = "snake2";
			for (i=this.snakeLength-2;i>=0;i--) {  // Build snake
				this.snakeBody.push([27,i+5]);
			}
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
			//var powerUpPos = powerUpTest.position.toString();
			this.snakeBody.unshift([this.currX,this.currY]);
			if (currentPos===foodPos1) {  // When snake passes over food
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
			} else if (currentPos===powerupPos1 && !this.powerup1Active) {  // what about powerup1 then powerup1 again
				if (this.powerup2Active) {
					powerup2.deactivatePowerup(this);
					this.powerupTime = 0;
				}
				$(posToId(powerup1.position)).toggleClass(powerup1.powerType);
				powerup1.activatePowerup(this);
				removeFromBoard(powerup1.position);
				this.currentPowerup = powerup1;
				this.powerup1Active = true;
				var lastSeg = this.snakeBody.pop(); // make this more DRY
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass(this.snakeCSS); // Remove final segment of snake
				powerup1.position = "";
				setTimeout(function() {
					powerup1.generatePowerup()
				},10000);
			} else if (currentPos===powerupPos2 && !this.powerup2Active) {
				if (this.powerup1Active) {
					powerup1.deactivatePowerup(this);
					this.powerupTimer = 0;
				}
				$(posToId(powerup2.position)).toggleClass(powerup2.powerType);
				powerup2.activatePowerup(this);
				removeFromBoard(powerup2.position);
				this.currentPowerup = powerup2;
				this.powerup2Active = true;
				var lastSeg = this.snakeBody.pop();
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass(this.snakeCSS); // Remove final segment of snake
				powerup2.position = "";
				setTimeout(function() {
					powerup2.generatePowerup();
				},10000);
			} else {
				var lastSeg = this.snakeBody.pop(); // make this more DRY
				$(posToId([lastSeg[0],lastSeg[1]])).toggleClass(this.snakeCSS); // Remove final segment of snake
			}
			$(posToId([nextX,nextY])).toggleClass(this.snakeCSS); // Display new position of head of snake
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


		// Checks if position is already occupied by snake MOVE TO GLOBAL SCOPE???
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
					setTimeout(function() {
						if (snake1.losingMove && snake2.losingMove) {
							clearInterval(timerInterval);
							console.log("No winner");
							winner = "none";
							gameRunning = false;
							displayEndScreen();
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
						self.currentPowerup.deactivatePowerup(self);
						self.powerupTimer = 0;
					}
					self.powerupTimer += self.loopTime;
				}

				if (gameRunning===true && player!=="2") { // for testing purposes
					self.move();
				}
			}, self.loopTime);

		}

		gameRunning = true;

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


		this.rand = function(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		this.generateWeighedList = function(list, weight) {
			var weighed_list = [];

		  // Loop over weights
		  for (var i = 0; i < weight.length; i++) {
		  	var multiples = weight[i] * 100;

		    // Loop over the list of items
		    for (var j = 0; j < multiples; j++) {
		    	weighed_list.push(list[i]);
		    }
		  }
		  return weighed_list;
		};
		 
		var types = ["speed","invincible","shrink"];
		var weight = [0.3, 0.3, 0.4];  // [0.45, 0.45, 0.1];
		var weighedList = this.generateWeighedList(types, weight);

		this.generatePowerup = function() {
			if (gameRunning===true) {
				//var rand = types[((Math.random() * (2 - 0 + 1) ) << 0)];
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
					snake.loopTime -= 50;
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
						$(posToId(snake.snakeBody[i])).removeClass(snake.snakeCSS)
						$(posToId(snake.snakeBody[i])).toggleClass("invincibleSnake");
					}
					$(posToId(snake.snakeBody[0])).toggleClass("invincibleSnake");
					snake.snakeCSS = "invincibleSnake";
			}
		}

		this.deactivatePowerup = function(snake) {
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
					snake.snakeCSS = regularCSS;

			}
		}
	}


	function generatePosition() {
		var pos = [(Math.floor(Math.random() * (columns-2-1+1)) + 1),(Math.floor(Math.random() * (rows-2-1+1)) + 1)];
		while (snake1.checkOverlap(pos) || snake2.checkOverlap(pos) || isItemInArray(placedItems,pos)) {  // To avoid placing food on top of snakes
			pos = [(Math.floor(Math.random() * (columns-2-1+1)) + 1),(Math.floor(Math.random() * (rows-2-1+1)) + 1)];
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
	            return true;
	          }
	        }
	    return false;
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

		console.log("started");

		display = document.querySelector('#time');
		startTimer(3, display);

		placedItems = [];

		snake1 = new Snake([3,12],"1");

		snake2 = new Snake([27,12],"2");

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

