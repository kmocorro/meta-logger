// don't build evil robots
const express = require('express');
const app = express();
const apiController = require('./controllers/apiController');
const port = process.env.PORT || 3001;

app.use('/', express.static(__dirname + '/public'));

apiController(app);

app.listen(port)
console.log('Listening in port ' + port + '...');
