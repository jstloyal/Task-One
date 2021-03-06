const assert = require('assert');
const httpStatus = require('http-status-codes');
const request = require('supertest');
const { app, apiCalls } = require('../index');

describe('POST /login', () => {
    it('should return JSON', done => {
        request(app)
            .post(apiCalls.login)
            .send({ username: 'suparman', password: 'secret1234' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(httpStatus.OK, done);
    });

    it('should return JSON with field user correctly set', done => {
        request(app)
            .post(apiCalls.login)
            .send({ username: 'suparman', password: 'secret1234' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(httpStatus.OK)
            .end((err, response) => {
                if (err) return done(err);
                assert.strictEqual(response.body.user, 'suparman');
                assert.notStrictEqual(response.body.token, undefined);
                done();
            });
    });

    it('should return HTTP status UNAUTHORIZED when supplied with wrong credentials', done => {
        request(app)
            .post(apiCalls.login)
            .send({ username: 'fakeuser', password: 'anonymous' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(httpStatus.UNAUTHORIZED)
            .end((err, response) => {
                if (err) return done(err);
                assert.equal(response.body.message.length, 38);
                assert.equal(response.body.status, httpStatus.UNAUTHORIZED)
                assert.equal(response.body.message, 'login failed. check email and password');
                done();
            });
    });
});

describe('POST /signup', () => {
    it('should successfully sign up new user', done => {
        request(app)
        .post(apiCalls.signup)
        .send({ name: 'Gfred Tech', username: 'gfredtech', password: 'gameboy'})
        .set('Accept', 'application/json')
        .expect('COntent-Type', /json/)
        .expect(httpStatus.OK)
        .end((err, response) => {
            if (err) return done(err);
            assert.strictEqual(response.body.status, httpStatus.OK);
            assert.notStrictEqual(response.body.token, undefined);
            done();
        });
    });

    it('should reject new signup because user with username already exists', done => {
        request(app)
        .post(apiCalls.signup)
        .send({ name: 'Another suparman', username: 'suparman', password: 'somerandomtext'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(httpStatus.UNAUTHORIZED)
        .end((err, response) => {
            if (err) return done(err);
            assert.strictEqual(response.body.status, httpStatus.UNAUTHORIZED);
            assert.strictEqual(response.body.token, undefined);
            done();
        });
    });
});