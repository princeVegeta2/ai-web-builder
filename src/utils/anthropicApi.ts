import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error('API key is missing. Make sure REACT_APP_ANTHROPIC_API_KEY is set in your .env file.');
}

const anthropic = new Anthropic({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true
});

export const sendMessage = async (message: string) => {
  try {
    console.log('Sending message to Claude:', message);

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      temperature: 0.3,
      messages: [{
        role: "user",
        content: message
      }]
    });

    console.log('Received response from Claude:', response);
    return response;
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    throw error;
  }
};

export default anthropic;