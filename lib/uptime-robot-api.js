const fetch = require('node-fetch');

const {
  UPTIME_ROBOT_BASE_URL,
  ACCOUNT_DETAILS_URL,
  GET_MONITORS_URL,
  NEW_MONITOR_URL,
  HTTPS_MONITOR_KEY
} = require('./constants.js');

const { generateRandomString } = require('./utils');

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

const getMonitors = async key => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + GET_MONITORS_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&format=json`,
  });

  const { monitors } = await response.json();
  return monitors;
};

const addNewMonitor = async (key, name, { monitorUrl }) => {
  const friendlyName = name + "-" + generateRandomString();
  const url = monitorUrl;
  const type = HTTPS_MONITOR_KEY;

  const response = await fetch(UPTIME_ROBOT_BASE_URL + NEW_MONITOR_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&friendly_name=${friendlyName}&url=${url}&type=${type}&format=json`,
  });

  const monitor = await response.json();

  console.log('response', monitor);

  return monitor;
}

module.exports = { getAccountDetails, addNewMonitor, getMonitors };
