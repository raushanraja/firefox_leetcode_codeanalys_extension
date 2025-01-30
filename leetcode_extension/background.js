const headers = [['Content-Type', 'application/json']];
const options = { headers, method: 'POST' };
const post = async (code, url) => {
    const data =
        'Provide Complexisty analysis for given code: ' +
        code +
        'Also proivde the step-by-step breakdown\n' +
        'Also provide the summerized breakdown with just step name and time\n' +
        'At end give formatted Space & Time Complexity like: ' +
        'Time Complexity: - Best 	- Average 	- Worst\n' +
        'Space Complexisty: (Give just one, cause it will be same always)';
    try {
        const body = {
            contents: [
                {
                    parts: [
                        {
                            text: data,
                        },
                    ],
                },
            ],
        };

        options['body'] = JSON.stringify(body);
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        const responseData = await response.json();
        const textResponse = responseData.candidates[0].content.parts[0].text;
        console.log('Gemini Response:', textResponse);
        return textResponse;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return null;
    }
};
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'api_request') {
        console.log('Sending to api', message);
        post(message.code, message.url).then((apiResponse) => {
            sendResponse({ type: 'api_response', data: apiResponse });
        });
        return true;
    }
});
