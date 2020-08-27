const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'warn',
	aliases: ['warn', 'w'],
	Moderator: 'trial',
	async run(client, message, args) {
		if (args.length < 2) {
			return message.channel.send(`${client.config.emoji.err} Incorrect usage; try using \`${message.guild.prefix}warn <user> <reason>\``)
		};
		let usr = await client.usr(args[0])
		if(!usr) return message.channel.send(`${client.config.emoji.err} I can't seem to find that user...`);
		const mem = message.guild.members.cache.get(usr.id);
		if (!mem) return message.channel.send("Only members of this server are punishable.")
		//add offences:
		let ofncs = await client.db.get("ofncs" + usr.id) || 0;
			ofncs = Number(ofncs);
		const newofncs = ofncs + 1;
		await client.db.set("ofncs" + usr.id, newofncs);

		const reason = args.slice(1).join(' ');
	
		let logsMessage = await client.channels.cache.get(client.config.channels.MOD_LOG).send({
			embed: new MessageEmbed()
			.setColor("#f56c6c")
			.setTitle("Member Warned")
			.addField("Moderator", `${message.author.tag} | ${message.author.id}`, true)
			.addField("User", `${usr.tag} | ${usr.id}`, true)
			.addField('Offences', newofncs)
			.addField('Reason', reason)
			.setTimestamp()
			.setFooter("Warned")
		});

		let emb = new MessageEmbed()
		.setDescription(`You have received a warning in ${message.guild.name}. If you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}\n[[Log Message](${logsMessage.url})]`)
		.setColor(client.config.colors.red)
		.addField(`Moderator`, message.author.tag, true)
		.addField("Total Offences", newofncs, true)
		.addField("Reason", reason);

		message.channel.send(`${client.config.emoji.tick} ${usr.tag} has been warned and was sent the following message:`);
		message.channel.send(emb);
		await client.users.cache.get(usr.id).send(emb).catch((x) => {});

	}
}