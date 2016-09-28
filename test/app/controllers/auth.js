
const expect = require('chai').expect;
const app = require('../../../app');
const request = require('supertest').agent(app.listen());
const User = require('../../../app/models/user');
const { ROLE_USER } = require('../../../config/permissions');

describe('app/controllers/user', function() {
  describe('sign-in', function() {
    let user = {
      firstName: 'tester',
      lastName: '1',
      password: '123456',
      email: 'tester1@mail.com'
    };

    before(function() {
      return User.create(user);
    });

    after(function() {
      return User.remove();
    });

    it('signs in user', function(done) {
      request
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password: user.password
        })
        .expect(function(res) {
          expect(res.body.token).to.exist;
        })
        .expect(200)
        .end(done);
    });

    it('fails to sign in user', function(done) {
      request
        .post('/auth/sign-in')
        .expect(function(res) {
          expect(res.body.message).to.equal('Invalid email or password');
        })
        .expect(422)
        .end(done);
    });
  });

  describe('sign-up', function() {
    let user = {
      firstName: 'tester',
      lastName: '1',
      password: '123456',
      email: 'tester1@mail.com'
    };

    after(function() {
      return User.remove();
    });

    it('signs up new user', function(done) {
      request
        .post('/auth/sign-up')
        .send(user)
        .expect(function(res) {
          expect(res.body.id).to.exist;
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.role).to.equal(ROLE_USER);
        })
        .expect(201)
        .end(done);
    });

    it('fails to sign up new user', function(done) {
      request
        .post('/auth/sign-up')
        .expect(function(res) {
          expect(res.body.message).to.equal('Unprocessable Entity');
        })
        .expect(422)
        .end(done);
    });
  });
});
