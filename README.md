# Anthropic WebBuilder

This website is developped using React, and is designed towards simplyfing the process of creating websites using Anthropic's Claude AI. It allows the user to build out their website's structure using user-friendly widgets in a no-code no-text environment, making it more more simple and accessible than writing out a prompt.

## Usage

Since this website needs to be connected to a paid Anthropic API, you will need to setup your own connection to the API. The infrastructure for this is pre-built and all you need to do is add a ``.env`` file and a ``REACT_APP_ANTHROPIC_API_KEY``

## Access

Use this code to access the WebBuilder page: **VqxgAnbK6xu0nI9YJU6XejE5qFsuI8Os**. Enter it in the Home page's textbox.

## WebBuilder

On the left you can see a list of widgets, each representing a section of the website. In the center, each white rectangle represents a droppable workspace and a separate page. You can drag and drop widgets from the widget list onto the page workspace and add/remove the pages and widgets. 

## Modals

Each widget has multiple modals. Colors, Links and Images modals modify the prompt to include these features in the JS and CSS code provided by the Claude AI. The Prompt modal allows the user to modify the generated code by adding their own prompt text to it.

## Generate website

The functionality of this button isn't really implemented yet. Right now it simply redirects the user to the Results page which displays the raw code sent to us by Claude. In the future, I will change it such that it gives the user the appropriate .JS and .CSS files which they can include in their React workspace.

## License

This is a public repository, and you can use this however you'd like. 