const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addemoji",
	aliases: ['addemoji', 'add-emoji'],
	Moderator: "senior",
	description: "Adds an emoji in the current guild",
	async run(client, message, args) {
		if (args.length < 2) return message.channel.send("You must provide a name and image URL for the new emoji under the format `?addemoji <name> <URL>`");
		const name = args[0].toLowerCase();
		const URL = args[1].toLowerCase();
		message.guild.emojis.create(URL, name)
			.then((emoji) => message.channel.send(`${client.config.emoji.TICK} Successfully added the ${emoji} emoji was added under the name \`${emoji.name}\``))
				.catch((error) => message.reply(`There was an error whilst adding the emoji under your given args: ${error}`))
	}
}