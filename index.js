// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var bodyParser = require('body-parser') // 用于获取post请求参数
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

// let adminRouter = require('./router/router.js') // 自定义路由
// let magentoRestful  = require('./router/magentoRestful.js') // magento 路由
const addRouters = require('./router') 
let ParseDashboard = require('parse-dashboard'); // 控制面板




let AppName = 'Teda'  // 新客户的名字
let MASTER_KEY = 'dldl349jf4jfidj23ifj34jlgj4igi4g4g'
let SERVER_URL = 'http://localhost:1337/parse'
// let SERVER_URL = 'https://teda-parse.wudizu.com/parse'

var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": SERVER_URL,
      "appId": AppName,
      "masterKey": MASTER_KEY,
      "appName": AppName
    }
  ]
});


if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/' + AppName,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || AppName,
  masterKey: process.env.MASTER_KEY || MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || SERVER_URL,  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Conversations"] // List of classes to support for query subscriptions
  }
});



// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey



var Parse = require('parse/node')
Parse.initialize(AppName,'',MASTER_KEY);
Parse.serverURL = SERVER_URL


var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
addRouters(app)

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// 使用自己写的路由模块,自定义模块,自定义给后台用
// app.use('/admin',adminRouter )
// 控制面板

// app.use('/dashboard', dashboard)

// magento 的 restful 路由
// app.use('/restful', magentoRestful)

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
// app.get('/', function(req, res) {
//   res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
// });

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);



// Firebase import
// Google firebase package
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/firestore");


const firebase_config = {
  apiKey: "AIzaSyCaAt2jDPaPALCLN9bIn07RD3LzCFqPdT8",
  authDomain: "chat-vue-c92b2.firebaseapp.com",
  databaseURL: "https://chat-vue-c92b2.firebaseio.com",
  projectId: "chat-vue-c92b2",
  storageBucket: "",
  messagingSenderId: "505504455007"
};

firebase.initializeApp(firebase_config)
