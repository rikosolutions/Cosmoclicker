const axios = require('axios');
const crypto = require('crypto');

// Function to generate random user data
function generateRandomUser() {
    const firstNames = ['John', 'Jane', 'Alex', 'Chris', 'Amutha', 'Yuthish', 'Max', 'Emily'];
    const lastNames = ['Smith', 'Doe', 'Johnson', 'Brown', 'J', 'Kumar', 'Patel', 'Wilson'];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
        id: Math.floor(Math.random() * 1000000000), // Random user ID
        first_name: randomFirstName,
        last_name: randomLastName,
        username: randomFirstName.toLowerCase() + '_' + randomLastName.toLowerCase() + Math.floor(Math.random() * 10000), // Random username
        language_code: 'en',
        allows_write_to_pm: Math.random() > 0.5, // Random true/false
        auth_date: Math.floor(Date.now() / 1000) // Current timestamp in seconds
    };
}

// Function to generate random hash (for testing purposes)
function generateRandomHash() {
    return crypto.randomBytes(32).toString('hex'); // Generates a 64-character random hex string
}

// Function to generate random query ID (for testing purposes)
function generateRandomQueryId() {
    return 'AAG' + crypto.randomBytes(8).toString('hex').toUpperCase(); // Random query ID
}

function urlEncodeUserData(userData) {
    const userJSON = JSON.stringify(userData);
    return encodeURIComponent(userJSON);
}

// Generate random data


// Login request function
async function login() {

    const randomUser = generateRandomUser();
    const randomHash = generateRandomHash();
    const randomQueryId = generateRandomQueryId();
    const randomChatInstance = Math.floor(Math.random() * 10000000000000000); // Random chat instance
    const randomStartParam = Math.floor(Math.random() * 1000000000); // Random start param

    // URL-encoded user data
    const encodedUser = urlEncodeUserData(randomUser);

    // Build the full string for the header
    const headerString = `user=${encodedUser}&chat_instance=${randomChatInstance}&chat_type=sender&start_param=${randomStartParam}&auth_date=${randomUser.auth_date}&hash=${randomHash}`;

    console.log('Random Header String:', headerString);

    // Request headers
    const headers = {
        ':authority': 'www.vanadatahero.com',
        ':method': 'POST',
        ':path': '/api/player',
        ':scheme': 'https',
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en,en-IN;q=0.9,en-US;q=0.8',
        'content-type': 'application/json',
        'priority': 'u=1, i',
        'referer': 'https://www.vanadatahero.com/home',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Android WebView";v="128"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.146 Mobile Safari/537.36',
        'x-requested-with': 'org.telegram.messenger',
        "x-telegram-web-app-init-data":headerString
    };

    try {
        // Make the POST request to the login endpoint
        const response = await axios.get(
            'https://www.vanadatahero.com/api/player',
            { headers }
        );
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

// Execute the login function
login();
