const { runInContext } = require("vm");

module.exports = {
  name: 'test',
  aliases: ['test', 't'],
  async run(client, message, args) {
    message.channel.send(
      "I'm ALIVE!!11!!"
    )
  }
}