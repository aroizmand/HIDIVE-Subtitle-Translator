// ==UserScript==
// @name         HIDIVE Subtitle Translator
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Translate HIDIVE subtitles from English to Spanish in real-time using GPT-4
// @author       Al.D.ro
// @match        https://www.hidive.com/video/*
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// ==/UserScript==

(function() {
    'use strict';

    const openaiApiKey = 'OPEN_AI_API_KEY';
    const translationCache = new Map();
    let lastTranslationTime = 0;
    const throttleDelay = 500;

    async function translateText(text, targetLanguage = 'es') {
        console.log(`Translating text: ${text}`);
        if (translationCache.has(text)) {
            console.log(`Cache hit for text: ${text}`);
            return translationCache.get(text);
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`
                },
                data: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{
                        role: 'user',
                        content: `Translate the following text to Latin American Spanish for an anime TV show. Provide only the translated text without any quotation marks or additional information. Keep the translation accurate and true to the original meaning, while ensuring it sounds natural and appropriate for spoken dialogue. Maintain the emotional tone and context. Take into account that your response will be directly copied into the subtitles of the show: "${text}"`
                    }],
                    max_tokens: 60
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices.length > 0) {
                            const translatedText = data.choices[0].message.content.trim();
                            translationCache.set(text, translatedText);
                            resolve(translatedText);
                        } else {
                            reject('Translation error: No choices found');
                        }
                    } else {
                        reject(`Translation error: ${response.responseText}`);
                    }
                },
                onerror: function(error) {
                    reject('API request error');
                }
            });
        });
    }

    function createTranslationContainer(index) {
        const container = document.createElement('div');
        container.classList.add('translated-subtitle');
        container.style.position = 'fixed';
        container.style.bottom = `${10 + index * 3}%`;
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.width = '80%';
        container.style.maxWidth = '80%';
        container.style.textAlign = 'center';
        container.style.zIndex = '1000';
        container.style.fontFamily = 'Trebuchet MS, Arial, sans-serif';
        container.style.color = 'white';
        container.style.fontSize = '2.5rem';
        container.style.fontStyle = 'normal';
        container.style.wordWrap = 'break-word';
        container.style.padding = '0 10px';
        container.style.textShadow = `
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000
        `;
        document.body.appendChild(container);
        return container;
    }

    function replaceSubtitles() {
        let lastSubtitle = '';
        const translationContainers = [];

        const processSubtitles = async (mutations) => {
            const now = Date.now();
            if (now - lastTranslationTime < throttleDelay) {
                return;
            }

            try {
                const subtitleContainers = Array.from(document.querySelectorAll('.Q0.ds-text-track__text, .Q1.ds-text-track__text, .Q2.ds-text-track__text, .Q3.ds-text-track__text, .Q4.ds-text-track__text, .Q5.ds-text-track__text'));
                let currentSubtitle = '';
                subtitleContainers.forEach(container => {
                    if (container.innerText.trim() !== '') {
                        console.log(`Found subtitle text in ${container.className}: ${container.innerText.trim()}`);
                        currentSubtitle += ' ' + container.innerText.trim();
                    }
                });
                currentSubtitle = currentSubtitle.trim();
                if (currentSubtitle && currentSubtitle !== lastSubtitle) {
                    lastSubtitle = currentSubtitle;
                    lastTranslationTime = now;
                    console.log('Original subtitle:', currentSubtitle);
                    const translatedSubtitle = await translateText(currentSubtitle, 'es');
                    console.log('Translated subtitle:', translatedSubtitle);

                    translationContainers.forEach(container => container.remove());
                    translationContainers.length = 0;

                    if (currentSubtitle.length === 0) {
                        const container = createTranslationContainer(0);
                        container.innerText = '';
                        translationContainers.push(container);
                    } else {
                        const lines = translatedSubtitle.split('\n');
                        lines.forEach((line, index) => {
                            const container = createTranslationContainer(index);
                            container.innerText = line;
                            translationContainers.push(container);
                        });
                    }
                } else if (currentSubtitle === '') {
                    lastSubtitle = '';
                    translationContainers.forEach(container => container.innerText = '');
                }
            } catch (e) {
                console.error('Error:', e);
            }

            // Check and log non-subtitle containers for unexpected text
            const nonSubtitleContainers = Array.from(document.querySelectorAll('body *:not(.Q0.ds-text-track__text):not(.Q1.ds-text-track__text):not(.Q2.ds-text-track__text):not(.Q3.ds-text-track__text):not(.Q4.ds-text-track__text):not(.Q5.ds-text-track__text)'));
            nonSubtitleContainers.forEach(container => {
                if (container.innerText.trim() !== '') {
                    console.log(`Found non-subtitle text in ${container.className}: ${container.innerText.trim()}`);
                }
            });
        };

        const observer = new MutationObserver(processSubtitles);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function hideEnglishSubtitles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .ds-text-track__text {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    console.log('HIDIVE Subtitle Translator script started');
    hideEnglishSubtitles();
    replaceSubtitles();
})();
