'use strict';

function handleError(error, request, response, next) {
  console.error(`Error occurred: ${error.message}`);
  response.status(500).send(`Something went wrong. ${error.message}`);
}

module.exports = handleError;