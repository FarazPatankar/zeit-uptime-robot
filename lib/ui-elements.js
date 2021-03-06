const { HOST, MONITOR_STASUSES } = require('./constants');

const noProjectsMessage = ownerSlug => `
  <Page>
    <BR />
    <BR />
    <Box background-color="#fff" border="1px solid #eee" padding="15px" border-radius="5px">
      <Box font-size="16px">
        Looks like you have no projects on this account. You can add new projects from the
        <Link href="https://zeit.co/dashboard/${ownerSlug}/projects">projects</Link> tab.
      </Box>
    </Box>
  </Page>
`

const keyForm = `
  <Page>
    <BR />
    <BR />
    <Box width="100%" display="flex" justifyContent="center">
      <Img src="${HOST}assets/logo-with-text.svg" width="35%" />
    </Box>
    <BR />
    <BR />
    <Box width="100%" display="flex" justifyContent="center" >
      <Box maxWidth="500px">
        <Fieldset>
          <FsContent>
            <FsSubtitle>To get started please <Link target="_blank" href="https://uptimerobot.com">create an account.</Link> After creating an account you can copy your <Link target="_blank" href="https://uptimerobot.com/dashboard.php#mySettings">Main API Key,</Link> which is used to connect to your <B>Uptime Robot</B> account.</FsSubtitle>
            <Input type="password" label="Main API Key" name="uptimeRobotKey" value="" width="100%"  />
          </FsContent>
          <FsFooter>
            <Box width="100%" display="flex" justifyContent="flex-end">
              <Button small highlight action="submitKey">Connect</Button>
            </Box>
          </FsFooter>
        </Fieldset>
      </Box>
    </Box>
  </Page>
`;

const projectContainer = (project, ownerSlug, configurationId) => {
  const projectHref = `https://zeit.co/${encodeURIComponent(ownerSlug)}/${encodeURIComponent(project.name)}/integrations/${encodeURIComponent(configurationId)}`
  let aliasContainer = `
    <Box>
      <Link href="${project.alias}" target="_blank">
        <Box display="flex" align-items="center">
          <Box color="#718096">${project.alias}</Box>
          <Box marginLeft="7px" marginBottom="-1px">
            <Img src="${HOST}assets/link.png" height="13" width="13" />
          </Box>
        </Box>
      </Link>
    </Box>
  `

  if (!project.alias) aliasContainer = '';
  return `
    <Box background-color="#fff" border="1px solid #eee" margin="15px 0" border-radius="5px">
      <Box border-bottom="1px solid #eee" padding="15px 25px">
        <Box display="flex" justify-content="space-between">
          <Box margin-bottom="0">
            <H2>
              <Link href="${projectHref}">
                <Box color="#000">${project.name}</Box>
              </Link>
            </H2>
          </Box>
          <Box display="flex">
            <Box padding="5px" border-radius="5px" font-weight="600" text-transform="uppercase" color="#fff" font-size="12px" margin-right="5px" background-color="#3da63c">
              <Box>${project.monitorCount.up} monitors</Box>
            </Box>
            <Box padding="5px" border-radius="5px" font-weight="600" text-transform="uppercase" color="#fff" font-size="12px" margin-right="5px" background-color="#ECA420">
              ${project.monitorCount.paused} monitors
            </Box>
            <Box padding="5px" border-radius="5px" font-weight="600" text-transform="uppercase" color="#fff" font-size="12px" margin-right="5px" background-color="#EA5757">
              ${project.monitorCount.down} monitors
            </Box>
          </Box>
        </Box>
        ${aliasContainer}
      </Box>
    </Box>
  `
}

const monitorOverview = (monitors, project, pspLink, configurationId = null, ownerSlug = null) => {
  let upMonitors, downMonitors, pausedMonitors;
  upMonitors = downMonitors = pausedMonitors = 0;

  monitors.forEach(monitor => {
    if (monitor.status === MONITOR_STASUSES.UP) upMonitors += 1;
    if (monitor.status === MONITOR_STASUSES.DOWN) downMonitors += 1;
    if (monitor.status === MONITOR_STASUSES.PAUSED) pausedMonitors += 1;
  })

  const endString = project ? `monitors for ${project.name}.` : 'monitors for all your projects.'

  let linkToPsp = `
    <Link href="${pspLink}" target="_blank">
      <Box display="flex" align-items="center" margin-left="10px">
        <Box color="#718096">Public Status Page</Box>
        <Box marginLeft="5px" display="flex" align-items="center">
          <Img src="${HOST}assets/link.png" width="13" />
        </Box>
      </Box>
    </Link>
  `;

  let linkContainer, backButton;
  linkContainer = linkToPsp;
  if (!project) linkContainer = `<Box display="flex"><ProjectSwitcher />${linkToPsp}</Box>`;
  if (!pspLink) linkContainer = '';

  if (project && configurationId && ownerSlug) {
    backButton = `<Box margin-bottom="10px"><Link href="https://zeit.co/dashboard/${encodeURIComponent(ownerSlug)}/integrations/${encodeURIComponent(configurationId)}">← Account View</Link></Box>`
  }

  return `
    ${backButton || ''}
    <Box display="flex" justify-content="space-between">
      <Box margin-bottom="0">
        <H2>
          You're currently using ${upMonitors + downMonitors + pausedMonitors} ${endString}
        </H2>
      </Box>
      ${linkContainer}
    </Box>
    <Box display="flex" justify-content="space-between" font-weight="600" margin-top="10px">
      <Box width="33%" text-align="center"><Notice type="success">UP MONITORS: ${upMonitors}</Notice></Box>
      <Box width="33%" text-align="center"><Notice type="warn">PAUSED MONITORS: ${pausedMonitors}</Notice></Box>
      <Box width="33%" text-align="center"><Notice type="error">DOWN MONITORS: ${downMonitors}</Notice></Box>
    </Box>
    <BR />
  `;
};

const addMonitorForm = (alias, action, error) => {
  let message = '';
  if (action === 'addMonitor') message = `<Box margin-left="10px" color="#3da63c">Sometimes it takes a while to provision a new monitor. Please refresh the page in a few seconds if it hasn't shown up.</Box>`
  if (error) message = `<Box text-transform="capitalize" margin-left="10px" color="#ea5757">${error.message}</Box>`
  return `
    <Box display="flex">
      <Box flex="2" display="flex">
        <Box>
          <Input width="100%" label="Monitor Name" name="monitorName" placeholder="Name" />
        </Box>
        <Box flex="2" margin-left="10px">
          <Input width="100%" label="Monitor URL" name="monitorUrl" value="${alias ? alias : ''}" />
        </Box>
      </Box>
      <Box display="flex" align-items="flex-end" margin-left="10px">
        <Button highlight action="addMonitor">Add Monitor</Button>
      </Box>
    </Box>
    ${message}
    <BR />
  `
}

const monitorContainer = monitor => {
  const monitorStatusAction = monitor.status === MONITOR_STASUSES.PAUSED  ? 'resumeMonitor' : 'pauseMonitor';
  const monitorStatusText = monitor.status === MONITOR_STASUSES.PAUSED  ? 'Resume' : 'Pause';
  const themeColor = monitor.status === MONITOR_STASUSES.PAUSED ? '#3da63c' : '#eca420';
  const monitorStatusImg = monitor.status === MONITOR_STASUSES.UP ? 'checkmark-circle.svg' : monitor.status === MONITOR_STASUSES.PAUSED ? 'pause-circle.svg' : 'alert-circle.svg';

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
                  <Img src="${HOST}assets/link.png" height="13" width="13" />
                </Box>
              </Box>
            </Link>
          </Box>

          <Box display="flex" justify-content="space-between" width="50%" margin-top="10px" font-weight="600">
            <Box display="flex" flex-direction="column">
              <Box color="#727272">Status</Box>
              <Box><Img src="${HOST}assets/${monitorStatusImg}" height="25px" width="25px" /></Box>
            </Box>
            <Box display="flex" flex-direction="column">
              <Box color="#727272">Response Times</Box>
              <Box>${Math.round(monitor.average_response_time)} ms</Box>
              </Box>
              <Box display="flex" flex-direction="column">
              <Box color="#727272">Uptime</Box>
              <Box>${Math.round(monitor.custom_uptime_ratio)}%</Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Button small themeColor="${themeColor}" action="${monitorStatusAction}-${monitor.id}">${monitorStatusText}</Button>
          <Button small warning action="deleteMonitor-${monitor.id}">Delete</Button>
        </Box>
      </Box>
    </Box>
  `
}

const contactContainer = (contact, { email }) => {
  let deleteActionContainer = `
    <Link display="flex" action="deleteAlertContact-${contact.id}">
      <Box color="#EA5757" font-weight="900">X</Box>
    </Link>
  `

  if(email === contact.value) deleteActionContainer = '';

  return `
    <Box display="flex" padding="5px 10px" border="1px solid #eee" border-radius="5px" background-color="#fff" margin-right="5px" margin-bottom="5px" display="flex" align-items="center" justify-content="center">
      <Box flex="2" margin-right="5px">${contact.friendly_name}</Box>
      ${deleteActionContainer}
    </Box>

  `
}

module.exports = {
  keyForm,
  projectContainer,
  monitorOverview,
  addMonitorForm,
  monitorContainer,
  contactContainer,
  noProjectsMessage
};
