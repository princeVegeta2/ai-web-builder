// src/components/common/PromptGenerator.js

import { sendPromptToTogether } from '../../utils/togetherApi';

/**
 * Generates a prompt based on the given windows state.
 * @param {Array} windows - The current state of the windows.
 * @returns {String} - The generated prompt.
 */
const generatePrompt = (windows) => {
  let prompt = `Please help me create a React website, using React 18.3.1, with multiple pages and multiple sections per page.
  Please avoid saying anything else except code, try to provide only React and CSS code in your response.
  You will be provided with a page number and section types you need to give for each page like Navbar, Section, Footer, Etc.
  Please Format your response in such a manner, using /* */ as if in code comments:
 
  /* Page # Start */
  /* Section Name */
  /* React Code Start */
  /* React Code End */
  /* CSS Code Start */
  /* CSS Code End */
  /* Page # End */
  
  Please keep this code format for every page and every section, so if you have 3 sections for Page 1, you will
  repeat this 3 times for that page for each section of that page, keepin Page # 1. And if there is a second page,
  you will repeat that process for that page as well, keeping it's number as 2, and repeating this process for each section
  of the page.

  You will also be provided with the colors of each section of the page. If there is no color specified, use #fff instead.
  You will also be provided with links for each section. If there are no links provided, don't use any links at all.
  You will also be provided with image urls for each section. If there are no image urls provided, don't use any at all.
  You might also be asked for additional functionality/specifications for each section.
  `;

  windows.forEach((window) => {
    prompt += `Page name: ${window.name}:\n`;

    window.widgets.forEach((widget, widgetIndex) => {
      prompt += `  Section ${widgetIndex + 1} (${widget.type}):\n`;

      let subPrompt = `For the ${widget.type.toLowerCase()} of this page`;

      // Safely handle the case where any of these properties might be undefined
      if (widget.colors && widget.colors.length > 0) {
        subPrompt += `, use these colors: ${widget.colors.map(color => color.value).join(', ')}`;
      } else {
        subPrompt += `, use the default color: #fff`;
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
