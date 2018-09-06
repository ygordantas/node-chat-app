const moment = require("moment");

generateMsg = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

generateLocationMsg = (from, lat, lon) => {
  return {
    from,
    url: `http://google.com/maps?q=${lat},${lon}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {
  generateMsg,
  generateLocationMsg
};
