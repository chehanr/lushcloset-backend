/* eslint-disable camelcase */

module.exports = {
  /**
   * Returns an object of address components from Google geocoding data.
   * TODO: Write tests lmao!
   * @param  {Object}  geocodingData Geocoding data object.
   * @param  {Boolean} [appox=false] Return approximate location components.
   * @return {Object}                Address components object.
   */
  getAddressComponents(geocodingData, appox = false) {
    const componentsObj = {};

    for (
      let index = 0;
      index < geocodingData.address_components.length;
      index += 1
    ) {
      const element = geocodingData.address_components[index];

      if (!appox) {
        if (element.types.includes('route')) {
          componentsObj.route = {
            long: element?.long_name,
            short: element?.short_name,
          };
        }
      }

      if (
        element.types.includes('sublocality') ||
        element.types.includes('locality')
      ) {
        componentsObj.city = {
          long: element?.long_name,
          short: element?.short_name,
        };
      }

      // if (element.types.includes('administrative_area_level_2')) {
      //   componentsObj.government = {
      //     long: element?.long_name,
      //     short: element?.short_name,
      //   };
      // }

      if (element.types.includes('administrative_area_level_1')) {
        componentsObj.state = {
          long: element?.long_name,
          short: element?.short_name,
        };
      }

      if (element.types.includes('country')) {
        componentsObj.country = {
          long: element?.long_name,
          short: element?.short_name,
        };
      }

      if (element.types.includes('postal_code')) {
        componentsObj.postalCode = {
          long: element?.long_name,
          short: element?.short_name,
        };
      }
    }

    return componentsObj;
  },

  /**
   * Returns a formatted address string for a address components object.
   * TODO: Write tests lmao!
   * @param  {Object} addressComponents Address components object.
   * @return {String}                   Formatted address.
   */
  getFormattedAddress(addressComponents) {
    let addressStr = '';

    if (addressComponents.route) {
      addressStr = addressStr.concat(addressComponents.route.long);
    }

    if (addressComponents.city) {
      if (addressStr !== '') {
        addressStr = addressStr.concat(', ');
      }
      addressStr = addressStr.concat(addressComponents.city.long);
    }

    if (addressComponents.state) {
      if (addressStr !== '') {
        addressStr = addressStr.concat(' ');
      }
      addressStr = addressStr.concat(addressComponents.state.short);
    }

    if (addressComponents.postalCode) {
      if (addressStr !== '') {
        addressStr = addressStr.concat(' ');
      }
      addressStr = addressStr.concat(addressComponents.postalCode.long);
    }

    if (addressComponents.country) {
      if (addressStr !== '') {
        addressStr = addressStr.concat(', ');
      }
      addressStr = addressStr.concat(addressComponents.country.long);
    }

    return addressStr;
  },
};
