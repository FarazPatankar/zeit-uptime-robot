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
  deleteAlertContact,
  getMonitors,
  addNewMonitor,
  deleteMonitor,
  pauseMonitor,
  resumeMonitor,
  getAllPSPs,
  createNewPSP,
  editPSP
} = require('./lib/uptime-robot-api');
const { fetchUserProjects, fetchAliases } = require('./lib/zeit-api');
const { mapAliasToProjects, mapMonitorsToProjects } = require('./lib/utils');

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { clientState, action, user, team, project, configurationId } = payload;
  const store = await zeitClient.getMetadata();
  const ownerSlug = team ? team.slug : user.username;
  console.log('clientState', clientState);
  console.log('action', action);

  let contentToRender = ``;

  // Handle new key addition and existing key removal.
  if (action === 'submitKey') setMetadata(zeitClient, store, clientState);
  if (action === 'resetKey') resetMetadata(zeitClient, store);

  // Check if we have a key and ask for one if we don't.
  if (!store.uptimeRobotKey) {
    console.log('No key found. Showing form.');
    contentToRender = keyForm;
    return contentToRender;
  }
  console.log('Proceeding as we found a key.');

  // Handling contact actions
  if (action === "addContact") await addAlertContact(store.uptimeRobotKey, clientState.contactToBeAdded);
  if (action.match(/^deleteAlertContact-/)) {
    const match = action.match(/deleteAlertContact-(.*)/);
    if(match) {
      const contactId = match[1];
      await deleteAlertContact(store.uptimeRobotKey, contactId);
    }
  }

  console.log('Fetching Account Details')
  const accountDetails = await getAccountDetails(store.uptimeRobotKey);

  console.log('Fetching monitors');
  let monitors = await getMonitors(store.uptimeRobotKey);

  console.log('Fetching PSPs');
  const psps = await getAllPSPs(store.uptimeRobotKey);

  console.log('Fetching alert contacts');
  alertContacts = await getAlertContacts(store.uptimeRobotKey);

  if (project) {
    let error = null;
    if (action === 'addMonitor') {
      const response = await addNewMonitor(store.uptimeRobotKey, project.name, clientState, alertContacts);
      if (response.stat === 'fail') error = response.error;
    }
    if (action.match(/^deleteMonitor-/)) {
      const match = action.match(/deleteMonitor-(.*)/);
      if(match) {
        const monitorId = match[1];
        await deleteMonitor(store.uptimeRobotKey, monitorId);
      }
    }
    if (action.match(/^pauseMonitor-/)) {
      const match = action.match(/pauseMonitor-(.*)/);
      if(match) {
        const monitorId = match[1];
        await pauseMonitor(store.uptimeRobotKey, monitorId);
      }
    }
    if (action.match(/^resumeMonitor-/)) {
      const match = action.match(/resumeMonitor-(.*)/);
      if(match) {
        const monitorId = match[1];
        await resumeMonitor(store.uptimeRobotKey, monitorId);
      }
    }

    // TODO: Find a better way to do this.
    // monitors = await getMonitors(store.uptimeRobotKey);
    
    const aliases = await fetchAliases(zeitClient);
    const projectsWithAliases = mapAliasToProjects(aliases, Array.of(project));

    const projectMonitors = monitors.filter(monitor => monitor.friendly_name.includes(project.name));

    // PSP
    let pspForProject = psps.find(psp => psp.friendly_name === `${project.name} Status Page`);
    if (pspForProject) {
      if(projectMonitors.length !== pspForProject.monitors.length) {
        console.log('here', pspForProject, projectMonitors.length)
        const pspId = await editPSP(store.uptimeRobotKey, pspForProject.id, projectMonitors);
        pspForProject = psps.find(psp => psp.id === pspId);
      }
    } else {
      pspForProject = await createNewPSP(store.uptimeRobotKey, project.name, projectMonitors);
    }
    const pspLinkForProject = pspForProject ? pspForProject.standard_url : null;
    
    contentToRender += monitorOverview(projectMonitors, project, pspLinkForProject);

    contentToRender += addMonitorForm(projectsWithAliases[0].alias, action, error);

    contentToRender += projectMonitors.map(monitor => monitorContainer(monitor)).join("\n")
  }

  // Check if the user is inside a project. If not, show list of projects.
  if (!project) {
    // console.log('Fetching account details');
    // Show the user an overview of their monitors.
    const aliases = await fetchAliases(zeitClient);
    const projects = await fetchUserProjects(zeitClient);
    const projectsWithAliases = mapAliasToProjects(aliases, projects);
    const projectsWithMonitors = mapMonitorsToProjects(monitors, projectsWithAliases);

    // Fetching all contacts
    let buttonAction = "initiateContactAddition";
    let contactsContent = ``;
    let contactsHeader = ``;
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
          ${alertContacts.map(contact => contactContainer(contact, accountDetails)).join("\n")}
        </Box>
      `;
    }

    // PSP
    let pspForProject = psps.find(psp => psp.friendly_name === "All Monitors Status Page");
    if (!pspForProject) {
      pspForProject = await createNewPSP(store.uptimeRobotKey, 'All Monitors', 0);
    }
    const pspLink = pspForProject.standard_url;
    
    contentToRender += monitorOverview(monitors, project, pspLink);

    // <Box color="#3da63c">Please click the link in the confirmation email to activate the new addition.</Box>
    contentToRender += `
      <Box>
        ${contactsHeader}
        <Box display="flex">
          ${contactsContent}
          <Box display="flex" margin-left="10px" align-items="flex-end">
            <Button highlight action="${buttonAction}">Add Contact</Button>
          </Box>
        </Box>
      </Box>
      <BR />
    `
    contentToRender += `
      <Box>
        <H2>Projects: </H2>
        <Box>
          ${projectsWithMonitors.map(project => {
            return projectContainer(project, ownerSlug, configurationId);
          }).join("\n")}
        </Box>
      </Box>
    `;
  }

  // <H1>Hey, ${payload.user.name}</H1>
  return `
    <Page>
      <BR />
      ${contentToRender}
    </Page>
  `;
})
