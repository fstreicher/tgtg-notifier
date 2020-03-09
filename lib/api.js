const axios = require('axios');

async function getItem(branch = '41949i2632644') {
  const options = {
    baseURL: 'https://apptoogoodtogo.com',
    url: `/api/item/v3/${branch}`,
    method: 'POST',
    headers: {
      'Authorization': process.env.TGTG_AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    data: {
      'user_id': process.env.TGTG_USER_ID,
      'origin': {
        'latitude': process.env.TGTG_USER_ORIGIN.split(',')[0],
        'longitude': process.env.TGTG_USER_ORIGIN.split(',')[1]
      }
    }
  };

  let res = {};

  try {
    res = await axios(options)
      .catch(e => {
        console.error(`Catch:\n\t${e}\n\t${e.response.status}`);
        res = { status: e.response.status };
      });
    console.info(`RES: ${res}`);
    return { status: res.status, data: res.data || {} };
  } catch (e) {
    console.error(`Name: ${e.name}`);
    console.error(`Message: ${e.message}`);
    return { status: 401, data: {} };
  }
}

module.exports.getItem = getItem;
