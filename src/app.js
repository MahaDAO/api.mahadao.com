const express = require('express');
const routes = require('./routes');

const app = express();
const cors = require('cors');
app.disable('x-powered-by');

app.use(cors());

// Routes
app.use(routes);

module.exports = app;
