
const jwt = require('koa-jwt');
const expect = require('chai').expect;
const app = require('../../../app');
const request = require('supertest').agent(app.listen());
const Report = require('../../../app/models/report');

describe('app/controllers/user', function() {
  const user = {
    id: '000000000000000000000001',
    firstName: 'tester',
    lastName: '1',
    email: 'tester1@mail.com',
    role: 'user'
  };
  const token = jwt.sign(user, process.env.AUTH_JWT_SECRET, { expiresInMinutes: 60 * 5 });

  describe('list', function() {
    const report = {
      date: '2016-05-05',
      timeTaken: 3600,
      description: 'It takes 1 hour'
    };

    before(function() {
      return Report.create(report);
    });

    after(function() {
      return Report.remove();
    });

    it('returns reports', function(done) {
      request
        .get('/reports')
        .set('Authorization', 'Bearer ' + token)
        .expect(function(res) {
          expect(res.body).to.have.length(1);
          expect(res.body[0].id).to.exist;
          expect(res.body[0].date).to.exist;
          expect(res.body[0].timeTaken).to.equal(report.timeTaken);
          expect(res.body[0].description).to.equal(report.description);
        })
        .expect(200)
        .end(done);
    });
  });

  describe('show', function() {
    let report;

    before(function() {
      return Report
        .create({
          date: '2016-05-05',
          timeTaken: 3600,
          description: 'It takes 1 hour'
        })
        .then(model => report = model);
    });

    after(function() {
      return Report.remove();
    });

    it('returns report', function(done) {
      request
        .get('/reports/' + report._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(function(res) {
          expect(res.body.id).to.equal(report._id.toString());
          expect(res.body.date).to.equal(report.date.toISOString());
          expect(res.body.timeTaken).to.equal(report.timeTaken);
          expect(res.body.description).to.equal(report.description);
        })
        .expect(200)
        .end(done);
    });
  });

  describe('update', function() {
    let report;

    before(function() {
      return Report
        .create({
          date: '2016-05-05',
          timeTaken: 3600,
          description: 'It takes 1 hour'
        })
        .then(model => report = model);
    });

    after(function() {
      return Report.remove();
    });

    it('updates report', function(done) {
      request
        .put('/reports/' + report._id)
        .set('Authorization', 'Bearer ' + token)
        .send({
          date: report.date,
          timeTaken: report.timeTaken,
          description: 'new description'
        })
        .expect(function(res) {
          expect(res.body.id).to.equal(report._id.toString());
          expect(res.body.date).to.equal(report.date.toISOString());
          expect(res.body.timeTaken).to.equal(report.timeTaken);
          expect(res.body.description).to.equal('new description');
        })
        .expect(200)
        .end(done);
    });
  });

  describe('destroy', function() {
    let report;

    before(function() {
      return Report
        .create({
          date: '2016-05-05',
          timeTaken: 3600,
          description: 'It takes 1 hour'
        })
        .then(model => report = model);
    });

    it('removes report', function(done) {
      request
        .delete('/reports/' + report._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)
        .end(done);
    });
  });
});
