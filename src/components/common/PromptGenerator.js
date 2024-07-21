// src/components/common/PromptGenerator.js

import { sendPromptToTogether } from '../../utils/togetherApi';

/**
 * Generates a prompt based on the given windows state.
 * @param {Array} windows - The current state of the windows.
 * @returns {String} - The generated prompt.
 */
const generatePrompt = (windows) => {
  let prompt = `Create a React website with the following specifications: 
  Please provide the JavaScript and CSS code separately, enclosed in comments as follows:

  // JavaScript code start
  // Your React component code here
  // JavaScript code end

  /* CSS code start */
  /* Your CSS code here */
  /* CSS code end */`;

  windows.forEach((window, windowIndex) => {
    prompt += `Page ${windowIndex + 1}:\n`;

    window.widgets.forEach((widget, widgetIndex) => {
      prompt += `  Section ${widgetIndex + 1} (${widget.type}):\n`;

      let subPrompt = `For the ${widget.type.toLowerCase()} of this page`;

      if (widget.colors.length > 0) {
        subPrompt += `, use these colors: ${widget.colors.map(color => color.value).join(', ')}`;
      }

      if (widget.links.length > 0) {
        subPrompt += `, and these links: ${widget.links.map(link => `${link.name} (${link.url})`).join(', ')}`;
      }

      if (widget.images.length > 0) {
        subPrompt += `, and include these images: ${widget.images.map(image => image.value).join(', ')}`;
      }

      if (widget.promptString) {
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
    console.log('Sending prompt to Together AI:', prompt);
    const response = await sendPromptToTogether(prompt);
    console.log('Received response from Together AI:', response);
    return response;
  } catch (error) {
    console.error("Error generating and sending prompt:", error);
    throw error;
  }
};

export default generatePrompt;
