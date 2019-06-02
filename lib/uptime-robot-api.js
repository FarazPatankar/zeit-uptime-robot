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
  ALERT_CONTACT_TYPE_EMAIL,
  GET_PSPS_URL,
  NEW_PSP_URL,
  EDIT_PSP_URL
} = require('./constants.js');

const { parseMonitorName } = require('./utils');

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
    body: `api_key=${key}&response_times=1&response_times_limit=1&custom_uptime_ratios=1&format=json`,
  });

  const { monitors } = await response.json();
  // const data = await response.json();
  console.log('monitors', monitors);

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

const addNewMonitor = async (key, name, { monitorName, monitorUrl }, alertContacts) => {
  const friendlyName = name + "-" + parseMonitorName(monitorName);
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

const getAllPSPs = async key => {
  const response = await fetch(UPTIME_ROBOT_BASE_URL + GET_PSPS_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&format=json`,
  });

  const allPSPs = await response.json();
  // console.log('allPSPs', allPSPs);
  return allPSPs.psps;
};

const createNewPSP = async (key, projectName, projectMonitors = []) => {
  const monitorsForProject = projectMonitors === []
    ? projectMonitors.map(monitor => monitor.id).join("-")
    : '0';

  const response = await fetch(UPTIME_ROBOT_BASE_URL + NEW_PSP_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&friendly_name=${projectName} Status Page&type=${HTTPS_MONITOR_KEY}&monitors=${monitorsForProject}&format=json`,
  });

  const { psp } = await response.json();
  console.log('create psp', psp);
  return psp;
};

const editPSP = async (key, pspId, projectMonitors) => {
  const monitorsForProject = projectMonitors
    .map(monitor => monitor.id)
    .join("-");

  const response = await fetch(UPTIME_ROBOT_BASE_URL + EDIT_PSP_URL, {
    headers,
    method: 'POST',
    body: `api_key=${key}&id=${pspId}&monitors=${monitorsForProject}&format=json`,
  });

  const { psp } = await response.json();
  console.log('edit psp', psp);
  return Number(psp.id);
};

module.exports = { 
  getAccountDetails,
  addNewMonitor,
  getMonitors,
  pauseMonitor,
  deleteMonitor,
  resumeMonitor,
  getAlertContacts,
  addAlertContact,
  deleteAlertContact,
  getAllPSPs,
  createNewPSP,
  editPSP,
};
