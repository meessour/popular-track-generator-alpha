// function fetchData(url, timeout, callback) {
function fetchData() {
    const input = document.getElementById('input').value
    const baseUrl = 'https://api.spotify.com/v1/'
    const searchType = 'artist'
    const finalUrl = `${baseUrl}search?q=${input}&type=${searchType}`

    const requestType = 'GET'
    const authorizationKey = 'BQBG868LT98vImVzMvfPS0laq-OLNxz8fD6qnx6V_F5IAMMbdt794BB1MjrrjLHdL9R1Y_WThF5EYP1bQZwP4lRRGxu206ewZ5M1GRrHLqv37P2JrPuveptzuG4sNgTW470cL8KK2j3iOq-daspO7zxSIBW7JtSI4V1Eb0q3'

    requestToken()

    // var xhr = new XMLHttpRequest();
    // xhr.open(requestType, finalUrl, true);
    // xhr.setRequestHeader('Accept', 'application/json');
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('Authorization', `Bearer ${authorizationKey}`);
    // xhr.onload = function(e) {
    //     if (xhr.readyState === 4) {
    //         if (xhr.status === 200) {
    //             var response = xhr.responseText
    //             setContent(response)
    //         } else {
    //             var response = xhr.statusText
    //             setContent(response)
    //         }
    //     }
    // };
    // xhr.onerror = function(e) {
    //     var response = xhr.statusText
    //     setContent(response)
    // };
    // xhr.send();
}
fetchData2()

function fetchData2() {
    var client_id = '2779f7bf0903431ea612d81a437c691b'; // Your client id
    var client_secret = 'a5327f791f414ca1ae6146e2092879aa'; // Your secret

    var token = (client_id + ':' + client_secret).toString('base64')

    // xhr.setRequestHeader('Accept', 'application/json');
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('Authorization', 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')));
    // xhr.setRequestHeader('Authorization', 'Basic ' + (client_id + ':' + client_secret).toString('base64'));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://accounts.spotify.com/api/token", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        grant_type: token
    }));
}


// var request = require('request'); // "Request" library

// console.log("ja", request);


// // your application requests authorization
// var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//     },
//     form: {
//         grant_type: 'client_credentials'
//     },
//     json: true
// };



// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {

//     // use the access token to access the Spotify Web API
//     var token = body.access_token;
//     var options = {
//       url: 'https://api.spotify.com/v1/users/jmperezperez',
//       headers: {
//         'Authorization': 'Bearer ' + token
//       },
//       json: true
//     };
//     request.get(options, function(error, response, body) {
//       console.log(body);
//     });
//   }
// });




function setContent(data) {
    var parsedData = JSON.parse(data)
        // All the artist objects in an array
    var items = parsedData.artists.items

    console.log('Data', data)

    // A list containing option tags with all the names of the artists.
    var html = '';

    items.map(artist => html += '<option value="' + artist.name + '">');

    console.log('html', html)
        // Render all the 
    document.getElementById('wordlist').innerHTML = html;


    // $("#wordlist").append(html);
}

// function processRequest(e) {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//         var response = JSON.parse(xhr.responseText);
//         var result = '';
//         for (var i = 0; i < response.artists.items.length; i++) {
//             console.log(response.artists.items[i]);
//             result += '<div class="panel panel-primary"><div class="panel-body">' +
//                 'name : ' + response.artists.items[i].name + '<br/>' +
//                 'popularity : ' + response.artists.items[i].popularity + '<br/>' +
//                 'type : ' + response.artists.items[i].type + '</div></div>';
//         }
//         document.getElementById("artists").innerHTML = result;
//     }
// }

// const render = async() => {
//     const data = await fetchData();
//     console.log(data);
// };

// render()