'use strict';

// ** 1. Imports / Dependencies **
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const handleError = require('./helpers/responseHandler');
const router = require('./routes');

// ** 2. Configuration and Middleware **
const app = express();
app.use(cors());

// ** 3. Use Routes **
app.use(router);

// ** 4. Error Handling Middleware **
app.use(handleError);

// ** 5. Start Server **
const PORT = process.env.PORT || 3001;
function startServer() {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));  
};

startServer();

