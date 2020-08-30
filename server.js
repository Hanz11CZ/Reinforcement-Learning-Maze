var path = require('path');
const express = require('express');

const port = 8080;
const hostname = '127.0.0.1';

const app = express();

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))