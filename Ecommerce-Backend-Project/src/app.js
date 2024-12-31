
const { MongoClient, ServerApiVersion } = require('mongodb'); // check this if needed
const mongoose = require('mongoose');
const dbURL = "mongodb+srv://project_user:EnTNtbJgNSXvhm4Y@cluster0.jdq8n60.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true";


mongoose.connect(dbURL).then((connection)=>{
    // console.log('db is connected', connection);
     console.log('db is connected');
});
