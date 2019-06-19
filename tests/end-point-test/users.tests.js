const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const faker = require('faker');
const db = require('../../infrastructures/database/sequelize/sequelize');
const loadTestData = require('../scripts/loadDatabase');

// Configure chai
chai.use(chaiHttp);
chai.should();
const { expect } = chai;

let token;
const signup = '/signup';
const login = '/login';
const most_liked = '/most-liked';
const updatePassword = '/me/update-password';
const me = '/me';


const preSave = {
  username: 'randomguy',
  password: faker.internet.password(),
};

describe('User tests: ', () => {

  before(async () => {
    await db.resetDatabase();
    await loadTestData();
  });


  //! test signup
  const user = {
    username: 'newUser',
    password: 'password',
  };

  it(`should create a new user with username ${user.username}, should return a token and return status 201`, (done) => {
    chai.request(app)
      .post(signup)
      .send(user)
      .end((err, res) => {
        expect(res.should.have.status(201));
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  //! test signup fail
  it(`should fail to create a user because user with username ${user.username} exists and should return status 409`, (done) => {
    chai.request(app)
      .post(signup)
      .send(user)
      .end((err, res) => {
        expect(res.should.have.status(409));
        done();
      });
  });

  //! login 
  it(`should login with success, return a token and return status 200`, (done) => {
    chai.request(app)
      .post(login)
      .send(user)
      .end((err, res) => {
        expect(res.should.have.status(200));
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  //! currently login user
  it(`should return details about currently logged in user(username: newUser, id: 1), and returns status 200`, (done) => {
    chai.request(app)
      .get(me)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.should.have.status(200));
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property('user').that.has.property('username').equal('newUser');
        expect(res.body).to.have.property('user').that.has.property('id').equal(1);
        done();
      });
  });

  //! get info for a specific user
  it(`should return details about a specific user (username: John Doe, id: 100), and returns status 200`, (done) => {
    chai.request(app)
      .get(`/user/${100}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.should.have.status(200));
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property('username').equal('John Doe');
        expect(res.body).to.have.property('id').equal(100);
        expect(res.body).to.have.property('like_count').equal('3');
        done();
      });
  });

  //! get info for a non existent  user
  it(`should return status 204`, (done) => {
    chai.request(app)
      .get(`/user/${133337}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.should.have.status(204));
        expect(res.body).to.be.empty;
        done();
      });
  });

  //! login fail due to wrong username
  const wrongUser = {
    username: 'wrongusername',
    password: 'password',
  };
  it(`should fail to login due to wrong username, returns 401 status`, (done) => {
    chai.request(app)
      .post(login)
      .send(wrongUser)
      .end((err, res) => {
        expect(res.should.have.status(401));
        done();
      });
  });

  //! login fail due to wrong password
  wrongUser.password = 'jsdsdsjfjsdkfdsf';
  it(`should fail to login due to wrong password, returns 401 status`, (done) => {
    chai.request(app)
      .post(login)
      .send(wrongUser)
      .end((err, res) => {
        expect(res.should.have.status(401));
        done();
      });
  });

  //! update password
  const newPassword = { password: 'newPassword' };
  it(`should update the password, returns  200 status`, (done) => {
    chai.request(app)
      .put(updatePassword)
      .send(newPassword)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.should.have.status(200));
        done();
      });
  });

  //! login fail after password was updated
  it(`should fail to login due to updated password, returns 401 status`, (done) => {
    chai.request(app)
      .post(login)
      .send(user)
      .end((err, res) => {
        expect(res.should.have.status(401));
        done();
      });
  });


  //! login success after password was set to the new password
  const newUser = { username: user.username, password: newPassword.password };
  it(`should login with success after password update, return a token and return status 200`, (done) => {
    chai.request(app)
      .post(login)
      .send(newUser)
      .end((err, res) => {
        expect(res.should.have.status(200));
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  //! Test to get all users
  it('should get the list of all users', (done) => {
    chai.request(app)
      .get(most_liked)
      .end((err, res) => {
        expect(res.should.have.status(200));
        done();
      });
  });

  //! User A likes user B
  it(`should be able to like user with ID 100 and increase the like_count to 4`, (done) => {
    chai.request(app)
      .post(`/user/${100}/like`)
      //.query({ id: 300 })
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.should.have.status(201));
        done();
      });
  });

  //! Test to get all users
  it('should get the list of all users', (done) => {
    chai.request(app)
      .get(most_liked)
      .end((err, res) => {
        expect(res.should.have.status(200));
        done();
      });
  });

  //! User A unlikes user B
  it(`should be able to unlike user with ID 100 and decrease the like_count to 3`, (done) => {
    chai.request(app)
      .delete(`/user/${100}/unlike`)
      //.query({ id: 300 })
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.should.have.status(200));
        done();
      });
  });
});
