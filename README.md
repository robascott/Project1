# Xtreme Snake

## GA WDI London: Project 1

### Technologies

* HTML
* CSS
* JavaScript
* jQuery

## Resources

Google fonts
* Ocra Extended
* Orbitron
* Play

Icons from Flaticon

### Outline

For this project I made a 2 player version of the classic Nokia mobile game "Snake". Two players battle it out on the same board to get the highest score before the timer runs out.

### Approach

The game was written in Javscript. The only plugin I used was jQuery.

The board is respresented by an HTML table that functions a grid.

Apples and power-ups are randomly generated.

### Functionality

Players control their snake using the keyboard. Players increase their score by running into apples.
The player with the highest score when the timer runs out is the winner. If a player collides with a wall or snake, his opponent wins

There are three power-ups. The lightning power-up gives the players a temporary speed boost. The shield power-up allows the player to cross his own snake. The shrink power-up reduces the length of the player's snake by half.

### Future Plans

* Implement a high score
* Add music and sound effects
* Add option to change the game duration
* Change the item generator function so that items don't bunch up on the board
* Add a "survival" mode (no timer)
