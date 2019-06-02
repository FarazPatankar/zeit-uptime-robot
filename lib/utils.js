const { MONITOR_STASUSES } = require('./constants');

const mapAliasToProjects = (aliases, projects) => {
  const mappedProjects = projects.map(project => {
    project['alias'] = "https://" + aliases.find(singleAlias => singleAlias.projectId === project.id).alias;
    return project;
  })

  return mappedProjects;
}

const mapMonitorsToProjects = (monitors, projects) => {
  const mappedProjects = projects.map(project => {
    const projectMonitors = monitors.filter(monitor => monitor.friendly_name.includes(project.name));
    project['monitorCount'] = { up: 0, down: 0, paused: 0 };

    projectMonitors.forEach(monitor => {
      if (monitor.status === MONITOR_STASUSES.UP) project['monitorCount']['up'] += 1;
      if (monitor.status === MONITOR_STASUSES.DOWN) project['monitorCount']['down'] += 1;
      if (monitor.status === MONITOR_STASUSES.PAUSED) project['monitorCount']['paused'] += 1;
    })

    return project;
  })

  return mappedProjects;
}

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 7);
}

const parseMonitorName = (name) => {
  return name.split(" ").join("-").toLowerCase();
}

module.exports = { mapAliasToProjects, mapMonitorsToProjects, generateRandomString, parseMonitorName };
