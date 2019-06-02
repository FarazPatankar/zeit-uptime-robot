const fetch = require('node-fetch');

const {
  UPTIME_ROBOT_BASE_URL,
  ACCOUNT_DETAILS_URL,
  ALERT_CONTACTS_URL,
  ADD_CONTACT_URL,
  DELETE_CONTACT_URL,
  GET_MONITORS_URL,
  NEW_MONITOR_URL,
  DELETE_MONITOR_URL,
  PAUSE_MONITOR_URL,
  HTTPS_MONITOR_KEY,
  ALERT_CONTACT_TYPE_EMAIL
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

const getAlertContacts = async key => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + ALERT_CONTACTS_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&format=json`,
  });

  const { alert_contacts: alertContacts } = await response.json();
  
  // console.log('alertContacts', alertContacts);
  return alertContacts;
}

const addAlertContact = async (key, email) => {
  const type = ALERT_CONTACT_TYPE_EMAIL;
  const encodedEmail = encodeURIComponent(email);

  const response = await fetch(UPTIME_ROBOT_BASE_URL + ADD_CONTACT_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&friendly_name=${encodedEmail}&value=${encodedEmail}&type=${type}&format=json`,
  });

  const { alertcontact: alertContact } = await response.json();
  // const data = await response.json();
  
  console.log('add alert contact', alertContact);
  return alertContact;
}

const deleteAlertContact = async (key, id) => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + DELETE_CONTACT_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&id=${id}&format=json`,
  });

  const { alert_contact: alertContact } = await response.json();
  console.log('remove alert contact', alertContact);

  return alertContact;
}

const addNewMonitor = async (key, name, monitorUrl, alertContacts) => {
  const friendlyName = name + "-" + generateRandomString();
  const url = monitorUrl;
  const type = HTTPS_MONITOR_KEY;
  let alertContactsString = "";
  alertContacts.forEach((contact, index) => {
    alertContactsString += `${contact.id}_0_0`
    if (index !== (alertContacts.length - 1)) alertContactsString += '-'
  })

  const response = await fetch(UPTIME_ROBOT_BASE_URL + NEW_MONITOR_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&friendly_name=${friendlyName}&url=${url}&type=${type}&alert_contacts=${alertContactsString}&format=json`,
  });

  const monitor = await response.json();

  console.log('add', monitor);
  return monitor;
}

const deleteMonitor = async (key, monitorId) => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + DELETE_MONITOR_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&id=${monitorId}&format=json`,
  });

  const monitor = await response.json();
  console.log('delete', monitor);
  return monitor;
}

const pauseMonitor = async (key, monitorId) => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + PAUSE_MONITOR_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&id=${monitorId}&status=0&format=json`,
  });

  const monitor = await response.json();
  console.log('pause', monitor);
  return monitor;
}

const resumeMonitor = async (key, monitorId) => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + PAUSE_MONITOR_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&id=${monitorId}&status=1&format=json`,
  });

  const monitor = await response.json();
  console.log('resume', monitor);
  return monitor;
}

module.exports = { getAccountDetails, addNewMonitor, getMonitors, pauseMonitor, deleteMonitor, resumeMonitor, getAlertContacts, addAlertContact, deleteAlertContact };
