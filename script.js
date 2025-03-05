const CLIENT_ID = "78624gqbe0rn07"; // Replace with your LinkedIn App Client ID
const REDIRECT_URI = "http://localhost:5500/callback"; // Must match LinkedIn's settings

function loginWithLinkedIn() {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=r_liteprofile%20r_emailaddress`;
    window.location.href = authUrl;
}

async function getAccessToken(code) {
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: "YOUR_CLIENT_SECRET" // Replace with your LinkedIn App Secret
        })
    });

    const data = await response.json();
    return data.access_token;
}

async function fetchUserProfile(token) {
    const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const user = await response.json();
    document.getElementById("profile-img").src = user.profilePicture?.["displayImage~"]?.elements[0]?.identifiers[0]?.identifier;
    document.getElementById("profile-name").innerText = user.localizedFirstName + " " + user.localizedLastName;
    document.getElementById("profile-headline").innerText = user.headline;

    document.querySelector(".login-section").style.display = "none";
    document.getElementById("profile").style.display = "block";
}

function logout() {
    document.getElementById("profile").style.display = "none";
    document.querySelector(".login-section").style.display = "block";
}

// Handle OAuth Redirect
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("code")) {
    getAccessToken(urlParams.get("code")).then(fetchUserProfile);
}
