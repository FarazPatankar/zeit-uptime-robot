const { htm } = require('@zeit/integration-utils');

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

const monitorOverview = details => {
  const {
    up_monitors: upMonitors,
    down_monitors: downMonitors,
    paused_monitors: pausedMonitors,
    monitor_limit: monitorLimit,
  } = details;
  return `
    <H2>
      You're currently using ${upMonitors +
        downMonitors +
        pausedMonitors} of the ${monitorLimit} available monitors.
    </H2>
    <Box display="flex" justify-content="space-between">
      <Box width="33%" text-align="center"><Notice type="success">UP MONITORS: ${upMonitors}</Notice></Box>
      <Box width="33%" text-align="center"><Notice type="error">DOWN MONITORS: ${downMonitors}</Notice></Box>
      <Box width="33%" text-align="center"><Notice type="warn">PAUSED MONITORS: ${pausedMonitors}</Notice></Box>
    </Box>
    <BR />
  `;
};

module.exports = { keyForm, projectContainer, monitorOverview };
