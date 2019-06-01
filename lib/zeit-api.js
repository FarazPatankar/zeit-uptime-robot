const { PROJECTS_URL, AlIASES_URL } = require('./constants.js');

const fetchUserProjects = async client => {
  const projects = await client.fetchAndThrow(PROJECTS_URL, {
    method: 'GET',
  });
  // console.log('projects', projects);

  return projects;
};

const fetchAliases = async client => {
  const aliases = await client.fetchAndThrow(AlIASES_URL, {
    method: 'GET'
  });
  // console.log('aliases', aliases);

  return aliases.aliases;
}

module.exports = { fetchUserProjects, fetchAliases };
