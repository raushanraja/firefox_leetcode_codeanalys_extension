const analyzeContainerId = '4ebf8ca0-87b2-486f-9e95-94837c0264d7';
const api_key = 'REPLACE_KEY';
const apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
    api_key;
const headers = [['Content-Type', 'application/json']];
const options = { headers, method: 'POST' };
const post = async (code, url = apiUrl) => {
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

function addbasiccss() {
    let style = document.createElement('style');
    style.innerHTML = `
        /* Ensure container uses readable font */
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
    `;
    document.head.appendChild(style);
}

function createClickableDiv() {
    const divElement = document.createElement('div');
    divElement.classList.add(
        'flexlayout__tab_button',
        'flexlayout__tab_button_top'
    );
    divElement.id = 'tabbuttonforanalyzed';
    return divElement;
}

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

function generateDivWithNewPath(newPath, content) {
    // Define the new `div` structure
    const newDiv = `
    <div class="flexlayout__tab" 
         data-layout-path="${newPath}" 
         id="${analyzeContainerId}" 
         style="left: 954px; top: 36px; position: absolute; --width: 946px; --height: 427px;">
      ${content}
    </div>
  `;

    // Return the generated HTML
    return newDiv;
}

function toggleElementByDataPath(tabIndex, hidden) {
    const dataPath = `/c1/ts0/t${tabIndex}`;
    // Use querySelector to find the element with the specified data-layout-path
    const element = document.querySelector(`[data-layout-path="${dataPath}"]`);

    if (element) {
        // Set the element's display property to none
        element.style.display = hidden ? 'none' : '';
        console.log(
            `Element with data-layout-path="${dataPath}" is now hidden.`
        );
    } else {
        console.error(`Element with data-layout-path="${dataPath}" not found.`);
    }
}

let analyzeContainer;
function appendNewDivToContainer(containerSelector, tabIndex, content) {
    const container = document.querySelector(containerSelector); // Select the container
    const newPath = `/c1/ts0/t${tabIndex}`;
    if (container) {
        analyzeContainer = generateDivWithNewPath(newPath, content); // Generate the new `div`
        const lastElement = Array.from(
            container.querySelectorAll('[data-layout-path^="/c1/ts0/t"]')
        ).pop();
        if (lastElement) {
            // Insert the new div after the last found element
            lastElement.insertAdjacentHTML('afterend', analyzeContainer);
        } else {
            // If no matching element is found, just append the new div to the container
            container.innerHTML += analyzeContainer;
        }
        console.log('New div successfully added to the container.');
    } else {
        console.error('Container not found.');
    }
}

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

function waitForMonaco() {
    console.log('Waiting');
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            console.log('Running interval');
            if (window.monaco) {
                clearInterval(interval);
                resolve();
            }
        }, 100); // Check every 100 milliseconds
    });
}

function addbutton() {
    if (document.getElementById('analyzebtn')) {
        return document.getElementById('analyzebtn');
    }

    console.log('Adding button');
    const newButton = document.createElement('button');
    newButton.id = 'analyzebtn';
    newButton.textContent = 'Analyze';
    newButton.classList.add(
        'py-1.5',
        'font-medium',
        'items-center',
        'whitespace-nowrap',
        'focus:outline-none',
        'inline-flex',
        'text-label-r',
        'bg-green-s',
        'dark:bg-dark-green-s',
        'hover:bg-green-3',
        'dark:hover:bg-dark-green-3',
        'h-[32px]',
        'select-none',
        'px-5',
        'text-[12px]',
        'leading-[18px]',
        'ml-2',
        'rounded-lg',
        'text-sm',
        'font-medium'
    );
    newButton.style.setProperty('margin-left', '8px', 'important');

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

    parentDiv.appendChild(newButton);
    console.log('New Button added');
    return newButton;
}

function get_tab_bar_container() {
    const outerContainer = document.getElementById('code_tabbar_outer');
    if (!outerContainer) {
        return;
    }
    return outerContainer.querySelector(
        '.flexlayout__tabset_tabbar_inner_tab_container.flexlayout__tabset_tabbar_inner_tab_container_top'
    );
}

let isAnalyzeTabVisible = false;
let analyzeTabTbIndex;
let analyzeTabTbPathValue;
let analyzeContainerData;

function buildAnalyzeData() {
    let div = document.createElement('div');
    const newButton = document.createElement('button');
    newButton.id = 'close';
    newButton.textContent = 'Close';
    newButton.classList.add(
        'py-1.5',
        'font-medium',
        'items-center',
        'whitespace-nowrap',
        'focus:outline-none',
        'inline-flex',
        'text-label-r',
        'bg-green-s',
        'dark:bg-dark-green-s',
        'hover:bg-green-3',
        'dark:hover:bg-dark-green-3',
        'h-[32px]',
        'select-none',
        'px-5',
        'text-[12px]',
        'leading-[18px]',
        'ml-2',
        'rounded-lg',
        'text-sm',
        'font-medium'
    );
    newButton.style.setProperty('margin-left', '8px', 'important');
    newButton.style.setProperty('min-width', '30px', 'important');
    newButton.style.setProperty('float', 'right');
    newButton.style.setProperty('margin-right', '10px');
    newButton.style.setProperty('margin-top', '10px');

    const dataElement = document.createElement('div');
    dataElement.id = 'analyzeResponse';

    div.appendChild(newButton);
    div.appendChild(dataElement);

    analyzeContainerData = div;
}

function toggleAnalyzeTab() {
    const tabIndex = analyzeTabTbIndex - 1;
    if (isAnalyzeTabVisible) {
        isAnalyzeTabVisible = false;
        toggleElementByDataPath(tabIndex, false);
        toggleElementByDataPath(tabIndex + 1, true);
    } else {
        isAnalyzeTabVisible = true;
        toggleElementByDataPath(tabIndex, true);
        if (analyzeContainer) {
            toggleElementByDataPath(tabIndex + 1, false);
        } else {
            if (!analyzeContainerData) {
                buildAnalyzeData();
                setTimeout(() => {
                    document.getElementById('close').onclick = () => {
                        toggleAnalyzeTab();
                    };
                }, 2000);
                appendNewDivToContainer(
                    '#qd-content > .flexlayout__layout',
                    tabIndex + 1,
                    analyzeContainerData.innerHTML
                );
            }
        }
    }
}

async function getResponseForCode() {
    const code = window?.monaco?.editor?.getEditors()?.[0]?.getValue();
    if (code) {
        const response = await post(code, apiUrl);
        return response;
    }
    return 'No response';
}

setTimeout(() => {
    import('https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm').then(
        (Module) => {
            const markdownit = Module.default;
            const md = markdownit({
                html: true,
                linkify: true,
                typographer: true,
            });

            addbasiccss();
            const newButton = addbutton();
            if (newButton) {
                const tabbar = get_tab_bar_container();
                if (tabbar) {
                    analyzeTabTbIndex = findLastTabIndex();
                    analyzeTabTbPathValue = `/c1/ts0/tb${analyzeTabTbIndex}`;
                    const analyzeTab = generateTab(
                        'Analyze',
                        analyzeTabTbIndex
                    );
                    tabbar.innerHTML += analyzeTab;
                } else {
                    console.error('Container not found.');
                }

                newButton.onclick = async function () {
                    toggleAnalyzeTab();
                    const response = await getResponseForCode();
                    const dataElement =
                        document.getElementById('analyzeResponse');
                    if (dataElement) {
                        dataElement.innerHTML = md.render(response);
                    }
                };
            }
        }
    );
}, 4000);
