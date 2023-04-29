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
    var returnMe = ""
    if (pos >= text.length){
        return tweetId;
    }
    else{
        const reply = await client.v2.reply(
            text.slice(pos,pos+280),
            tweetId,
            );
        returnMe = await replyToTweet(reply.data.id,text,pos+280);
    }
    return returnMe;
}
const sendPrompt = async (prompt, exampleResponse) =>{
    const tweet = await postTweet(prompt);
    const lastReply = await replyToTweet(tweet.data.id, exampleResponse);
    //Add hashtags
    await client.v2.reply(
        "#ObjectWriting #CreativeWriting #Poetry #Lyrics",
        lastReply,
        );
    console.log(`Tweet sent! Word: ${prompt}, Example: ${exampleResponse}`)
}
module.exports={
    sendPrompt
}