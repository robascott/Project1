# Xtreme Snake

A 2-player version of the classic game [Snake](https://en.wikipedia.org/wiki/Snake_(video_game)), written in JavaScript.

You can play it [here](http://www.robins.me/Snake).

<img src="img/screenshot.png" width="600px"></img>

## Functionality

Players control their snake with the keyboard. The aim is to accumulate as many points as possible (by eating apples) before the timer runs out. In 2-player mode, colliding with a wall or snake results in a victory for the opposing player.

There are three power-ups. Lightning gives the player a temporary speed boost. The shield allows the player to pass over his or her own snake for a limited amount of time. Scissors reduce the length of the player's snake.

## Technologies and Resources

* HTML
* CSS
* JavaScript
* jQuery
* Icons from [Flaticon](http://www.flaticon.com/)
* Fonts:
  * OCR-A Extended
  * Orbitron
  * Play


## Approach

The game uses no external libraries besides jQuery.

The board is represented by an HTML table. CSS classes are applied to specific cells to display the snakes and other items. The `setTimeout()` method is used to update the game state (move the snakes, check for collisions etc.) at set intervals.

Apples and power-ups are randomly generated.


## Future improvements

* Leaderboard
* Sound effects
* Difficulty selection
* "Survival" mode (no timer)
* Stop items from spawning too close to each other
