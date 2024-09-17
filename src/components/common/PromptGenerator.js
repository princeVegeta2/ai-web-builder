// src/components/common/PromptGenerator.js

import { sendMessage } from '../../utils/anthropicApi';

/**
 * Generates a prompt based on the given windows state.
 * @param {Array} windows - The current state of the windows.
 * @returns {String} - The generated prompt.
 */
const generatePrompt = (windows) => {
  let prompt = `Please help me create a React website, using React 18.3.1, with multiple pages and multiple sections per page.

Please provide the output in **JSON format** with the following structure:
{
  "pages": [
    {
      "pageName": "Home",
      "sections": [
        {
          "sectionName": "Navbar",
          "jsCode": "/* React code here */",
          "cssCode": "/* CSS code here */"
        },
        {
          "sectionName": "Section",
          "jsCode": "/* React code here */",
          "cssCode": "/* CSS code here */"
        },
        // ... other sections
      ]
    },
    // ... other pages
  ]
}

You will be provided with a page name and section types you need to create for each page like Navbar, Section, Footer, etc.

For each section, please include any specified colors, links, image URLs, and additional functionality as per the instructions.

Do not say anything else. Only reply with code in JSON format.

If there is no Page called App in the details below, please generate code for App.js aswell, with all of the routing for all pages.

Here are the page and section details:
`;

  windows.forEach((window) => {
    prompt += `Page name: ${window.name}:\n`;

    window.widgets.forEach((widget, widgetIndex) => {
      prompt += `  Section ${widgetIndex + 1} (${widget.type}):\n`;

      let subPrompt = `For the ${widget.type.toLowerCase()} of this page`;

      if (widget.colors && widget.colors.length > 0) {
        subPrompt += `, use these colors: ${widget.colors.map(color => color.value).join(', ')}`;
      }

      if (widget.links && widget.links.length > 0) {
        subPrompt += `, and these links: ${widget.links.map(link => `${link.name} (${link.url})`).join(', ')}`;
      }

      if (widget.images && widget.images.length > 0) {
        subPrompt += `, and include these images: ${widget.images.map(image => image.value).join(', ')}`;
      }

      if (widget.promptString && widget.promptString.trim() !== '') {
        subPrompt += `. Additionally: ${widget.promptString}`;
      }

      subPrompt += '.';
      prompt += `    ${subPrompt}\n`;
    });

    prompt += "\n";
  });

  return prompt;
};


export const generateAndSendPrompt = async (windows) => {
  const prompt = generatePrompt(windows);
  try {
    console.log('Sending prompt to AI API:', prompt);

    const response = await sendMessage(prompt);

    console.log('Received response from AI API:', response);
    return response;
  } catch (error) {
    console.error("Error generating and sending prompt:", error);
    throw error;
  }
};

export default generatePrompt;
