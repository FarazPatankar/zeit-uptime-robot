const { withUiHook } = require('@zeit/integration-utils');

const {
  keyForm,
  projectContainer,
  monitorOverview,
  addMonitorForm,
  monitorContainer,
  contactContainer
} = require('./lib/ui-elements');
const { setMetadata, resetMetadata } = require('./lib/metadata-helper');
const {
  getAccountDetails,
  getAlertContacts,
  addAlertContact,
  getMonitors,
  addNewMonitor,
  deleteMonitor,
  pauseMonitor,
  resumeMonitor
} = require('./lib/uptime-robot-api');
const { fetchUserProjects, fetchAliases } = require('./lib/zeit-api');
const { mapAliasToProjects, mapMonitorsToProjects } = require('./lib/utils');

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { clientState, action, user, team, project, configurationId } = payload;
  const store = await zeitClient.getMetadata();
  const ownerSlug = team ? team.slug : user.username;
  console.log('payload', payload);

  let contentToRender = ``;

  // Handle new key addition and existing key removal.
  if (action === 'submit') setMetadata(zeitClient, store, clientState);
  if (action === 'reset') resetMetadata(zeitClient, store);

  // Check if we have a key and ask for one if we don't.
  if (!store.uptimeRobotKey) {
    console.log('No key found. Showing form.');
    contentToRender = keyForm;
    return `
      <Page>
        <H1>Hey, ${payload.user.name}</H1>
        ${contentToRender}
      </Page>
    `;
  }
  console.log('Proceeding as we found a key.');

  // Fetching all monitors
  console.log('Fetching monitors');
  let monitors = await getMonitors(store.uptimeRobotKey);

  console.log('Fetching alert contacts');
  alertContacts = await getAlertContacts(store.uptimeRobotKey);

  if (project) {
    if (action === 'addMonitor') await addNewMonitor(store.uptimeRobotKey, project.name, clientState.monitorUrl, alertContacts);
    if (action === 'deleteMonitor') {
      const monitor = monitors.find(monitor => monitor.url === clientState.monitorToUpdate);
      await deleteMonitor(store.uptimeRobotKey, monitor.id);
    }
    if (action === 'pauseMonitor') {
      const monitor = monitors.find(monitor => monitor.url === clientState.monitorToUpdate);
      await pauseMonitor(store.uptimeRobotKey, monitor.id);
    }
    if (action === 'resumeMonitor') {
      const monitor = monitors.find(monitor => monitor.url === clientState.monitorToUpdate);
      await resumeMonitor(store.uptimeRobotKey, monitor.id);
    }

    // TODO: Find a better way to do this.
    // monitors = await getMonitors(store.uptimeRobotKey);
    
    const aliases = await fetchAliases(zeitClient);
    const projectsWithAliases = mapAliasToProjects(aliases, Array.of(project));

    const projectMonitors = monitors.filter(monitor => monitor.friendly_name.includes(project.name));
    // console.log(projectMonitors);

    contentToRender += monitorOverview(projectMonitors, project);

    contentToRender += addMonitorForm(projectsWithAliases[0].alias, action);

    contentToRender += projectMonitors.map(monitor => monitorContainer(monitor)).join("\n")
  }

  // Check if the user is inside a project. If not, show list of projects.
  if (!project) {
    // console.log('Fetching account details');
    // Show the user an overview of their monitors.
    // const accountDetails = await getAccountDetails(store.uptimeRobotKey);
    contentToRender += monitorOverview(monitors, project);
    const aliases = await fetchAliases(zeitClient);
    const projects = await fetchUserProjects(zeitClient);
    const projectsWithAliases = mapAliasToProjects(aliases, projects);
    const projectsWithMonitors = mapMonitorsToProjects(monitors, projectsWithAliases);

    // Fetching all contacts
    let buttonAction = "initiateContactAddition";
    let contactsContent = ``;
    let contactsHeader = ``;
    if (action === "addContact") await addAlertContact(store.uptimeRobotKey, clientState.contactToBeAdded);
    if (action === "initiateContactAddition") {
      buttonAction = "addContact";
      contactsContent = `
        <Box flex="2" display="flex" flex-direction="column">
          <Input placeholder="example@email.com" width="100%" label="Add Contact Email" name="contactToBeAdded" value="" />
        </Box>
      `;
    } else {
      contactsHeader = `<Box margin-right="5px" font-weight="500"><P>Alert Contacts:</P></Box>`;
      contactsContent = `
        <Box flex="2" display="flex" flex-wrap="wrap">
          ${alertContacts.map(contact => contactContainer(contact)).join("\n")}
        </Box>
      `;
    }
    // <Box color="#3da63c">Please click the link in the confirmation email to activate the new addition.</Box>
    contentToRender += `
      <Box>
        ${contactsHeader}
        <Box display="flex">
          ${contactsContent}
          <Box display="flex" margin-left="10px" align-items="flex-end">
            <Button action="${buttonAction}">Add Contact</Button>
          </Box>
        </Box>
      </Box>
      <BR />
    `
    contentToRender += `
      <Box>
        <H2>Projects: </H2>
        <Box>
          ${projectsWithMonitors.map(project => projectContainer(project, ownerSlug, configurationId) ).join("\n")}
        </Box>
      </Box>
    `;
  }

  return `
    <Page>
      <H1>Hey, ${payload.user.name}</H1>
      <BR />
      ${contentToRender}
    </Page>
  `;
})
