const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const server = require('../app');
const { CLIENTS_URL, POLICIES_URL } = require('../utils/url.constants');
const { SUCCESS_CODE, NOT_FOUND_CODE } = require('../utils/api.constants');
const {
  CLIENT_FOUNDED_MESSAGE,
  CLIENT_NOT_FOUNDED_MESSAGE,
  POLICIES_FOUNDED_MESSAGE,
  POLICIES_NOT_FOUNDED_MESSAGE
} = require('../utils/messages.constants');

const expect = chai.expect;
describe('Get clients data filtered', () => {
  let axiosMocked;
  let clients;
  before(() => {
    chai.use(chaiHttp);
    axiosMocked = new MockAdapter(axios);
  });
  beforeEach(() => {
    clients = [
      {
        id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
        name: 'Britney',
        email: 'britneyblankenship@quotezart.com',
        role: 'admin'
      },
      {
        id: 'a0ece5db-cd14-4f21-812f-966633e7be02',
        name: 'Daniel',
        email: 'danielblankenship@quotezart.com',
        role: 'user'
      },
      {
        id: 'a0ece5db-cd14-4f21-812f-966633e7be03',
        name: 'Jhon',
        email: 'jhonblankenship@quotezart.com',
        role: 'user'
      }
    ];
    axiosMocked.onGet(CLIENTS_URL).reply(SUCCESS_CODE, {
      clients
    });
  });
  afterEach(() => {
    axiosMocked.reset();
  });
  after(() => {
    axiosMocked.restore();
  });

  describe('By client id', () => {
    describe('client exists', () => {
      it('is succesful', async () => {
        const client = clients[0];

        const response = await chai.request(server).get('/clients/' + client.id);

        expect(response).to.have.status(SUCCESS_CODE);
        expect(response.body.message).equal(CLIENT_FOUNDED_MESSAGE);
        expect(response.body.client.id).equal(client.id);
      });
    });

    describe('client does not exists', () => {
      it('return not found code and not found message', async () => {
        const clientId = '123456-fake';
        const response = await chai.request(server).get('/clients/' + clientId);

        expect(response).to.have.status(NOT_FOUND_CODE);
        expect(response.body).to.not.have.property('client');
        expect(response.body.message).equal(CLIENT_NOT_FOUNDED_MESSAGE);
      });
    });

    describe('user is not authenticated', () => {
      it('is not succesful');
      it('tells user to authenticate');
    });
  });
  describe('By client name', () => {
    describe('client exists', () => {
      it('is succesful', async () => {
        const client = clients[1];

        const response = await chai.request(server).get('/clients/filter/' + client.name);

        expect(response).to.have.status(SUCCESS_CODE);
        expect(response.body.message).equal(CLIENT_FOUNDED_MESSAGE);
        expect(response.body.client.id).equal(client.id);
        expect(response.body.client.name).equal(client.name);
      });
      it('is succesful with case insensitive', async () => {
        const client = clients[1];
        const clientName = client.name.replace(client.name, 'DaNiEl');

        const response = await chai.request(server).get('/clients/filter/' + clientName);

        expect(response).to.have.status(SUCCESS_CODE);
        expect(response.body.message).equal(CLIENT_FOUNDED_MESSAGE);
        expect(response.body.client.id).equal(client.id);
        expect(response.body.client.name).equal(client.name);
      });
    });

    describe('client does not exists', () => {
      it('return not found code and not found message', async () => {
        const clientName = 'Fake Name';
        const response = await chai.request(server).get('/clients/filter/' + clientName);
        expect(response).to.have.status(NOT_FOUND_CODE);
        expect(response.body).to.not.have.property('client');
        expect(response.body.message).equal(CLIENT_NOT_FOUNDED_MESSAGE);
      });
    });

    describe('user is not authenticated', () => {
      it('is not succesful');
      it('tells user to authenticate');
    });
  });
});
describe('Get client policies', () => {
  let axiosMocked;
  let clients;
  before(() => {
    chai.use(chaiHttp);
    axiosMocked = new MockAdapter(axios);
  });
  beforeEach(() => {
    clients = [
      {
        id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
        name: 'Britney',
        email: 'britneyblankenship@quotezart.com',
        role: 'admin'
      },
      {
        id: 'a0ece5db-cd14-4f21-812f-966633e7be02',
        name: 'Daniel',
        email: 'danielblankenship@quotezart.com',
        role: 'user'
      },
      {
        id: 'a0ece5db-cd14-4f21-812f-966633e7be03',
        name: 'Jhon',
        email: 'jhonblankenship@quotezart.com',
        role: 'user'
      }
    ];
    policies = [
      {
        id: '64cceef9-3a01-49ae-a23b-3761b604800b',
        amountInsured: 1825.89,
        email: 'inesblankenship@quotezart.com',
        inceptionDate: '2016-06-01T03:33:32Z',
        installmentPayment: true,
        clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86'
      },
      {
        id: '7b624ed3-00d5-4c1b-9ab8-c265067ef58b',
        amountInsured: 399.89,
        email: 'inesblankenship@quotezart.com',
        inceptionDate: '2015-07-06T06:55:49Z',
        installmentPayment: true,
        clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86'
      },
      {
        id: '56b415d6-53ee-4481-994f-4bffa47b5239',
        amountInsured: 2301.98,
        email: 'inesblankenship@quotezart.com',
        inceptionDate: '2014-12-01T05:53:13Z',
        installmentPayment: false,
        clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86'
      }
    ];
    axiosMocked.onGet(CLIENTS_URL).reply(SUCCESS_CODE, {
      clients
    });
    axiosMocked.onGet(POLICIES_URL).reply(SUCCESS_CODE, {
      policies
    });
  });
  afterEach(() => {
    axiosMocked.reset();
  });
  after(() => {
    axiosMocked.restore();
  });
  describe('Client exists', () => {
    it('Client has policies', async () => {
      const client = clients[0];

      const response = await chai.request(server).get(`/clients/${client.name}/policies`);

      expect(response).to.have.status(SUCCESS_CODE);
      expect(response.body.message).equal(POLICIES_FOUNDED_MESSAGE);
      expect(response.body.client.id).equal(client.id);
      expect(response.body.policies.length).equal(3);
    });
    it('Client does not have policies', async () => {
      const client = clients[1];

      const response = await chai.request(server).get(`/clients/${client.name}/policies`);

      expect(response).to.have.status(NOT_FOUND_CODE);
      expect(response.body.message).equal(POLICIES_NOT_FOUNDED_MESSAGE);
      expect(response.body.client.id).equal(client.id);
      expect(response.body.policies.length).equal(0);
    });
    it('is succesful with case insensitive', async () => {
      const client = clients[0];
      const clientName = client.name.replace(client.name, 'BrItNeY');

      const response = await chai.request(server).get(`/clients/${clientName}/policies`);

      expect(response).to.have.status(SUCCESS_CODE);
      expect(response.body.message).equal(POLICIES_FOUNDED_MESSAGE);
      expect(response.body.client.id).equal(client.id);
      expect(response.body.policies.length).equal(3);
    });
  });
  it('Client does not exists', async () => {
    const clientName = 'fakeName';

    const response = await chai.request(server).get(`/clients/${clientName}/policies`);

    expect(response).to.have.status(NOT_FOUND_CODE);
    expect(response.body.message).equal(CLIENT_NOT_FOUNDED_MESSAGE);
    expect(response.body).to.not.have.property('client');
  });
  it('Client is not authenticated');
});
