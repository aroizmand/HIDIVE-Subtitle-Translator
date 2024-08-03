# HIDIVE Subtitle Translator

This Tampermonkey script translates HIDIVE subtitles from English to any language (default Spanish) in real-time. 

## Features

- Translates subtitles using OpenAI's GPT-3.5-turbo model
- Option to select different target languages
- Styles the subtitles like the ones in Crunchyroll

## Installation

### 1. Install Tampermonkey

First, you need to install the Tampermonkey extension for your browser. Here are the links to install Tampermonkey:

- [Tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
- [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Tampermonkey for Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)
- [Tampermonkey for Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

### 2. Obtain an OpenAI API Key

You will need an OpenAI API key to use this script. Follow these steps:

1. Go to the [OpenAI API website](https://beta.openai.com/signup/).
2. Sign up for an account.
3. Once your account is created, log in to the [OpenAI dashboard](https://beta.openai.com/dashboard/).
4. Add funds to your OpenAI account if needed.
5. Navigate to the API section and create a new API key.

### 3. Create a New Script

1. Open the Tampermonkey dashboard by clicking on the Tampermonkey icon in your browser toolbar and selecting "Dashboard".
2. Click on the "+" icon to create a new script.
3. Copy and paste the contents of `HIDIVE-Subtitle-Translator.user.js` into the editor.
4. Replace `YOUR_OPENAI_API_KEY` in the script with your actual OpenAI API key.
5. Save the script.

## Usage

### 1. Navigate to a HIDIVE Video

1. Go to [HIDIVE](https://www.hidive.com/) and start playing any video.
2. The script will automatically translate English subtitles to your chosen language in real-time.

### 2. Selecting a Target Language

If you want to translate to a different target language, follow these steps:

1. Open the Tampermonkey dashboard.
2. Find the `HIDIVE Subtitle Translator` script in the list and click on the edit (pencil) icon.
3. Locate the line in the script that defines the target language:
   ```javascript
   async function translateText(text, targetLanguage = 'es')
   ```

4.  Replace `'es'` with the code for your desired target language (e.g., `'fr'` for French, `'de'` for German, etc.).
5.  Modify the prompt in the translateText function to include the new target language (e.g., Translate the following anime TV show subtitle to French: ${text}).
   ```javascript
    data: JSON.stringify({
       model: 'gpt-3.5-turbo',
       messages: [{
       role: 'user',
       content: `Translate the following text to Latin American Spanish for an anime TV show: ${text}`
   }],
   ```
6.  Save the script.

### Supported Languages

Here are some examples of language codes you can use:

-   Spanish: `es`
-   French: `fr`
-   German: `de`
-   Japanese: `ja`
-   Korean: `ko`
-   Chinese (Simplified): `zh`

For a full list of language codes, refer to the [ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

Contributing
------------

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

Contact
-------

For any questions or issues, please open an issue in the [GitHub repository](https://github.com/aroizmand/HIDIVE-Subtitle-Translator/issues).
