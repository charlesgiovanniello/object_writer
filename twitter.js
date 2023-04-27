const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


async function postTweet(text) {
    const tweet = await client.v2.tweet({ text });
    return tweet;
  }
async function replyToTweet(tweetId, text, pos=0) {
    if (pos >= text.length){
        return;
    }
    else{
        const reply = await client.v2.reply(
            text.slice(pos,pos+280),
            tweetId,
            );
        await replyToTweet(reply.data.id,text,pos+280);
    }
}
const sendPrompt = async (prompt, exampleResponse) =>{
    const tweet = await postTweet(prompt);
    await replyToTweet(tweet.data.id, exampleResponse);
    console.log(`Tweet sent! Word: ${prompt}, Example: ${exampleResponse}`)
}
module.exports={
    sendPrompt
}