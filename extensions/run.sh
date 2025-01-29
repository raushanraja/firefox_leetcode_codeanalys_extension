#!/bin/bash

# Set the extension directory name
EXTENSION_DIR="my-api-extension"

# Create the extension directory if it doesn't exist
mkdir -p "$EXTENSION_DIR"
cd "$EXTENSION_DIR"

# Create manifest.json
cat <<EOF >manifest.json
{
  "manifest_version": 3,
  "name": "API Request Extension",
  "version": "1.0",
  "description": "Sends an API request and displays the response.",
  "action": {
    "default_popup": "popup/popup.html"
  },
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "*://*/*"
  ],
    "background": {
        "service_worker": "background.js"
    }
}
EOF

# Create background.js
cat <<EOF >background.js
async function sendApiRequest(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Request Error:", error);
        return null; // Or an error object/string
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "api_request") {
      const apiResponse = await sendApiRequest(message.url);
      sendResponse({ type: 'api_response', data: apiResponse });
    }
});
EOF

# Create popup directory
mkdir -p "popup"

# Create popup/popup.html
cat <<EOF >popup/popup.html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="popup.css">
</head>
<body>
    <h1>API Result</h1>
    <input type="text" id="apiUrl" value="https://jsonplaceholder.typicode.com/todos/1"/>
    <button id="fetchButton">Fetch Data</button>
    <div id="responseContainer"></div>
    <script src="popup.js"></script>
</body>
</html>
EOF

# Create popup/popup.css
cat <<EOF >popup/popup.css
#responseContainer {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    max-height: 300px;
    overflow-y: auto;
}

#apiUrl {
    margin-bottom: 10px;
}
EOF

# Create popup/popup.js
cat <<EOF >popup/popup.js
document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById("fetchButton");
    const responseContainer = document.getElementById("responseContainer");
    const apiUrlInput = document.getElementById('apiUrl');

    fetchButton.addEventListener("click", async () => {
        const apiUrl = apiUrlInput.value;
        responseContainer.textContent = 'Loading...';

        // Send message to background script
        chrome.runtime.sendMessage({type: "api_request", url: apiUrl}, (response) => {
            if (response && response.data) {
                if(typeof response.data === "object") {
                    responseContainer.textContent = JSON.stringify(response.data, null, 2);
                } else {
                    responseContainer.textContent = response.data;
                }

            } else {
                responseContainer.textContent = "Error fetching data.";
            }
         });
    });
});
EOF

echo "Firefox extension files created in '$EXTENSION_DIR'"
echo "To load the extension go to 'about:debugging#/runtime/this-firefox' and click on 'Load Temporary Add-on...'"
echo "Select the manifest.json file inside '$EXTENSION_DIR' folder"
