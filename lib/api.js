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

  const res = await axios(options);
  return res.data;
}

module.exports.getItem = getItem;
