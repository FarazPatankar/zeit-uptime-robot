const { htm } = require('@zeit/integration-utils');
const { MONITOR_STASUSES } = require('./constants');

const keyForm = `
  <Container>
    <Input label="Uptime Robot Key" name="uptimeRobotKey" value="" />
  </Container>
  <Container>
    <Button action="submit">Submit</Button>
  </Container>
`;

const projectContainer = (project, ownerSlug, configurationId) => {
  const projectHref = `https://zeit.co/${encodeURIComponent(ownerSlug)}/${encodeURIComponent(project.name)}/integrations/${encodeURIComponent(configurationId)}`
  return `
    <Box background-color="#fff" border="1px solid #eee" margin="10px 0" padding="25px">
      <H2>
        <Link href="${projectHref}">
          <Box color="#000">${project.name}</Box>
        </Link>
      </H2>
        <Link href="${project.alias}">${project.alias}</Link>
    </Box>
    `
}

const monitorOverview = monitors => {
  let upMonitors, downMonitors, pausedMonitors;
  upMonitors = downMonitors = pausedMonitors = 0;

  monitors.forEach(monitor => {
    if (monitor.status === MONITOR_STASUSES.UP) upMonitors += 1;
    if (monitor.status === MONITOR_STASUSES.DOWN) downMonitors += 1;
    if (monitor.status === MONITOR_STASUSES.PAUSED) pausedMonitors += 1;
  })

  const endString = monitors.length === 1 ? 'monitor for your project.' : 'monitors for all your projects.'

  return `
    <H2>
      You're currently using ${upMonitors +
        downMonitors +
        pausedMonitors} ${endString}
    </H2>
    <Box display="flex" justify-content="space-between">
      <Box width="33%" text-align="center"><Notice type="success">UP MONITORS: ${upMonitors}</Notice></Box>
      <Box width="33%" text-align="center"><Notice type="error">DOWN MONITORS: ${downMonitors}</Notice></Box>
      <Box width="33%" text-align="center"><Notice type="warn">PAUSED MONITORS: ${pausedMonitors}</Notice></Box>
    </Box>
    <BR />
  `;
};

const addMonitorForm = alias => `
  <Box display="flex">
    <Box flex="2">
      <Input width="100%" label="Monitor URL" name="monitorUrl" value="${alias}" />
    </Box>
    <Box display="flex" align-items="flex-end" margin-left="10px">
      <Button action="addMonitor">Add Monitor</Button>
    </Box>
  </Box>
`

const monitorContainer = monitor => {
  const monitorStatusAction = monitor.status === MONITOR_STASUSES.PAUSED  ? 'resumeMonitor' : 'pauseMonitor';
  const monitorStatusText = monitor.status === MONITOR_STASUSES.PAUSED  ? 'Resume' : 'Pause';
  console.log(monitor);

  return `
    <Box background-color="#fff" border="1px solid #eee" margin="10px 0" padding="25px">
      <Box display="flex">
        <Box flex="2">
          <H2>${monitor.friendly_name}</H2>
          <Link href="${monitor.url}"><Box color="#718096">${monitor.url}</Box></Link>
        </Box>
        <Box>
          <Box display="none">
            <Input type="hidden" name="monitorUrl" value="${monitor.url}" />
          </Box>
          <Button action="${monitorStatusAction}">${monitorStatusText}</Button>
          <Button action="deleteMonitor">Delete</Button>
        </Box>
      </Box>
    </Box>
  `
}

module.exports = { keyForm, projectContainer, monitorOverview, addMonitorForm, monitorContainer };
