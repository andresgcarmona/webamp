const { reject, getStatus } = require("../../data/skins");
const Utils = require("../utils");
const { TWEET_BOT_CHANNEL_ID } = require("../../config");

async function handler(message, args) {
  const [md5] = args;
  const status = await getStatus(md5);
  if (status !== "UNREVIEWED") {
    await message.channel.send(`This skin has already been reviewed.`);
    return;
  }
  await reject(md5);
  const tweetBotChannel = message.client.channels.get(TWEET_BOT_CHANNEL_ID);
  let filename = null;
  await Utils.postSkin({
    md5,
    title: f => {
      // Hack to get access to the file name
      filename = f;
      return `Rejected: ${f}`;
    },
    dest: tweetBotChannel
  });
  await tweetBotChannel.send(
    `${filename} was rejected by ${message.author.username}`
  );
}

module.exports = {
  command: "reject",
  handler,
  usage: "<md5-hash>",
  description: "Reject a given skin from being Tweeted by the Twitter bot"
};
