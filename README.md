# _Memory Game_
Memory Game is a simple game that helps you refresh your memory while you are enjoy playing.😊

## Installation
To install the game on your device you only need to do these two steps:
1. Clone the repository like this: `git clone https://github.com/aliataf/memory-game.git`
2. Open the index.html and enjoy it.  
**OR** you can play it online [here](https://aliataf.github.io/memory-game)

## How to play?
The rules are very simple..
- When you first open the website, you must enter your name.
- Then you will see in front of you a deck consists of 16 faced down cards.
- On the right of the deck there is the leaderboard that represents the top 3 players globally.
- On the top of the deck there is the playtools that have timer, moves, stars and replay button.
- The game start when you first open a card, the timer starts counting and each one move is two cards opened, so when you open two cards if they were have the same content they will stay faced up and you should guess another couple of matched cards, and if they didn't match they will return to the face down state.
- You should memories the positions of the cards.
- As you continue making moves the number of moves will be rate according the Stars Rating System described bellow.
- Your performance will first be measured according to your number of moves and in the case of tie with a leader from the top 3 players the time taken to end the game will be considered.
- When you finish the game, a congratulations message will pop up to tell you about your score and asks you if you want to play again (still you can click the replay button anytime you would like to play again).
- If you have broken any leader score, you will be in his place, so a message will appear telling you that you will be added to the leaderboard.

## Stars Rating System
There are 3 solid stars at the beginning and for each star there are 3 cases: solid, half-solid and empty.  
The system works as following:

| # STARS   | % PERCENT    | # MOVES  |
| --------- | ------------ | -------- |
| 3 stars   | 100%         | 10 moves |
| 2.5 stars | 83.33333333% | 15 moves |
| 2 stars   | 66.66666667% | 20 moves |
| 1.5 stars | 50%          | 25 moves |
| 1 star    | 33.33333333% | 30 moves |
| 0.5 star  | 16.66666667% | 35 moves |

## For Developers
The game is built using ES6 and if you want to contribute to this repo any pull request is welcomed.  
The leaderboard.json file contains the information about the top 3 players and is stored using firebase storage API. I made the storage directory public so anybody can edit the file manually, but it's not something to worry about because it's just a simple entertainment game.  

**Copy Rights &copy; 2019 Ali Ataf.**
