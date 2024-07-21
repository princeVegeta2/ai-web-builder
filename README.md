# Anthropic WebBuilder

This website is developped using React, and is designed towards simplyfing the process of creating websites using Together AI's Llama 3 70B Instruct Turbo model. It allows the user to build out their website's structure using user-friendly widgets in a no-code no-text environment, making it more more simple and accessible than writing out a prompt or coding from scratch.

## Usage

Since this website needs to be connected to a paid Together AI API, you will need to setup your own connection to the API. The infrastructure for this is pre-built and all you need to do is add a ``.env`` file and a ``REACT_APP_TOGETHER_API_KEY``

## Access

In order to access the website on Netlify you will need an access key which you can request from me.

## WebBuilder

On the left you can see a list of widgets, each representing a section of the website. In the center, each white rectangle represents a droppable workspace and a separate page. You can drag and drop widgets from the widget list onto the page workspace and add/remove the pages and widgets. 

## Modals

Each widget has multiple modals. Colors, Links and Images modals modify the prompt to include these features in the JS and CSS code provided by the Claude AI. The Prompt modal allows the user to modify the generated code by adding their own prompt text to it.

## Generate website

When the button is clicked, the prompt is generated and is sent to the Llam3 AI via the TogetherAI API. The response is then parsed according to our reges variables and displayed in the new Result page with a separate window displaying ReactJS code and a separate window for CSS code. In the future I am planning to make this more user friendly and streamlined.

## License

This is a startup project. All rights reserved.