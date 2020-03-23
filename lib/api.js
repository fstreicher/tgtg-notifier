const axios = require('axios');


/**
 * @deprecated use getFavorites() instead
 */
function getItem(branch = '41949i2632644') {
  const options = {
    baseURL: 'https://apptoogoodtogo.com',
    url: `/api/item/v3/${branch}`,
    method: 'POST',
    headers: {
      'Authorization': process.env.TGTG_AUTH_TOKEN,
      'Content-Type': 'application/json',
      'User-Agent': 'TooGoodToGo/20.2.0 (740) (iPhone/iPhone X (GSM); iOS 13.3.1; Scale/3.00)'
    },
    data: {
      user_id: process.env.TGTG_USER_ID,
      origin: {
        latitude: process.env.TGTG_USER_ORIGIN.split(',')[0],
        longitude: process.env.TGTG_USER_ORIGIN.split(',')[1]
      }
    }
  };

  return axios(options);
}

function getFavorites() {
  const options = {
    baseURL: 'https://apptoogoodtogo.com',
    url: '/api/item/v4/',
    method: 'POST',
    headers: {
      'Authorization': process.env.TGTG_AUTH_TOKEN,
      'Content-Type': 'application/json',
      'User-Agent': 'TooGoodToGo/20.2.0 (740) (iPhone/iPhone X (GSM); iOS 13.3.1; Scale/3.00)'
    },
    data: {
      user_id: process.env.TGTG_USER_ID,
      origin: {
        latitude: process.env.TGTG_USER_ORIGIN.split(',')[0],
        longitude: process.env.TGTG_USER_ORIGIN.split(',')[1]
      },
      radius: 0,
      favorites_only: true
    }
  };

  return axios(options);
}

module.exports.getItem = getItem;
module.exports.getFavorites = getFavorites;
