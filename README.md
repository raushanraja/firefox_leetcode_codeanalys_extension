# Firefox Leetcode Code analysis Extension

This extension provides functionality to analyze code using the Gemini API. It integrates with the UI to add an "Analyze" button and displays the analysis results in a new tab.

## Features

- Adds an "Analyze" button to the UI.
- Sends code to the Gemini API for analysis.
- Displays the analysis results in a new tab.
- Provides detailed complexity analysis, step-by-step breakdown, and summarized breakdown.

## Installation

1. Clone the repository.
2. Ensure you have the necessary dependencies installed.

## Usage

1. Replace the `apiKey` in `content.js` with your Gemini API key.
2. Load the extension in your environment.
3. Click the "Analyze" button to analyze the code in the editor.

## Improvements Needed

- **Loading Indicator**: Add an indication when the data is being fetched from the Gemini API.
- **Error Handling**: Display an update if the request fails, informing the user of the error.
- **Caching**: Implement a way to cache the response in case the "Analyze" button is clicked with the same code.
- **Refetch Button**: Add an additional button to refetch the data, allowing users to manually refresh the analysis.

## Entry Point

The extension initializes after a delay of 4 seconds and checks periodically if the "Analyze" button is removed, re-adding it if necessary.

## Functions

### Utility Functions

- `createElement(tag, attributes, innerHTML)`: Creates a DOM element with specified attributes and inner HTML.
- `toggleElementVisibility(selector, isVisible)`: Toggles the visibility of an element based on its selector.
- `findLastTabIndex()`: Finds the last tab index in the tab bar.
- `getTabBarContainer()`: Gets the tab bar container element.

### API Functions

- `post(code, url)`: Sends a request to the Gemini API for code analysis.

### UI Functions

- `addBasicCSS()`: Adds basic CSS styles for the analyze response container.
- `createClickableDiv()`: Creates a clickable div for the analyze tab.
- `generateTab(replacementText, tabIndex)`: Generates the HTML for the analyze tab.
- `appendNewDivToContainer(containerSelector, tabIndex, content)`: Appends a new div to the container for the analyze tab.
- `buildAnalyzeData()`: Builds the analyze data container with a close button and response area.
- `toggleAnalyzeTab()`: Toggles the visibility of the analyze tab.
- `getResponseForCode()`: Fetches the response for the current code in the editor.
- `addAnalyzeButton()`: Adds the "Analyze" button to the UI.

### Initialization

- `initialize()`: Initializes the analyze functionality.

## License

This project is licensed under the MIT License.

