const button = document.getElementById('analyze');
const code_el = document.getElementById('code');
const resp_el = document.getElementById('resp');

const api_key = 'REPLACE_APIKEY';
const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
    api_key;

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

const analyze = async () => {
    const converter = new showdown.Converter();
    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });
    const code = code_el.value;
    let response = await post(code);
    // resp_el.innerHTML = converter.makeHtml(response);
    resp_el.innerHTML = md.render(response);
};

button.onclick = analyze;
