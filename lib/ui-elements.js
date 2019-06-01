const { MONITOR_STASUSES } = require('./constants');

const svg = `
<svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="#fff" />
</svg>`

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
      <Box marginTop="-12px">
        <Link href="${project.alias}" target="_blank">
          <Box display="flex" align-items="center">
            <Box color="#718096">${project.alias}</Box>
            <Box marginLeft="7px" marginBottom="-1px">
              <Img src="http://localhost:5005/assets/link.png" height="13" width="13" />
            </Box>
          </Box>
        </Link>
      </Box>
      <Box display="flex" justify-content="space-around" margin-top="25px">
        <Box display="flex" flex-direction="column" text-align="center">
          <Box display="flex" align-items="center" justify-content="center" border="2px solid #3da63c" border-radius="100%" height="50px" width="50px" font-size="16px" font-weight="500">${project.monitorCount.up}</Box>
          <P>UP</P>
          </Box>
        <Box display="flex" flex-direction="column" text-align="center">
          <Box display="flex" align-items="center" justify-content="center" border="2px solid #ECA420" border-radius="100%" height="50px" width="50px" font-size="16px" font-weight="500">${project.monitorCount.paused}</Box>
          <P>PAUSED</P>
          </Box>
        <Box display="flex" flex-direction="column" text-align="center">
          <Box display="flex" align-items="center" justify-content="center" border="2px solid #EA5757" border-radius="100%" height="50px" width="50px" font-size="16px" font-weight="500">${project.monitorCount.down}</Box>
          <P>DOWN</P>
        </Box>
      </Box>
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
          <Box marginTop="-12px">
            <Link href="${monitor.url}" target="_blank">
              <Box display="flex" align-items="center">
                <Box color="#718096">${monitor.url}</Box>
                <Box marginLeft="7px" marginBottom="-1px">
                  <Img src="http://localhost:5005/assets/link.png" height="13" width="13" />
                </Box>
              </Box>
            </Link>
          </Box>
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
