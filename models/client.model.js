const axios = require('axios');

const { CLIENTS_URL } = require('../utils/url.constants.js');
const { INTERNAL_ERROR_CODE } = require('../utils/api.constants.js');
const { toLowerCase } = require('../utils/string.helper');

class Client {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  /**
   * It is used to request to external API all the clients
   *
   * @static
   * @returns Client[]
   * @memberof Client
   */
  static async getClients() {
    try {
      const response = await axios.get(CLIENTS_URL);
      const clients = response.data.clients;
      return clients;
    } catch (err) {
      const error = new Error('Could not get ' + CLIENTS_URL + ' try again later');
      error.statusCode = INTERNAL_ERROR_CODE;
      throw error;
    }
  }

  /**
   * Is used to find any client by any property, it receives an object which the key is the property to search,
   * and the value is the value to search ex: { name: 'David'}. If the object has multiple keys, it will work like OR,
   * but up to now multiple keys is not needed in the project.
   *
   * @static
   * @param {*} keyObject
   * @returns
   * @memberof Client
   */
  static async find(keyObject) {
    const clients = await this.getClients();

    const foundedClient = clients.find(client => {
      let founded = false;

      for (const key in keyObject) {
        if (keyObject.hasOwnProperty(key)) {
          const firstValueToCompare = toLowerCase(client[key]);
          const secondValueToCompare = toLowerCase(keyObject[key]);
          founded = founded || firstValueToCompare === secondValueToCompare;
        }
      }

      return founded;
    });

    return foundedClient;
  }
}

module.exports = Client;
