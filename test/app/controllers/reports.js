
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
    before(function*() {
      this.report = yield Report.create({
        date: '2016-05-05',
        timeTaken: 3600,
        description: 'It takes 1 hour'
      });
    });

    after(function() {
      return this.report.remove();
    });

    it('returns reports', function(done) {
      request
        .get('/reports')
        .set('Authorization', 'Bearer ' + token)
        .expect(res => {
          expect(res.body).to.have.length(1);
          expect(res.body[0].id).to.equal(this.report._id.toString());
          expect(res.body[0].date).to.equal(this.report.date.toISOString());
          expect(res.body[0].timeTaken).to.equal(this.report.timeTaken);
          expect(res.body[0].description).to.equal(this.report.description);
        })
        .expect(200)
        .end(done);
    });
  });

  describe('show', function() {
    before(function*() {
      this.report = yield Report.create({
        date: '2016-05-05',
        timeTaken: 3600,
        description: 'It takes 1 hour'
      });
    });

    after(function() {
      return this.report.remove();
    });

    it('returns report', function(done) {
      request
        .get('/reports/' + this.report._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(res => {
          expect(res.body.id).to.equal(this.report._id.toString());
          expect(res.body.date).to.equal(this.report.date.toISOString());
          expect(res.body.timeTaken).to.equal(this.report.timeTaken);
          expect(res.body.description).to.equal(this.report.description);
        })
        .expect(200)
        .end(done);
    });
  });

  describe('update', function() {
    before(function*() {
      this.report = yield Report.create({
        date: '2016-05-05',
        timeTaken: 3600,
        description: 'It takes 1 hour'
      });
    });

    after(function() {
      return this.report.remove();
    });

    it('updates report', function(done) {
      request
        .put('/reports/' + this.report._id)
        .set('Authorization', 'Bearer ' + token)
        .send({
          date: this.report.date,
          timeTaken: this.report.timeTaken,
          description: 'new description'
        })
        .expect(res => {
          expect(res.body.id).to.equal(this.report._id.toString());
          expect(res.body.date).to.equal(this.report.date.toISOString());
          expect(res.body.timeTaken).to.equal(this.report.timeTaken);
          expect(res.body.description).to.equal('new description');
        })
        .expect(200)
        .end(done);
    });
  });

  describe('destroy', function() {
    before(function*() {
      this.report = yield Report.create({
        date: '2016-05-05',
        timeTaken: 3600,
        description: 'It takes 1 hour'
      });
    });

    it('removes report', function(done) {
      request
        .delete('/reports/' + this.report._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)
        .end(done);
    });

    it('count of reports should be 0', function*() {
      expect(yield Report.count()).to.equal(0);
    });
  });
});
