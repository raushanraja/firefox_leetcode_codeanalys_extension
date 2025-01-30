// Constants
const apiKey = 'REPLACE_ME';
const analyzeContainerId = '4ebf8ca0-87b2-486f-9e95-94837c0264d7';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
const headers = [['Content-Type', 'application/json']];
const options = { headers, method: 'POST' };

// Global State
let analyzeButton;
let analyzeContainer;
let isAnalyzeTabVisible = false;
let analyzeTabTbIndex;
let analyzeContainerData;

// Utility Functions

/**
 * Creates a DOM element with specified attributes and inner HTML.
 * @param {string} tag - The HTML tag name.
 * @param {Object} attributes - Key-value pairs of attributes.
 * @param {string} innerHTML - The inner HTML content.
 * @returns {HTMLElement} - The created element.
 */
function createElement(tag, attributes = {}, innerHTML = '') {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) =>
        element.setAttribute(key, value)
    );
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

/**
 * Toggles the visibility of an element based on its selector.
 * @param {string} selector - The CSS selector for the element.
 * @param {boolean} isVisible - Whether the element should be visible.
 */
function toggleElementVisibility(selector, isVisible) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = isVisible ? '' : 'none';
    } else {
        console.error(`Element not found: ${selector}`);
    }
}

/**
 * Finds the last tab index in the tab bar.
 * @returns {number} - The next available tab index.
 */
function findLastTabIndex() {
    const tabElements = document.querySelectorAll(
        '[data-layout-path^="/c1/ts0/tb"]'
    );
    let maxIndex = -1;

    tabElements.forEach((el) => {
        const path = el.getAttribute('data-layout-path');
        const match = path.match(/\/c1\/ts0\/tb(\d+)/);
        if (match) {
            const index = parseInt(match[1], 10);
            maxIndex = Math.max(maxIndex, index);
        }
    });

    return maxIndex + 1;
}

/**
 * Gets the tab bar container element.
 * @returns {HTMLElement} - The tab bar container.
 */
function getTabBarContainer() {
    const outerContainer = document.getElementById('code_tabbar_outer');
    if (!outerContainer) return null;
    return outerContainer.querySelector(
        '.flexlayout__tabset_tabbar_inner_tab_container.flexlayout__tabset_tabbar_inner_tab_container_top'
    );
}

// API Functions

/**
 * Sends a request to the Gemini API for code analysis.
 * @param {string} code - The code to analyze.
 * @param {string} url - The API endpoint URL.
 * @returns {Promise<string>} - The API response.
 */
async function post(code, url = apiUrl) {
    const data = `
        Provide Complexity analysis for given code: ${code}
        Also provide the step-by-step breakdown.
        Also provide the summarized breakdown with just step name and time.
        At the end, give formatted Space & Time Complexity like:
        Time Complexity: - Best - Average - Worst
        Space Complexity: (Give just one, cause it will be same always)
    `;

    const body = {
        contents: [{ parts: [{ text: data }] }],
    };

    options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        const responseData = await response.json();
        return responseData.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return null;
    }
}

// UI Functions

/**
 * Adds basic CSS styles for the analyze response container.
 */
function addBasicCSS() {
    const style = createElement(
        'style',
        {},
        `
        #analyzeResponse {
            font-family: "Nimbus Sans",  sans-serif, Arial;
            line-height: 1.6;
            padding: 20px;
            border-radius: 5px;
        }

        /* Restore paragraph spacing */
        #analyzeResponse p {
            font-size: 16px;
            margin-bottom: 15px;
        }

        /* Headers should have spacing and weight */
        #analyzeResponse h1, #analyzeResponse h2, #analyzeResponse h3 {
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
        }

        #analyzeResponse h1 {
            font-size: 28px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 5px;
        }

        #analyzeResponse h2 {
            font-size: 24px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }

        #analyzeResponse h3 {
            font-size: 20px;
        }

        /* Ensure lists maintain their symbols */
        #analyzeResponse ul {
            list-style-type: disc !important; /* Ensures bullet points */
            padding-left: 20px !important;
            margin-bottom: 10px;
        }

        #analyzeResponse ol {
            list-style-type: decimal !important; /* Ensures numbered lists */
            padding-left: 20px !important;
            margin-bottom: 10px;
        }

        #analyzeResponse li {
            margin-bottom: 5px;
        }

        /* Restore and style tables */
        #analyzeResponse table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            border: 1px solid #ddd;
        }

        #analyzeResponse th, #analyzeResponse td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        #analyzeResponse th {
            font-weight: bold;
        }


        /* Ensure code blocks are styled */
        #analyzeResponse code {
            font-family: "Courier New", monospace;
            background-color: #f4f4f4;
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 14px;
            color: #d63384;
        }

        #analyzeResponse pre {
            background-color: #272822;
            color: #f8f8f2;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 14px;
        }

        #analyzeResponse pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
    `
    );
    document.head.appendChild(style);
}

/**
 * Creates a clickable div for the analyze tab.
 * @returns {HTMLElement} - The created div.
 */
function createClickableDiv() {
    return createElement('div', {
        class: 'flexlayout__tab_button flexlayout__tab_button_top',
        id: 'tabbuttonforanalyzed',
    });
}

/**
 * Generates the HTML for the analyze tab.
 * @param {string} replacementText - The text to display in the tab.
 * @param {number} tabIndex - The index of the tab.
 * @returns {string} - The HTML for the tab.
 */
function generateTab(replacementText, tabIndex) {
    const dataLayoutPath = `/c1/ts0/tb${tabIndex}`;
    const tabDiv = createClickableDiv();
    tabDiv.setAttribute('data-layout-path', dataLayoutPath);
    tabDiv.innerHTML = `
        <div class="flexlayout__tab_button_content">
            <div class="relative flex items-center gap-1 overflow-hidden text-sm capitalize" style="max-width: 150px;" id="analyze_tab">
                <div class="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5 text-sd-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M344 280l88-88M232 216l64 64M80 320l104-104"/><circle cx="456" cy="168" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="320" cy="304" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="208" cy="192" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="56" cy="344" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                </div>
                <div class="relative">
                    <div class="medium whitespace-nowrap font-medium">${replacementText}</div>
                    <div class="normal absolute left-0 top-0 whitespace-nowrap font-normal">${replacementText}</div>
                </div>
            </div>
        </div>
    `;
    return tabDiv.outerHTML;
}

/**
 * Appends a new div to the container for the analyze tab.
 * @param {string} containerSelector - The selector for the container.
 * @param {number} tabIndex - The index of the tab.
 * @param {string} content - The HTML content to append.
 */
function appendNewDivToContainer(containerSelector, tabIndex, content) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Container not found.');
        return;
    }

    const newPath = `/c1/ts0/t${tabIndex}`;
    const newDiv = createElement(
        'div',
        {
            class: 'flexlayout__tab',
            'data-layout-path': newPath,
            id: analyzeContainerId,
            style: 'left: 954px; top: 36px; position: absolute; --width: 946px; --height: 427px;',
        },
        content
    );

    const lastElement = Array.from(
        container.querySelectorAll('[data-layout-path^="/c1/ts0/t"]')
    ).pop();
    if (lastElement) {
        lastElement.insertAdjacentHTML('afterend', newDiv.outerHTML);
    } else {
        container.innerHTML += newDiv.outerHTML;
    }
    console.log('New div successfully added to the container.');
}

/**
 * Builds the analyze data container with a close button and response area.
 */
function buildAnalyzeData() {
    const div = createElement('div');
    const closeButton = createElement(
        'button',
        {
            id: 'close',
            class: 'py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex text-label-r bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 h-[32px] select-none px-5 text-[12px] leading-[18px] ml-2 rounded-lg text-sm font-medium',
            style: 'margin-left: 8px; min-width: 30px; float: right; margin-right: 10px; margin-top: 10px;',
        },
        'Close'
    );

    const dataElement = createElement('div', { id: 'analyzeResponse' });

    div.appendChild(closeButton);
    div.appendChild(dataElement);

    analyzeContainerData = div;
}

/**
 * Toggles the visibility of the analyze tab.
 */
function toggleAnalyzeTab() {
    const tabIndex = analyzeTabTbIndex - 1;
    isAnalyzeTabVisible = !isAnalyzeTabVisible;

    toggleElementVisibility(
        `[data-layout-path="/c1/ts0/t${tabIndex}"]`,
        !isAnalyzeTabVisible
    );
    toggleElementVisibility(
        `[data-layout-path="/c1/ts0/t${tabIndex + 1}"]`,
        isAnalyzeTabVisible
    );

    if (isAnalyzeTabVisible && !analyzeContainer) {
        if (!analyzeContainerData) {
            buildAnalyzeData();
            setTimeout(() => {
                document.getElementById('close').onclick = toggleAnalyzeTab;
            }, 2000);
            appendNewDivToContainer(
                '#qd-content > .flexlayout__layout',
                tabIndex + 1,
                analyzeContainerData.innerHTML
            );
        }
    }
}

/**
 * Fetches the response for the current code in the editor.
 * @returns {Promise<string>} - The analysis response.
 */
async function getResponseForCode() {
    const code = window?.monaco?.editor?.getEditors()?.[0]?.getValue();
    if (!code) return 'No code found';

    const response = await post(code);
    return response;
}

/**
 * Adds the "Analyze" button to the UI.
 * @returns {HTMLElement} - The created button.
 */
function addAnalyzeButton() {
    if (document.getElementById('analyzebtn')) {
        return document.getElementById('analyzebtn');
    }

    console.log('Adding button');
    if (!analyzeButton) {
        analyzeButton = createElement(
            'button',
            {
                id: 'analyzebtn',
                class: 'py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex text-label-r bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 h-[32px] select-none px-5 text-[12px] leading-[18px] ml-2 rounded-lg text-sm font-medium',
                style: 'margin-left: 8px !important;',
            },
            'Analyze'
        );
    }

    const submitButtonContainer = document
        .querySelector('[data-e2e-locator="console-submit-button"]')
        ?.closest('.group');
    if (!submitButtonContainer) {
        console.log('Submit button container not found');
        return;
    }

    const parentDiv = submitButtonContainer.parentElement;
    if (!parentDiv) {
        console.log('Parent div not found');
        return;
    }

    parentDiv.appendChild(analyzeButton);
    console.log('New Button added');
    return analyzeButton;
}

// Main Initialization

/**
 * Initializes the analyze functionality.
 */
async function initialize() {
    import('https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm').then(
        (Module) => {
            const markdownit = Module.default;
            const md = markdownit({
                html: true,
                linkify: true,
                typographer: true,
            });

            if (!analyzeButton) {
                addBasicCSS();
                analyzeTabTbIndex = findLastTabIndex();

                const tabbar = getTabBarContainer();
                if (!tabbar) {
                    console.error('Tab bar container not found.');
                    return;
                }
                analyzeTabTbPathValue = `/c1/ts0/tb${analyzeTabTbIndex}`;
                tabbar.innerHTML += generateTab('Analyze', analyzeTabTbIndex);
            }

            const newButton = addAnalyzeButton();
            if (!newButton) return;

            newButton.onclick = async () => {
                toggleAnalyzeTab();
                const response = await getResponseForCode();
                const dataElement = document.getElementById('analyzeResponse');
                if (dataElement) {
                    dataElement.innerHTML = md.render(response);
                }
            };
        }
    );
}

// Entry Point
setTimeout(initialize, 4000);

// Check if button is removed, add it
setInterval(async () => {
    if (analyzeButton) {
        await initialize();
    }
}, 5000);
