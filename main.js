const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
var cron = require('node-cron');
var CONFIG = require('./config.json');

class LetterbotdUser {
  constructor(name,userName,iconURL,updateDate) {
    this.name = name;
    this.userName = userName;
    this.iconURL = iconURL;
    this.updateDate = updateDate;
  }
}

let Users = [];

todayDate = Date.now();
const Bill = new LetterbotdUser ('Bill','BillWilsonJ','https://a.ltrbxd.com/resized/avatar/upload/4/1/2/1/0/9/3/shard/avtr-0-1000-0-1000-crop.jpg?v=38f157a413',todayDate);
const JJ = new LetterbotdUser ('JJ','jonathan_jordan','https://letterboxd.com/jonathan_jordan/#avatar-large',todayDate);
const Jay = new LetterbotdUser ('Jay','jay_crone','https://a.ltrbxd.com/resized/avatar/upload/4/1/1/8/7/1/1/shard/avtr-0-220-0-220-crop.jpg?v=62af664e03',todayDate);
const Christian = new LetterbotdUser ('Christian','aircjordan','https://a.ltrbxd.com/resized/avatar/upload/2/6/3/3/1/5/5/shard/avtr-0-220-0-220-crop.jpg?v=2a79f48fcc',todayDate);
Users.push(Bill);
Users.push(JJ);
Users.push(Jay);
Users.push(Christian);

let Parser = require('rss-parser');
let parser = new Parser({
  customFields: {
    item: [
      ["letterboxd:rewatch", "rewatch"],
      ["letterboxd:watchedDate", "watchedDate"],
      ["letterboxd:filmTitle", "filmTitle"],
      ["letterboxd:filmYear", "filmYear"],
      ["letterboxd:memberRating", "memberRating"],
      ["dc:creator", "creator"],
    ],
  },
});

async function NewFunction(channel,user) {

  try {
    let feed = await parser.parseURL('https://letterboxd.com/' + user.userName + '/rss/');

    feed.items.forEach(item => {

      const title = item.title.toString()
      let match = title.match(/(★|½)+/)
      let pubDate = new Date(Date.parse(item.pubDate));
      let starRating = match ? match[0] : "";
      if (pubDate >= user.updateDate) {

        let rewatch = item.rewatch == 'Yes'
        if (item.watchedDate) {
            watchedOn = new Date(Date.parse(item.watchedDate)).toDateString()
        }

        const posterImageMatch = item.content.toString().match(/src="(.+?)"/)
        if (posterImageMatch) {
            posterImageUrl = posterImageMatch[1];
        }

        let review = item.contentSnippet.replace(/\n/gm, "\n");

        const desc = `[${item.creator}].`;

        if (review.length >= 4096 - desc.length) {
          const more = ` [...more](${item.link})`
          review = review.slice(0, 4092 - desc.length - more.length) + more;
        }

        let title_String = `${item.filmTitle} (${item.filmYear}) ${starRating}`;

        if (rewatch == true) {
          title_String = title_String + " ↺";
        }

        const spoilerMatch = title.match(/spoiler/);

        if (spoilerMatch) {
          title_String = `||${title_String}||`;
          review = review.replace("This review may contain spoilers.", "");
          review = review.replace(/^\n+|\n+$/g, "");
          review = "|| " + review + " ||";
        }

        let embed = new EmbedBuilder()
        .setTitle(title_String)
        .setAuthor({name: `${user.name}`, iconURL: `${user.iconURL}`, url: 'https://letterboxd.com/' +  + user.userName + '/' })
        .setURL(item.link)
        .setThumbnail(posterImageUrl)
        .addFields({name: 'Watched Date', value: `\`\`\`${watchedOn}\`\`\``},
                  {name: 'Review', value: `${review}`}
        )
        .setColor("#FF7E02");

        channel.send({
          embeds: [embed],
        });

        user.updateDate = Date.now();

      }
    });

  }
  catch {
    // Do Nothing
  }
}

async function TestFunction(channel) {

  channel.send(
    {content: "|| Example Message \n Exampple Message ||"}
  );

  let embed = new EmbedBuilder()
  .setTitle("Test")
  .setAuthor({name: "test" })
  .addFields({name: 'Watched Date', value: `Test`},
            {name: 'Review', value: `|| Test \n  Test ||`}
  )
  .setColor("#FF7E02");

  channel.send({
    embeds: [embed],
  });


}

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
      await NewFunction(channel,user);
    })
  });
}),

client.on('messageCreate', async message => {

    if (message.content.toLowerCase().includes('test'))
    {
        //await TestFunction(message.channel);
    }
});

client.login(CONFIG.token);