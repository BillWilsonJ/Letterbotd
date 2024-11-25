const fs = require("fs");
const LetterbotdUser = require('./LetterbotdUser.js')
const Users = require("../data/Users.json");

var UserDatabaseLibrary = {
    // Add a new Letterbod User
    AddUser: function(displayName,userName,iconURL){
        todayDate = Date.now();
        const new_user = new LetterbotdUser (displayName,userName,iconURL,todayDate);
        const found = Users.some(el => el.userName === userName);
        if(!found){
            Users.push(new_user);
            save_users();
            return_string = "New User Added";
            return return_string;
        }
        else{
            return "User already added";
        }
    },
    // Update a user icon based on display name
    UpdateUserIcon: function(displayName,iconURL){
        var elementPos = Users.map(function(x) {return x.displayName; }).indexOf(displayName);
        if(elementPos == -1) {
            return_string = "Could not find user with the name " + displayName;
            return return_string;
        }
        else {
            Users[elementPos].iconURL = iconURL;
            save_users();
            return_string = ("Updated URL of " + Users[elementPos].displayName);
            return return_string;
        }
    },
    // Update display name of user based on username
    UpdateDisplayName: function(userName,displayName){
        var elementPos = Users.map(function(x) {return x.userName; }).indexOf(userName);
        if(elementPos == -1) {
            return_string = "Could not find user with the username " + userName;
            return return_string;
        }
        else {
            Users[elementPos].displayName = displayName;
            save_users();
            return_string = "Updated name of user " + Users[elementPos].userName + " to " + Users[elementPos].displayName;
            return return_string;
        }
    },
    // Update username of user based on display name
    UpdateUserName: function(displayName,userName){
        var elementPos = Users.map(function(x) {return x.displayName; }).indexOf(displayName);
        if(elementPos == -1) {
            return_string = "Could not find user with the name " + displayName;
            return return_string;
        }
        else {
            Users[elementPos].userName = userName;
            save_users();
            return_string = "Updated username of " + Users[elementPos].displayName + " to " + Users[elementPos].userName;
            return return_string;
        }
    },
    DisplayUserBasic: function(displayName){
        var elementPos = Users.map(function(x) {return x.displayName; }).indexOf(displayName);
        if(elementPos == -1) {
            return_string = "Could not find user with the name " + displayName;
            return return_string;
        }
        else {
            return_string = Users[elementPos].displayName + ": " + Users[elementPos].userName
            return return_string;
        }
    },
    GetUserIconURL: function(displayName){
        var elementPos = Users.map(function(x) {return x.displayName; }).indexOf(displayName);
        if(elementPos == -1) {
            return_string = "Could not find user with the name " + displayName;
            return return_string;
        }
        else {
            return_string = Users[elementPos].iconURL;
            return return_string;
        }
    },
    SaveAllUsers: function(){
        save_users();
    },
 }

 // Write the current users to the JSON file 
function save_users() {
    fs.writeFile(
    "./data/Users.json",
    JSON.stringify(Users),
    err => {
        // Checking for errors 
        if (err) throw err;
    });
 }

 module.exports = UserDatabaseLibrary;





 // TEST SECTION
 // CODE I DON"T WANT TO DELETE BECAUSE I MIGHT USE IT LATER

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

// UserDatabaseLibrary.AddUser('Bill','BillWilsonJ','https://a.ltrbxd.com/resized/avatar/upload/4/1/2/1/0/9/3/shard/avtr-0-1000-0-1000-crop.jpg?v=38f157a413');
// UserDatabaseLibrary.AddUser('JJ','jonathan_jordan','https://letterboxd.com/jonathan_jordan/#avatar-large');
// UserDatabaseLibrary.AddUser('Jay','jay_crone','https://a.ltrbxd.com/resized/avatar/upload/4/1/1/8/7/1/1/shard/avtr-0-220-0-220-crop.jpg?v=62af664e03');
// UserDatabaseLibrary.AddUser('Christian','aircjordan','https://a.ltrbxd.com/resized/avatar/upload/2/6/3/3/1/5/5/shard/avtr-0-220-0-220-crop.jpg?v=2a79f48fcc');