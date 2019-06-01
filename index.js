const { withUiHook } = require('@zeit/integration-utils');

const {
  keyForm,
  projectContainer,
  monitorOverview,
  addMonitorForm,
  monitorContainer
} = require('./lib/ui-elements');
const { setMetadata, resetMetadata } = require('./lib/metadata-helper');
const {
  getAccountDetails,
  getMonitors,
  addNewMonitor,
  deleteMonitor,
  pauseMonitor
} = require('./lib/uptime-robot-api');
const { fetchUserProjects, fetchAliases } = require('./lib/zeit-api');
const { mapAliasToProjects } = require('./lib/utils');

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
  if (project) {
    if (action === 'addMonitor') await addNewMonitor(store.uptimeRobotKey, project.name, clientState);
    const monitors = await getMonitors(store.uptimeRobotKey)
    const aliases = await fetchAliases(zeitClient);
    const mappedProjects = mapAliasToProjects(aliases, Array.of(project));

    const projectMonitors = monitors.filter(monitor => monitor.friendly_name === project.name);
    
    // Monitor based actions
    if (action === 'addMonitor') await addNewMonitor(store.uptimeRobotKey, mappedProjects[0]);
    if (action === 'deleteMonitor') await deleteMonitor(store.uptimeRobotKey, projectMonitors[0]);
    if (action === 'pauseMonitor') await pauseMonitor(store.uptimeRobotKey, projectMonitors[0]);

    const projectMonitors = monitors.filter(monitor => monitor.friendly_name.includes(project.name));

    contentToRender += monitorOverview(projectMonitors);

    contentToRender += addMonitorForm(mappedProjects[0].alias);
    contentToRender += `
      <Button action="pauseMonitor">Pause Monitor</Button>
      <Button action="deleteMonitor">Delete Monitor</Button>
    `

    contentToRender += projectMonitors.map(monitor => monitorContainer(monitor)).join("\n")
  }

  
  // Check if the user is inside a project. If not, show list of projects.
  if (!project) {
    const monitors = await getMonitors(store.uptimeRobotKey)
    console.log('Fetching account details');
    // Show the user an overview of their monitors.
    // const accountDetails = await getAccountDetails(store.uptimeRobotKey);
    contentToRender += monitorOverview(monitors);
    const aliases = await fetchAliases(zeitClient);
    const projects = await fetchUserProjects(zeitClient);
    const mappedProjects = mapAliasToProjects(aliases, projects);
    contentToRender += `
      <Box>
        <H2>Projects: </H2>
        <Box>
          ${mappedProjects.map(project => projectContainer(project, ownerSlug, configurationId) ).join("\n")}
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
