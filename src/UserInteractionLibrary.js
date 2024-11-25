const { EmbedBuilder } = require('discord.js');
var UserDatabaseLibrary = require('./UserDatabaseLibrary.js');
const Users = require("../data/Users.json");

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

var UserInteractionLibrary = {
    // Add a new Letterbod User by parsing message.
    ParseAddUser: function(message){
        message_split = message.split(" ");

        if(message_split.length != 4) {
            return "Incorrect Inputs.  Add some more info on why it was wrong TODO:"
        }
        display_name = message_split[1];
        username = message_split[2];
        icon_url = message_split[3];

        return_string = UserDatabaseLibrary.AddUser(display_name,username,icon_url);
        return return_string;
    },
    ParseUpdateUserIcon: function(message){
        message_split = message.split(" ");

        if(message_split.length != 3) {
            return "Incorrect Inputs.  Add some more info on why it was wrong TODO:"
        }
        display_name = message_split[1];
        icon_url = message_split[2];

        return_string = UserDatabaseLibrary.UpdateUserIcon(display_name,icon_url);
        return return_string;
    },
    ParseUpdateDisplayName: function(message){
        message_split = message.split(" ");

        if(message_split.length != 3) {
            return "Incorrect Inputs.  Add some more info on why it was wrong TODO:"
        }
        userName = message_split[1];
        display_name = message_split[2];

        return_string = UserDatabaseLibrary.UpdateDisplayName(userName,display_name);
        return return_string;
    },
    ParseUpdateUserName: function(message){
        message_split = message.split(" ");

        if(message_split.length != 3) {
            return "Incorrect Inputs.  Add some more info on why it was wrong TODO:"
        }
        display_name = message_split[1];
        userName = message_split[2];

        return_string = UserDatabaseLibrary.UpdateDisplayName(display_name,userName);
        return return_string;
    },
    ParseDisplayUser: function(message){
        message_split = message.split(" ");

        if(message_split.length != 2) {
            return "Incorrect Inputs.  Add some more info on why it was wrong TODO:"
        }
        display_name = message_split[1];

        var return_string = UserDatabaseLibrary.DisplayUserBasic(display_name);
        var icon_url = UserDatabaseLibrary.GetUserIconURL(display_name);
        return [return_string,icon_url];
    },
    ParseDisplayAllUser: function(message){
        message_split = message.split(" ");

        if(message_split.length != 1) {
            return "Incorrect Inputs.  Add some more info on why it was wrong TODO:"
        }
        return_string = ""
        for (let user of Users) {
            return_string += UserDatabaseLibrary.DisplayUserBasic(user.displayName) + "\r\n";
        }

        return return_string;
    },
    CheckForUserUpdate: async function(channel,user) {
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
              .setAuthor({name: `${user.displayName}`, iconURL: `${user.iconURL}`, url: 'https://letterboxd.com/' + user.userName + '/' })
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
              UserDatabaseLibrary.SaveAllUsers();
            }
          });
      
        }
        catch {
          // Do Nothing
        }
    }  
 }


 module.exports = UserInteractionLibrary;