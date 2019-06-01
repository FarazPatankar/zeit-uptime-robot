const mapAliasToProjects = (aliases, projects) => {
  const mappedProjects = projects.map(project => {
    project['alias'] = "https://" + aliases.find(singleAlias => singleAlias.projectId === project.id).alias;
    return project;
  })

  // console.log('mappedProjects', mappedProjects);
  return mappedProjects;
}

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 7);
}

module.exports = { mapAliasToProjects, generateRandomString };
