const { MONITOR_STASUSES } = require('./constants');

const keyForm = `
  <Container>
    <Input label="Uptime Robot Key" name="uptimeRobotKey" value="" />
  </Container>
  <Container>
    <Button action="submit">Submit</Button>
  </Container>
`;
{/* <Box display="flex" justify-content="space-around" margin-top="25px" font-weight="500">
<Box display="flex" flex-direction="column" text-align="center">
  <Box display="flex" align-items="center" justify-content="center" border="2px solid #3da63c" border-radius="100%" height="50px" width="50px" font-size="16px">${project.monitorCount.up}</Box>
  <P>UP</P>
  </Box>
<Box display="flex" flex-direction="column" text-align="center">
  <Box display="flex" align-items="center" justify-content="center" border="2px solid #ECA420" border-radius="100%" height="50px" width="50px" font-size="16px">${project.monitorCount.paused}</Box>
  <P>PAUSED</P>
  </Box>
<Box display="flex" flex-direction="column" text-align="center">
  <Box display="flex" align-items="center" justify-content="center" border="2px solid #EA5757" border-radius="100%" height="50px" width="50px" font-size="16px">${project.monitorCount.down}</Box>
  <P>DOWN</P>
</Box>
</Box> */}

const projectContainer = (project, ownerSlug, configurationId) => {
  const projectHref = `https://zeit.co/${encodeURIComponent(ownerSlug)}/${encodeURIComponent(project.name)}/integrations/${encodeURIComponent(configurationId)}`
  return `
    <Box background-color="#fff" border="1px solid #eee" margin="10px 0" border-radius="px">
      <Box border-bottom="1px solid #eee" padding="15px 25px">
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
      </Box>
      <Box background-color="#fafafa" padding="10px 25px" display="flex">
        <Box padding="5px" border-radius="5px" font-weight="600" text-transform="uppercase" color="#fff" font-size="12px" margin-right="5px" background-color="#3da63c">${project.monitorCount.up} monitors</Box>
        <Box padding="5px" border-radius="5px" font-weight="600" text-transform="uppercase" color="#fff" font-size="12px" margin-right="5px" background-color="#ECA420">${project.monitorCount.paused} monitors</Box>
        <Box padding="5px" border-radius="5px" font-weight="600" text-transform="uppercase" color="#fff" font-size="12px" margin-right="5px" background-color="#EA5757">${project.monitorCount.down} monitors</Box>
      </Box>
    </Box>
    `
}

const monitorOverview = (monitors, project) => {
  let upMonitors, downMonitors, pausedMonitors;
  upMonitors = downMonitors = pausedMonitors = 0;

  monitors.forEach(monitor => {
    if (monitor.status === MONITOR_STASUSES.UP) upMonitors += 1;
    if (monitor.status === MONITOR_STASUSES.DOWN) downMonitors += 1;
    if (monitor.status === MONITOR_STASUSES.PAUSED) pausedMonitors += 1;
  })

  const endString = project ? 'monitors for your project.' : 'monitors for all your projects.'

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

const addMonitorForm = (alias, action) => `
  <Box display="flex">
    <Box flex="2">
      <Input width="100%" label="Monitor URL" name="monitorUrl" value="${alias}" />
    </Box>
    <Box display="flex" align-items="flex-end" margin-left="10px">
      <Button action="addMonitor">Add Monitor</Button>
    </Box>
  </Box>
  ${action === 'addMonitor' ? `<Box margin-left="10px" color="#3da63c">Sometimes it takes a while to provision a new monitor. Please refresh the page in a few seconds if it hasn't shown up.</Box>` : ''}
  <BR />
`

const monitorContainer = monitor => {
  const monitorStatusAction = monitor.status === MONITOR_STASUSES.PAUSED  ? 'resumeMonitor' : 'pauseMonitor';
  const monitorStatusText = monitor.status === MONITOR_STASUSES.PAUSED  ? 'Resume' : 'Pause';
  const themeColor = monitor.status === MONITOR_STASUSES.PAUSED ? '#3da63c' : '#eca420';

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
            <Input type="hidden" name="monitorToUpdate" value="${monitor.url}" />
          </Box>
          <Button themeColor="${themeColor}" action="${monitorStatusAction}">${monitorStatusText}</Button>
          <Button themeColor="#ea5757" action="deleteMonitor">Delete</Button>
        </Box>
      </Box>
    </Box>
  `
}

const contactContainer = contact => `
  <Box padding="5px 10px" border="1px solid #eee" border-radius="5px" background-color="#fff" margin-right="5px" margin-bottom="5px" display="flex" align-items="center" justify-content="center">
    ${contact.friendly_name}
  </Box>
`

module.exports = { keyForm, projectContainer, monitorOverview, addMonitorForm, monitorContainer, contactContainer };
