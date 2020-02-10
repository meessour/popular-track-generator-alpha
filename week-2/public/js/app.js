// On load, fetch the token
getToken()

const ARTISTS_NAME_INPUT = document.getElementById("artistNameInput")
const WORD_LIST = document.getElementById("wordList")

ARTISTS_NAME_INPUT.addEventListener("input", function() {
    const INPUT = ARTISTS_NAME_INPUT.value.trim()

    // Check if input is not empty
    if (INPUT && INPUT !== "" && INPUT.length) {
        searchArtistInput(INPUT);
    } else {
        console.log("Input is empty");
    }
});

async function getToken() {
    // Check if localstorage is supported by browser/client. If not, fetch token and don't check localstorage
    if (!typeof(Storage)) return await fetchToken()

    const localAccessToken = localStorage.getItem("token")
    const localTokenExpirationTime = localStorage.getItem("tokenExpirationTime")

    // Taken from https://www.w3schools.com/jsref/jsref_obj_date.asp
    const currentTime = new Date().getTime() / 1000;

    // If the token stored locally is still valid, return it
    if (localAccessToken &&
        localTokenExpirationTime &&
        localTokenExpirationTime >= currentTime) return localAccessToken

    return await fetchToken()
}

async function fetchToken() {
    // The client id and client secret needed for fetching a token
    const CLIENT_ID = "2779f7bf0903431ea612d81a437c691b";
    const CLIENT_SECRET = "a5327f791f414ca1ae6146e2092879aa";

    // Encode the token via base64 
    const ENCODED_TOKEN = window.btoa((CLIENT_ID + ":" + CLIENT_SECRET));

    const URL = "https://accounts.spotify.com/api/token"
    const REQUEST_TYPE = "POST"

    var xhr = new XMLHttpRequest();
    xhr.open(REQUEST_TYPE, URL, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", "Basic " + ENCODED_TOKEN);
    xhr.onload = function(e) {
        // Ready state 4 = DONE, the operation is complete
        if (xhr.readyState === 4) {
            // On success
            if (xhr.status === 200) {
                // Check if the response object is not undefined
                if (!(xhr && xhr.responseText)) {
                    console.log("Response is undefined");
                    return
                }

                // Parse the response from a string to JSON object
                const responseText = JSON.parse(xhr.responseText)

                return handleResponse(responseText)
            } else {
                console.log("Fetching token was not successful, return status: ", xhr.status);
                return
            }
        }
    };
    xhr.onerror = function(e) {
        console.log("Fetching token was not successful, error: ", xhr.statusText);
        return
    };
    xhr.send("grant_type=client_credentials");
}

async function handleResponse(tokenData) {
    if (tokenData) {
        const ACCESS_TOKEN = tokenData.access_token
        const TOKEN_EXPIRATION_IN_SECONDS = tokenData.expires_in

        // Check if the token and expiration time is present
        if (ACCESS_TOKEN && TOKEN_EXPIRATION_IN_SECONDS) {
            // Get the time and convert it to seconds. 
            // Source: https://www.w3schools.com/jsref/jsref_obj_date.asp
            const CURRENT_TIME = new Date().getTime() / 1000;

            // Time in seconds when 
            const TOKEN_EXPIRATION_TIME = CURRENT_TIME + TOKEN_EXPIRATION_IN_SECONDS

            // Put the the token and expiration time in the localstorage if  supported by browser/client.
            if (typeof(Storage)) {
                localStorage.setItem("token", ACCESS_TOKEN);
                localStorage.setItem("tokenExpirationTime", TOKEN_EXPIRATION_TIME);
            }

            return ACCESS_TOKEN
        }
    }
    console.log("One or more response items related to the token are undefined");

    return
}

async function searchArtistInput(input) {
    // Get the token
    const TOKEN = await getToken()
    if (!TOKEN) { console.log("Token is undefined"); return }

    // Get the artists
    const ARTISTS = await fetchArtists(input, TOKEN)
    if (!ARTISTS) { console.log("Artists is undefined"); return }

    // Set the artists in the list
    setArtistItems(ARTISTS)
}

function fetchArtists(input, token) {
    const BASE_URL = "https://api.spotify.com/v1/"
    const REQUEST_TYPE = "GET"

    // Search for artists
    const SEARCH_TYPE = "artist"

    // Only load the 5 most popular artists
    const MAX_ITEMS = 5

    const FINAL_URL = `${BASE_URL}search?q=${input}&type=${SEARCH_TYPE}&limit=${MAX_ITEMS}`

    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(REQUEST_TYPE, FINAL_URL, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function(e) {
            // Ready state 4 = DONE, the operation is completen
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Check if response is not undefined
                    if (xhr && xhr.responseText) {
                        // Parse the data to a JSON object
                        const PARSED_DATA = JSON.parse(xhr.responseText)

                        // Check if the items of artists is an Array
                        if (PARSED_DATA && PARSED_DATA.artists && Array.isArray(PARSED_DATA.artists.items)) {
                            resolve(PARSED_DATA.artists.items)
                        }
                    }
                    console.log("The data returned from fetching the artists, was invalid");
                    return
                } else {
                    console.log("Something went wrong. Status code: ", xhr.status);
                    return;
                }
            }
        };
        xhr.onerror = function(e) {
            console.log("An error occurred", e);
            return;
        };
        xhr.send();
    })
}

function setArtistItems(artists) {
    // A list containing option tags with all the names of the artists.
    let html = "";

    // Set the name of every artist as option
    artists.map(artist => html += `<option value=${artist.name}>`);

    // Fill the options in the list with results
    WORD_LIST.innerHTML = html;
}