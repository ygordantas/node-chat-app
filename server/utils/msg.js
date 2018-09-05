generateMsg = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

generateLocationMsg = (from, lat, lon) => {
  return {
    from,
    url: `http://google.com/maps?q=${lat},${lon}`,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMsg,
  generateLocationMsg
};
