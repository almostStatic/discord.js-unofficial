const keyv = require('keyv');
const fs = require('fs');
const ms = require('ms');
require("@keyv/sqlite");
const defaults = require('./config.js');
const express = require('express');
const app = express();
const delay = require('delay');
const Discord = require('discord.js');
const Intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
Intents.add(['GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS']);
const client = new Discord.Client({
	disableMentions: 'everyone',
	ws: {
		intents: Intents,
		properties: {
			$browser: 'Discord Android',
			$device: 'Discord Android'
		},
	},
});

client.db = new keyv('sqlite://./database.sqlite')
client.commands = new Discord.Collection();
client.config = Object.freeze(defaults.statics);
defaults.functions.usr = async function (str) {
	if (!str) return;
	str = str.toString();
	let usr;
	try {
		usr = await client.users.fetch(defaults.functions.getID(str))
	} catch (err) {
		usr = await client.users.fetch(str).catch((x) => {})
	};	
	return usr;
};

defaults.functions.getUserFromPing = function(mention, withID) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	const id = matches[1];
	if (!withID) withID = false;
	if (withID == true) {
		return id;
	} else {
	return client.users.cache.get(id);
	};
};

client.functions = defaults.functions;

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);
	client.commands.set(command.name, command);
};

app.get('/', (req, res) => res.send(new Date()))

client.db.on("error", console.log)

client.on("messageDelete", async (message) => {
	if (message.author.bot) return;
	await client.db.set("snipe" + message.channel.id, {
		author: message.author.id,
		message: message.content || "n/a",
	});
});

client.on('ready', async() => {
	console.log(`Logged in as ${client.user.tag}`);
	await client.guilds.cache.get(client.config.guild).members.fetch();
	console.log("Fetched Members.")
});

client.on('message', async message => {
	if (message.channel.type == "dm") return;
	if (message.partial) message = await message.fetch();
	if (message.guild) await message.guild.members.fetch();
	if (message.author.bot) return;

	if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;

	const args = message.content.slice(client.config.prefix.length).split(/ +/g);

	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	/**
	 * Returns an insufficent perms message to the current channel 
	 * @param {string} permName The permission name to which this permission will be referred to as within the message 
	 */
	async function insufficentModPerms(permName) {
		return message.channel.send("You must have at least " + permName + " in order to use this command")
	}

	if (command.Moderator) {
		if (command.Moderator == 'trial' && (!message.member.roles.cache.has(client.config.roles.TRIAL_MODERATOR))) {
				return insufficentModPerms("Trial-Moderator")
		} else if (command.Moderator == 'mod' && (!message.member.roles.cache.has(client.config.roles.MODERATOR))) {
			return insufficentModPerms("Moderator");
		} else if (command.Moderator == 'senior' && (!message.member.roles.cache.has(client.config.roles.TRIAL_MODERATOR))) {
			return insufficentModPerms("Senior-Moderator")
		};
	};

	try {
		await command.run(client, message, args);
	} catch (e) {
		message.channel.send({
			embed: new Discord.MessageEmbed()
			.setColor("#aa0000")
			.setTitle("Command Error")
			.setDescription(`\`\`\`\n${e.stack}\n\`\`\``)
		});
	};
});

process.on('unhandledRejection', (e) => {
	console.error(e);
});

client.on('error', x => console.log(x));

client.login(process.env.token);
app.listen(3000, () => { console.clear(); console.log('server started');})