// src/utils/anthropicApi.js

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
});

export const sendPromptToAnthropic = async (prompt) => {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });
    return msg.data[0].content;
  } catch (error) {
    console.error("Error sending prompt to Anthropic:", error);
    throw error;
  }
};
