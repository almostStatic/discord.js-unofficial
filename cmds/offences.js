const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'offences',
	aliases: ['offences', 'ofncs', 'ofnc', 'offenses'],
	description: "View a mentioned user's offences",
	Moderator: 'trial',
	async run(client, message, args) {
		if (!args) args = [message.author.id]
		let usr = await client.functions.usr(args[0]).catch((x)=>{})
		if (!usr) usr = message.author;

		const ofncs = await client.db.get("ofncs" + usr.id) || 0;
		message.channel.send({
			embed: new MessageEmbed()
			.setColor("RANDOM")
			.setAuthor(`${usr.tag}'s Server Offences`)
			.setDescription("```js\n" + ofncs + "\n```")
		})
	},
}