const fetch = require('node-fetch');

const {
  UPTIME_ROBOT_BASE_URL,
  ACCOUNT_DETAILS_URL,
  GET_MONITORS_URL,
} = require('./constants.js');

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Cache-Control': 'no-cache',
};

const getAccountDetails = async key => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + ACCOUNT_DETAILS_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&format=json`,
  });

  const { account } = await response.json();
  console.log(account);
  return account;
};

module.exports = { getAccountDetails };
