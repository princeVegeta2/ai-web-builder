import Together from "together-ai";

export const sendPromptToTogether = async (prompt) => {
  const apiKey = process.env.REACT_APP_TOGETHER_API_KEY;
  const together = new Together({ apiKey });

  try {
    console.log('Sending request to Together AI...');
    console.log('Prompt:', prompt);

    const response = await together.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
    });

    console.log('Response:', response);

    const content = response.choices[0]?.message?.content || 'No response content';
    return content;
  } catch (error) {
    console.error("Error sending prompt to Together:", error);
    throw error;
  }
};
