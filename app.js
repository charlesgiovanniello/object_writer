const schedule = require('node-schedule');
const {sendPrompt} = require("./twitter")
const axios = require('axios');
require('dotenv').config();

const wordGenerator = async () => {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                "role": "user",
                "content":`name a random object found in nature`

            }],
            //prompt: `Use the principles of Pat Pattison's object writing method to generate a few sentences about ${noun}`,
            max_tokens: 280,
            temperature: 0.8,
            n: 1,
            stop: '\n\n'
        }, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        // Print the generated story to the console
        return response.data.choices[0].message.content;
}

const main = async() => {
    // Set the time to run the job (9am EST)
    const jobTime = '0 9 * * *';

    // Create a job that runs at the specified time
    const job = schedule.scheduleJob(jobTime, async function() {
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