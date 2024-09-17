This is Store Rating App 
where There is Three types of users are Available 
1.Admin
2.Normal User 
3.Store/Store Owner
Where Admin Can Add Useres
And Normal User Can Rate Stores
This Is created By Using React For Frontend And Express for Backend and Mongodb For Database
To Run This Project 
You Need an node.js Installed in your Pc
And a Account Of MongoDb
after That Create a Project in Mongodb Add Cluster in Project And Connect This Using compass
copy the Connection Strign of compass
Then Download a zip file Extract it
Open Backend Folder open server.js add your connection string in mongoose.connect("") in server .js
Then Open Backend Folder in terminal Type Command npm install after in stall Type commans node node server.js
then minimize terminal 
First You need to Add Admin user in this
To add admin user you can use Thunder CLient or Postman extension of vs code
in this start a new post request type http://localhost:5000/register and pass a json object with {
name:"",
role:"Admin",
email:"",
address:""
password:"",

}
after creating a user
Open frontend in terminal Type Command npm install
then type command npm start
Project is run successfully
Then login with role,email and password
