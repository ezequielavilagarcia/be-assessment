const axios = require('axios');
const { CLIENTS_URL } = require('../utils/url.constants.js');

class Client {
  static async getClients() {
    try {
      const response = await axios.get(CLIENTS_URL);
      const clients = response.data.clients;
      return clients;
    } catch (err) {
      const error = new Error('Could not get ' + CLIENTS_URL + ' try again later');
      error.statusCode = 500;
      throw error;
    }
  }

  static async find(keyObject) {
    const clients = await this.getClients();

    const foundedClient = clients.find(client => {
      let founded = false;

      for (const key in keyObject) {
        if (keyObject.hasOwnProperty(key)) {
          founded = founded || client[key] === keyObject[key];
        }
      }

      return founded;
    });

    return foundedClient;
  }
}

module.exports = Client;
