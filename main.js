const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
var cron = require('node-cron');
var CONFIG = require('./config.json');
var UserInteractionLibrary = require('./src/UserInteractionLibrary.js');
var Users = require("./data/Users");

client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on('ready', async () => {
  console.log("Letterbotd Online");
  
  let channel = await client.channels.fetch(CONFIG.movie_club_channel_id);
  cron.schedule('0 */1 * * * *', async () => {
    Users.forEach(async user => {
      await UserInteractionLibrary.CheckForUserUpdate(channel,user);
    })
  });
}),

client.on('messageCreate', async message => {

    if(message.channel.name === "movie-club")
    {
      if(message.content.startsWith("!AddUser")) {
        return_string = UserInteractionLibrary.ParseAddUser(message.content);
        message.channel.send(return_string);
      }
      if(message.content.startsWith("!UpdateIcon")) {
        return_string = UserInteractionLibrary.ParseUpdateUserIcon(message.content);
        message.channel.send(return_string);
      }
      if(message.content.startsWith("!UpdateDisplayName")) {
        return_string = UserInteractionLibrary.ParseUpdateDisplayName(message.content);
        message.channel.send(return_string);
      }
      if(message.content.startsWith("!UpdateUserName")) {
        return_string = UserInteractionLibrary.ParseUpdateUserName(message.content);
        message.channel.send(return_string);
      }
      if(message.content.startsWith("!DisplayUser")) {
        const [return_string,icon_url] = UserInteractionLibrary.ParseDisplayUser(message.content);
        message.channel.send(return_string);
        message.channel.send(icon_url);
      }
      if(message.content.startsWith("!DisplayAllUsers")) {
        return_string = UserInteractionLibrary.ParseDisplayAllUser(message.content);
        message.channel.send(return_string);
      }
    }
});

client.login(CONFIG.token);