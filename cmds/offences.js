const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'offences',
	aliases: ['offences', 'onfcs', 'ofnc'],
	description: "View a mentioned user's offences",
	Moderator: 'trial',
	async run(client, message, args) {
		if (!args) args = [message.author.id]
		let usr = await client.usr(args[0]).catch((x)=>{})
		if (!usr) usr = message.author;

		const ofncs = await client.db.get("ofncs" + usr.id) || 0;
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor(`${usr.tag}'s Server Offences`)
			.setDescription("```js\n" + ofncs + "\n```")
		})
	},
}