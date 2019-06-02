const HOST = process.env.HOST || "http://localhost:5005/"

const PROJECTS_URL = '/v1/projects/list?limit=5';
const AlIASES_URL = '/v2/now/aliases';

const UPTIME_ROBOT_BASE_URL = 'https://api.uptimerobot.com/v2';
const ACCOUNT_DETAILS_URL = '/getAccountDetails';
const ALERT_CONTACTS_URL = '/getAlertContacts';
const ADD_CONTACT_URL = '/newAlertContact';
const DELETE_CONTACT_URL = '/deleteAlertContact';
const GET_MONITORS_URL = '/getMonitors';
const NEW_MONITOR_URL = '/newMonitor';
const DELETE_MONITOR_URL = '/deleteMonitor';
const PAUSE_MONITOR_URL = '/editMonitor';
const GET_PSPS_URL = '/getPSPs';
const NEW_PSP_URL = '/newPSP';
const EDIT_PSP_URL = '/editPSP';

const HTTPS_MONITOR_KEY = '1';
const ALERT_CONTACT_TYPE_EMAIL = '2';

const MONITOR_STASUSES = {
  'PAUSED': 0,
  'UP': 2,
  'DOWN': 9
}

module.exports = {
  HOST,
  PROJECTS_URL,
  AlIASES_URL,
  UPTIME_ROBOT_BASE_URL,
  ACCOUNT_DETAILS_URL,
  ALERT_CONTACTS_URL,
  GET_MONITORS_URL,
  NEW_MONITOR_URL,
  DELETE_MONITOR_URL,
  PAUSE_MONITOR_URL,
  HTTPS_MONITOR_KEY,
  MONITOR_STASUSES,
  ALERT_CONTACT_TYPE_EMAIL,
  ADD_CONTACT_URL,
  DELETE_CONTACT_URL,
  GET_PSPS_URL,
  NEW_PSP_URL,
  EDIT_PSP_URL,
};
