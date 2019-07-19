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
            
            // Here render the leaderboard on the screen
            console.log(leaderboard); // Only for testing
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
