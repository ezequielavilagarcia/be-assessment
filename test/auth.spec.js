const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const jwt = require('jsonwebtoken');

const server = require('../app');
const { CLIENTS_URL } = require('../utils/url.constants');
const {
  API_BASE_URL,
  SUCCESS_CODE,
  UNAUTHORIZED_CODE,
  VALIDATION_FAILED_CODE
} = require('../utils/api.constants');
const {
  AUTH_LOGIN_SUCCESS_MESSAGE,
  AUTH_USER_NOT_EXISTS_MESSAGE,
  AUTH_VALIDATION_FAILED_MESSAGE
} = require('../utils/messages.constants');

const expect = chai.expect;

describe('Authentication and authorization', () => {
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

  describe('Login', () => {
    describe('User exists', () => {
      it('Should return a token with the user role and the user', async () => {
        const email = clients[0].email;
        const body = JSON.stringify({ email });

        const response = await chai
          .request(server)
          .post(`${API_BASE_URL}/auth/login`)
          .set('Content-Type', 'application/json')
          .send(body);

        expect(response).to.have.status(SUCCESS_CODE);
        expect(response.body.message).equal(AUTH_LOGIN_SUCCESS_MESSAGE);
        expect(response.body.user.email).equal(email);
        expect(response.body).to.have.property('user');
        expect(response.body).to.have.property('token');

        const token = response.body.token;
        const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);

        expect(decodedToken).to.have.property('role');
      });
    });
    describe('User does not exists', () => {
      it('Should return an specific message with not found api code', async () => {
        const email = 'fakeEmail@email.com';
        const body = JSON.stringify({ email });

        const response = await chai
          .request(server)
          .post(`${API_BASE_URL}/auth/login`)
          .set('Content-Type', 'application/json')
          .send(body);

        expect(response).to.have.status(UNAUTHORIZED_CODE);
        expect(response.body.message).equal(AUTH_USER_NOT_EXISTS_MESSAGE);
        expect(response.body).to.not.have.property('user');
        expect(response.body).to.not.have.property('token');
      });
    });
    describe('Invalid email', () => {
      it('Should return an specific message with validation failed api code', async () => {
        const email = 'wrongemail';
        const body = JSON.stringify({ email });

        const response = await chai
          .request(server)
          .post(`${API_BASE_URL}/auth/login`)
          .set('Content-Type', 'application/json')
          .send(body);

        expect(response).to.have.status(VALIDATION_FAILED_CODE);
        expect(response.body.message).equal(AUTH_VALIDATION_FAILED_MESSAGE);
        expect(response.body).to.not.have.property('user');
        expect(response.body).to.not.have.property('token');
      });
    });
  });
});
