const schedule = require('node-schedule');
const {sendPrompt} = require("./twitter")
const axios = require('axios');
const randomWords = require('random-words');
const {nouns} = require('nouns');
const puppeteer = require('puppeteer');
require('dotenv').config();

const wordGenerator = async () => {
    //Method 1 use ChatGPT, words are usually the same
    // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    //         model: "gpt-3.5-turbo",
    //         messages: [{
    //             "role": "user",
    //             "content":`name a random object`

    //         }],
    //         //prompt: `Use the principles of Pat Pattison's object writing method to generate a few sentences about ${noun}`,
    //         max_tokens: 280,
    //         temperature: 0.8,
    //         n: 1,
    //         stop: '\n\n'
    //     }, {
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    //         }
    //     });

    //     // Print the generated story to the console
    //     return response.data.choices[0].message.content;

    //Method 2 using NPM package, words aren't so great
    // const randomIndex = Math.floor(Math.random() * nouns.length);
    // return nouns[randomIndex];

    //Method 3, webscrape the objectwriting.com website

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://objectwriting.com/');
    //await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // Get the text within the <p> tag using its full XPath
    const xpath = '/html/body/div/div[2]/div/main/article/div/div[1]/div[1]/table/tbody/tr/td/h1';
    const element = await page.$x(xpath);
    const text = await page.evaluate(el => el.textContent.trim(), element[0]);

    console.log(text);

    await browser.close();

    return text
}

const main = async() => {
    // Set the time to run the job (9am EST)
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'America/New_York';
    rule.hour = 9;
    rule.minute = 0;
    rule.second = 0;

    // Create a job that runs at the specified time
    const job = schedule.scheduleJob(rule, async function() {
        const noun = await wordGenerator();
        // Make an API call to ChatGPT to generate a short story based on the noun
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                "role": "user",
                "content":`Use the principles of Pat Pattison's object writing method to generate a paragraph with the word: ${noun}`

            }],
            //prompt: `Use the principles of Pat Pattison's object writing method to generate a few sentences about ${noun}`,
            max_tokens: 280,
            temperature: 0.5,
            n: 1,
            stop: '\n\n'
        }, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        // Print the generated story to the console
        const story = response.data.choices[0].message.content;

        sendPrompt(`Today's word is: ${noun}`, story)
    });
}

module.exports = {
    main
}