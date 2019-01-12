const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const server = require('../app');
const { CLIENTS_URL, POLICIES_URL } = require('../utils/url.constants');
const {
  SUCCESS_CODE,
  NOT_FOUND_CODE,
  UNAUTHORIZED_CODE,
  FORBIDDEN_CODE
} = require('../utils/api.constants');
const {
  CLIENT_FOUNDED_MESSAGE,
  POLICY_NOT_FOUNDED_MESSAGE,
  AUTH_UNAUTHORIZED_MESSAGE,
  AUTH_FORBIDDEN_MESSAGE
} = require('../utils/messages.constants');

const expect = chai.expect;

describe('Get the client linked to a policy number', () => {
  let axiosMocked;
  let clients;
  let token;
  before(() => {
    chai.use(chaiHttp);
    axiosMocked = new MockAdapter(axios);
  });
  beforeEach(async () => {
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
        clientId: 'a0ece5db-cd14-4f21-812f-966633e7be02'
      },
      {
        id: '56b415d6-53ee-4481-994f-4bffa47b5239',
        amountInsured: 2301.98,
        email: 'inesblankenship@quotezart.com',
        inceptionDate: '2014-12-01T05:53:13Z',
        installmentPayment: false,
        clientId: 'fakeId'
      }
    ];
    axiosMocked.onGet(CLIENTS_URL).reply(SUCCESS_CODE, {
      clients
    });
    axiosMocked.onGet(POLICIES_URL).reply(SUCCESS_CODE, {
      policies
    });

    const email = clients[0].email;
    const body = JSON.stringify({ email });
    const response = await chai
      .request(server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(body);

    token = response.body.token;
  });
  afterEach(() => {
    axiosMocked.reset();
  });
  after(() => {
    axiosMocked.restore();
  });

  it('Policy exists with a client linked', async () => {
    const policy = policies[0];

    const response = await chai
      .request(server)
      .get(`/policies/${policy.id}/client`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.body.message).equal(CLIENT_FOUNDED_MESSAGE);
    expect(response).to.have.status(SUCCESS_CODE);
    expect(response.body.client.id).equal(policy.clientId);
    expect(response.body.policy.id).equal(policy.id);
  });

  it('Policy does not exists', async () => {
    const fakePolicyId = 'fakeId';

    const response = await chai
      .request(server)
      .get(`/policies/${fakePolicyId}/client`)
      .set('Authorization', 'Bearer ' + token);

    expect(response).to.have.status(NOT_FOUND_CODE);
    expect(response.body.message).equal(POLICY_NOT_FOUNDED_MESSAGE);
    expect(response.body).to.not.have.property('client');
    expect(response.body).to.not.have.property('policy');
  });
  it('User is not authenticated', async () => {
    const policy = policies[0];

    const response = await chai.request(server).get(`/policies/${policy.id}/client`);

    expect(response).to.have.status(UNAUTHORIZED_CODE);
    expect(response.body.message).equal(AUTH_UNAUTHORIZED_MESSAGE);
    expect(response.body).to.not.have.property('client');
    expect(response.body).to.not.have.property('policy');
  });

  it('User does not have role of admin', async () => {
    const email = clients[1].email;
    const body = JSON.stringify({ email });
    const responseLogin = await chai
      .request(server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(body);

    token = responseLogin.body.token;

    const policy = policies[0];

    const response = await chai
      .request(server)
      .get(`/policies/${policy.id}/client`)
      .set('Authorization', 'Bearer ' + token);

    expect(response).to.have.status(FORBIDDEN_CODE);
    expect(response.body.message).equal(AUTH_FORBIDDEN_MESSAGE);
    expect(response.body).to.not.have.property('client');
    expect(response.body).to.not.have.property('policy');
  });
});
