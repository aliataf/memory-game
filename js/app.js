/* * * * * * * * * * * * * * * * * * * * * * * * * *\
 *                                                 *
 *   Memory Game                                   *
 *  +++++++++++++                                  *
 *                                                 *
 * Author: Ali Ataf                                *
 *                                                 *
 * Version: 1.0                                    *
 *                                                 *
 * Leaderboard.json is stored using firebase       *
 *                                                 *
 * New code section is separated with 5 new lines  *
 *                                                 *
\* * * * * * * * * * * * * * * * * * * * * * * * * */





// Setting up Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyAjDNRCGH7euu3Db8QdETB49Z4ZrnHq0bM",
    authDomain: "memory-game-7f271.firebaseapp.com",
    databaseURL: "https://memory-game-7f271.firebaseio.com",
    projectId: "memory-game-7f271",
    storageBucket: "gs://memory-game-7f271.appspot.com/",
    messagingSenderId: "569617056194",
    appId: "1:569617056194:web:570480d584535de4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/* Get a reference to the storage service, which is used to
   create references in my storage bucket */
let storage = firebase.storage();

// Create a storage reference from the storage service
let storageRef = storage.ref();

// Create a reference to the leaderboard.json file on the cloud
let leaderboardFile = storageRef.child('leaderboard.json');

/* Create the leaderboard variable that will hold
the leaderboard.json value */
let leaderboard;

/**
* @description Download the leaderboard.json
* @returns void
*/
function download() {
    // getDownloadURL returns a promise
    leaderboardFile.getDownloadURL().then(function(url) {
        let xhr = new XMLHttpRequest(); //Initializing the HTTPRequest

        xhr.onload = function() { // When the request is recieved
            let JSONString = xhr.response; // Returns a JSON string

            /* Parse the JSONString to an object and store it
            in leaderboard */
            leaderboard = JSON.parse(JSONString);

            // Render the content of leaderboard.json to the leaderboard section
            let leadername = document.getElementsByClassName('leader_name');
            let leadertime = document.getElementsByClassName('leader_time');
            let leadermoves = document.getElementsByClassName('leader_moves');
            let leaderstars = document.getElementsByClassName('leader_stars');
            for (let i = 0; i < 3; i++) {
                leadername[i].textContent = leaderboard.leaders[i].name;
                leadertime[i].textContent = leaderboard.leaders[i].time;
                leadermoves[i].textContent = leaderboard.leaders[i].moves;
                leaderstars[i * 3].setAttribute('class', leaderboard.leaders[i].stars[0]);
                leaderstars[i * 3 + 1].setAttribute('class', leaderboard.leaders[i].stars[1]);
                leaderstars[i * 3 + 2].setAttribute('class', leaderboard.leaders[i].stars[2]);
            }
        };

        // Prepare the request and send it
        xhr.open('GET', url);
        xhr.send();
    });
}

/**
* @description Upload the leaderboard as JSON file to firebase storage
* @returns void
*/
function upload() {
    // Transfer the object to a JSON string using JSON.stringify
    let JSONFile = new Blob(
        [JSON.stringify(leaderboard, null, 4)],
        {type: 'application/json'}
    );

    // Put (upload) the .json file
    leaderboardFile.put(JSONFile);
}

// Now call download function
download();




/*                                      *\
 * Adding the functionality to the game *
\*                                      */
// Store the 8 cards wich they are Font Awesome classes in an array
let cardsArray = ['fa-flask', 'fa-graduation-cap', 'fa-horse', 'fa-infinity',
                  'fa-football-ball', 'fa-medal', 'fa-rocket', 'fa-anchor'];

let timeInterval = 0;

// This shuffle function was taken from Stackoverflow.com and used to shuffle an array
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
}

// Assign the classes in cardsArray to the cards elements
let cards = document.getElementsByClassName('card');

// deck variable will represent the deck that will be used to control the cards
let deck = document.querySelector('.workspace__deck');
// firstObject is the first card clicked, lastObject is the second one
// numGoodMoves will increase by 2 for each good move so when it becomes 16 the player win
let firstObject = null, lastObject = null, numGoodMoves = 0;
// numMoves variable is the element with the class "moves"
// that represent the number of moves maked by the player
let numMoves = document.querySelector('.moves');
// stars is like an array that have three elements (span)
// each span represent a star
let stars = document.getElementsByClassName('stars');
// When (isGameStart == true) start increasing the time
let isGameStart = false;
// minutes and seconds variables store the time of playing
let minutes = 0, seconds = 0;
// timer variable represents the element with class "timer"
let timer = document.querySelector('.timer');
// Taking advantage of the delegation concept of javascript
// to add one event listener to the whole deck instead of
// adding an event listener for each single card
deck.addEventListener('click', openCard);
// replay variable represents the replay icon
let replay = document.querySelector('.replay');
// Restart the game when click on replay
replay.addEventListener('click', play);

/**
 * @description the openning action when clicking a card
 * @param {object} evt - The card that was clicked
 * @returns void
 */
function openCard(evt) {
    // obj variable stores the target that was clicked
    let obj = evt.target;
    // If no card is face up
    if (firstObject === null) {
        // If the clicked card was not opened before
        if (!obj.classList.contains('open')) {
            // Animate the card and open it
            obj.classList.add('spinAnimation');
            obj.classList.add('open');
            // Show the content of it after 0.6s
            setTimeout(() => obj.classList.add('show'), 600);
            // Store it in firstObject
            firstObject = obj;
            // Check if first click to start the game
            if (isGameStart === false) {
                isGameStart = true;
                timeInterval = setInterval(incTime, 1000);
            }
        }
    }
    // Else if one card is face up
    else if (lastObject === null) {
        // If the second clicked card was not opened before
        if (!obj.classList.contains('open')) {
            // Animate the card and open it
            obj.classList.add('spinAnimation');
            obj.classList.add('open');
            // Show the content of it after 0.6s
            setTimeout(() => obj.classList.add('show'), 600);
            // Store it in lastObject
            lastObject = obj;
            // Now we have two cards opened so we check them to see
            // if they are equal after 1s in order to
            // let the animation finishes first
            setTimeout(() => {
                clearAnimation();
                check();
            }, 1000);
        }
    }
}

/**
 * @description Checking the matching of the two cards
 * @returns void
 */
function check() {
    // Additional check for the two cards opened
    if (firstObject !== null && lastObject !== null) {
        // If they mach
        if (firstObject.firstElementChild.classList.toString() === lastObject.firstElementChild.classList.toString()) {
            goodMove();
        } else {
            badMove();
        }
    }
}

/**
 * @description this function applied when matching
 * @returns void also :)
 */
function goodMove() {
    // Animate the two objects that match
    firstObject.classList.add('danceAnimation');
    lastObject.classList.add('danceAnimation');
    // Remove the animation class after it has done
    setTimeout(() => {
        clearAnimation();
        // Return to the initial state of no cards open
        // but keep the two cards shown (keep the class "show")

        firstObject = null;
        lastObject = null;
        // Increase the numGoodMove by 2
        numGoodMoves += 2;
        // If numGoodMoves is equal to 16 the player wins
        if (numGoodMoves === 16) {
            win();
        }
        // Increase the number of moves
        incMove();
    }, 1100);
}

function badMove() {
    // Animate the two objects that didn't match
    firstObject.classList.add('shakeAnimation');
    lastObject.classList.add('shakeAnimation');
    // Return to the initial state of no cards open and make the cards
    // face down after a little delay of 1.2s to let the animation
    // takes its time and remove the animation class after it has done
    setTimeout(() => {
        clearAnimation();
        firstObject.classList.remove('open');
        lastObject.classList.remove('open');
        firstObject.classList.remove('show');
        lastObject.classList.remove('show');
        firstObject = null;
        lastObject = null;
    }, 1100);
    // Increase the number of moves
    incMove();
}

/**
 * @description Clear the animation classes from the objects
 */
function clearAnimation() {
    if (firstObject !== null ) {
        if (firstObject.classList.contains('spinAnimation')) {
            firstObject.classList.remove('spinAnimation');
        }
        if (firstObject.classList.contains('danceAnimation')) {
            firstObject.classList.remove('danceAnimation');
        }
        if (firstObject.classList.contains('shakeAnimation')) {
            firstObject.classList.remove('shakeAnimation');
        }
    }
    if (lastObject !== null) {
        if (lastObject.classList.contains('spinAnimation')) {
            lastObject.classList.remove('spinAnimation');
        }
        if (lastObject.classList.contains('danceAnimation')) {
            lastObject.classList.remove('danceAnimation');
        }
        if (lastObject.classList.contains('shakeAnimation')) {
            lastObject.classList.remove('shakeAnimation');
        }
    }
}

// incMove() function to increase the numMoves by 1
// and rate it with the star rating system below:
// 3 stars   -------> 100% -----------10 moves
// 2.5 stars -------> 83.33333333% ---15 moves
// 2 stars   -------> 66.66666667% ---20 moves
// 1.5 stars -------> 50% ------------25 moves
// 1 star    -------> 33.33333333% ---30 moves
// 0.5 star  -------> 16.66666667% ---35 moves
// the stars will be displayed using the Font Awesome classes
// fas fa-star represent full black star
// fas fa-star-half-alt represent half full star
// far fa-star represent empty star or star just with the borders
function incMove() {
    let n = Number(numMoves.textContent);
    n += 1;
    numMoves.textContent = n;
    switch (n) {
        case 11: {
            stars[2].classList.remove('fa-star');
            stars[2].classList.add('fa-star-half-alt');
            break;
        }
        case 16: {
            stars[2].classList.remove('fas');
            stars[2].classList.remove('fa-star-half-alt');
            stars[2].classList.add('far');
            stars[2].classList.add('fa-star');
            break;
        }
        case 21: {
            stars[1].classList.remove('fa-star');
            stars[1].classList.add('fa-star-half-alt');
            break;
        }
        case 26: {
            stars[1].classList.remove('fas');
            stars[1].classList.remove('fa-star-half-alt');
            stars[1].classList.add('far');
            stars[1].classList.add('fa-star');
            break;
        }
        case 31: {
            stars[0].classList.remove('fa-star');
            stars[0].classList.add('fa-star-half-alt');
            break;
        }
        case 36: {
            stars[0].classList.remove('fas');
            stars[0].classList.remove('fa-star-half-alt');
            stars[0].classList.add('far');
            stars[0].classList.add('fa-star');
            break;
        }
    }
}

// function to increase the time of the timer and make it in a specific format
function incTime() {
    seconds += 1;
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    timer.textContent = '' + minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
}





/*                     *\
 * Modal functionality *
\*                     */
// modalBackground will represent the div with class "modal-background"
let modalBackground = document.querySelector('.modal-background');
// closeBtn will represent the 'x' sign to close the modal
let closeBtn = document.querySelector('.close');
// playAgainBtn will represent the button with the class "playAgainBtn"
let playAgainBtn = document.querySelector('.playAgainBtn');
// cancelBtn will represent the button with the class "cancelBtn"
let cancelBtn = document.querySelector('.cancelBtn');
// modalMoves will represent the player moves in the modal
let modalMoves = document.querySelector('.modalMoves');
// modalTime will represent the player time in the modal
let modalTime = document.querySelector('.modalTime');
// modalStars will represent the stars in the modal
let modalStars = document.getElementsByClassName('modalStars');
// Close the modal when clicking on the modal background (outside the modal)
modalBackground.addEventListener('click', closeModal);
// Also close the modal when clicking on the close sign or cancel button
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
// This function closes the modal
function closeModal() {
    modalBackground.style.display = 'none';
}

// When clicking on the playAgainBtn replay
playAgainBtn.addEventListener('click', play);





/*                     *\
 * Winning and Playing *
\*                     */

// This function will show the winning modal
function win() {
    // Stopping the timer
    if (timeInterval !== 0) {
        clearInterval(timeInterval);
    }
    setTimeout(() => {
        // Showing the congratulations modal
        modalBackground.style.display = 'block';
        // Set the values in the modal as the player score
        modalMoves.textContent = numMoves.textContent;
        modalTime.textContent = timer.textContent;
        // After getting frustrated using classList because of the hardness
        // of assigning from one element to another className is more
        // useful in my case
        let s1 = stars[0].className; // Returns a string with space separated elements
        let s2 = stars[1].className;
        let s3 = stars[2].className;
        s1 = s1.replace('stars', 'modalStars'); // Replace board "stars" with modal "modalStars"
        s2 = s2.replace('stars', 'modalStars');
        s3 = s3.replace('stars', 'modalStars');
        modalStars[0].className = s1; // Assinging the new classes to the element
        modalStars[1].className = s2;
        modalStars[2].className = s3;
    }, 800);
}

function play() {
    // doubleCardsArray has same elements of cardsArray but doubled
    let doubledCardsArray = [];
    for (let i = 0; i < cardsArray.length; i++) {
        doubledCardsArray.push(cardsArray[i]);
        doubledCardsArray.push(cardsArray[i]);
    }

    // Shuffle the doubleCardsArray
    doubledCardsArray = shuffle(doubledCardsArray);

    // Remove the classes "show" and "open" if they are there
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].parentElement.classList.contains('show')) {
            cards[i].parentElement.classList.remove('show');
        }
        if (cards[i].parentElement.classList.contains('open')) {
            cards[i].parentElement.classList.remove('open');
        }
        cards[i].setAttribute('class', 'card fas open');
    }

    // Render the deck
    for (let i = 0; i < doubledCardsArray.length; i++) {
        cards[i].classList.add(doubledCardsArray[i]);
    }

    // Initialize the game
    if (timeInterval !== 0) {
        clearInterval(timeInterval);
        timeInterval = 0;
    }
    timer.textContent = "00:00";
    numMoves.textContent = "0";
    for (let i = 0; i < 3; i++) {
        stars[i].setAttribute('class', 'fas fa-star stars');
    }

    firstObject = null;
    lastObject = null;
    seconds = 0;
    minutes = 0;
    numGoodMoves = 0;
    isGameStart = false;
    clearAnimation();

    // Hide the modal
    modalBackground.style.display = 'none';
}

play();
