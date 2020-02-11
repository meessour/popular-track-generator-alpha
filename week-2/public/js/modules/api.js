async function fetchToken() {
    const token = "Mjc3OWY3YmYwOTAzNDMxZWE2MTJkODFhNDM3YzY5MWI6YTUzMjdmNzkxZjQxNGNhMWFlNjE0NmUyMDkyODc5YWE="

    const url = "https://accounts.spotify.com/api/token"
    const requestType = "POST"
    return new Promise(function (resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open(requestType, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + token);
        xhr.onload = function (e) {
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

                    if (responseText) {
                        console.log("ja", responseText);

                        resolve(responseText)
                    }
                } else {
                    console.log("Fetching token was not successful, return status: ", xhr.status);
                    return
                }
            }
        };
        xhr.onerror = function (e) {
            console.log("Fetching token was not successful, error: ", xhr.statusText);
            return
        };
        xhr.send("grant_type=client_credentials");
    })

}

function fetchArtists(input, token) {
    const baseUrl = "https://api.spotify.com/v1/"
    const requestType = "GET"

    // Search for artists
    const searchType = "artist"

    // Only load the 5 most popular artists
    const maxItems = 5

    const finalUrl = `${baseUrl}search?q=${input}&type=${searchType}&limit=${maxItems}`

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(requestType, finalUrl, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function (e) {
            // Ready state 4 = DONE, the operation is completen
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Check if response is not undefined
                    if (xhr && xhr.responseText) {
                        // Parse the data to a JSON object
                        const parsedData = JSON.parse(xhr.responseText)

                        // Check if the items of artists is an Array
                        if (parsedData && parsedData.artists && Array.isArray(parsedData.artists.items)) {
                            resolve(parsedData.artists.items)
                        }
                    } else {
                        console.log("The data returned from fetching the artists, was invalid");
                        return
                    }

                } else {
                    console.log("Something went wrong. Status code: ", xhr.status);
                    return;
                }
            }
        };
        xhr.onerror = function (e) {
            console.log("An error occurred", e);
            return;
        };
        xhr.send();
    })
}

async function fetchTracks(artistId, token) {
    if (!artistId) return;

    const baseUrl = "https://api.spotify.com/v1/";
    const requestType = "GET";
    const country = "NL";

    const finalUrl = `${baseUrl}artists/${artistId}/top-tracks?country=${country}`;

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(requestType, finalUrl, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function (e) {
            // Ready state 4 = DONE, the operation is completen
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Check if response is not undefined
                    if (xhr && xhr.responseText) {
                        // Parse the data to a JSON object
                        const parsedData = JSON.parse(xhr.responseText);

                        // Check if the items of artists is an Array
                        if (parsedData && Array.isArray(parsedData.tracks)) {
                            resolve(parsedData.tracks)
                        }
                    } else {
                        console.log("The data returned from fetching the artists, was invalid");
                        return
                    }

                } else {
                    console.log("Something went wrong. Status code: ", xhr.status);
                    return;
                }
            }
        };
        xhr.onerror = function (e) {
            console.log("An error occurred", e);
            return;
        };
        xhr.send();
    })
}

export { fetchToken, fetchArtists, fetchTracks }