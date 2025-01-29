document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('analyze');
    const code_el = document.getElementById('code');
    const resp_el = document.getElementById('resp');
    const api_key = 'REPLACE_WITH_KEY';
    const apiUrl =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
        api_key;
    button.addEventListener('click', async () => {
        // Send message to background script
        const code = code_el.value;
        chrome.runtime.sendMessage(
            { type: 'api_request', url: apiUrl, code: code },
            (response) => {
                const md = markdownit({
                    html: true,
                    linkify: true,
                    typographer: true,
                });
                resp_el.innerHTML = md.render(response.data);
            }
        );
    });
});
