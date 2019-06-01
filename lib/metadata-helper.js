const setMetadata = async (client, store, state) => {
  console.log('Setting the key');
  store.uptimeRobotKey = state.uptimeRobotKey;
  await client.setMetadata(store);
};

const resetMetadata = async (client, store) => {
  console.log('Resetting the key');
  store.uptimeRobotKey = '';
  await client.setMetadata(store);
};

module.exports = { setMetadata, resetMetadata };
