const mapAliasToProjects = (aliases, projects) => {
  const mappedProjects = projects.map(project => {
    project['alias'] = aliases.find(singleAlias => singleAlias.projectId === project.id).alias;
    return project;
  })

  console.log('mappedProjects', mappedProjects);
  return mappedProjects;
}

module.exports = { mapAliasToProjects };
