const { Client } = require('@googlemaps/google-maps-services-js');
const serverConfig = require('../configs/server');
const logger = require('../loaders/winston');

module.exports = {
  /**
   * Returns Google Maps geocoding results.
   * @param  {String} address Address string.
   * @return {Array}          Geocoding array.
   */
  getGeocodingData: async (address) => {
    const client = new Client({});

    const res = await client.geocode({
      params: {
        address: address,
        key: serverConfig.googleMapsApiKey,
      },
    });

    if (['OK', 'ZERO_RESULTS'].some((val) => res.data.status === val)) {
      return res.data.results;
    }

    logger.error('Google Maps geocoding error occurred');

    return [];
  },
};
