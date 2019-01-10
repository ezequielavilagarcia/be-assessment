const axios = require('axios');
const { POLICIES_URL } = require('../utils/url.constants.js');
const { toLowerCase } = require('../utils/string.helper');

class Policy {
  /**
   * It is used to request to external API all the policies
   *
   * @static
   * @returns Policy[]
   * @memberof Policy
   */
  static async getPolicies() {
    try {
      const response = await axios.get(POLICIES_URL);
      const policies = response.data.policies;
      return policies;
    } catch (err) {
      const error = new Error('Could not get ' + POLICIES_URL + ' try again later');
      error.statusCode = 500;
      throw error;
    }
  }

  /**
   * Is used to find any Policy by any property, it receives an object which the key is the property to search,
   * and the value is the value to search ex: { clientId: '55188Aasdasd785'}. If the object has multiple keys,
   * it will work like OR, but up to now multiple keys is not needed in the project.
   *
   * @static
   * @param {*} keyObject
   * @returns
   * @memberof Policy
   */
  static async find(keyObject) {
    const policies = await this.getPolicies();

    const foundedPolicies = policies.filter(policy => {
      let founded = false;

      for (const key in keyObject) {
        if (keyObject.hasOwnProperty(key)) {
          const firstValueToCompare = toLowerCase(policy[key]);
          const secondValueToCompare = toLowerCase(keyObject[key]);
          founded = founded || firstValueToCompare === secondValueToCompare;
        }
      }

      return founded;
    });

    return foundedPolicies;
  }
}

module.exports = Policy;
