var mongoose    = require('mongoose');
var jwt         = require('koa-jwt');
var nconf       = require('nconf');

var router = module.exports = require('koa-router')({prefix: '/auth'});

var User   = mongoose.model('User');


router
    .post('/signin', function *() {
        this.checkBody('email').notEmpty().isEmail('Invalid Email').trim().toLow();
        this.checkBody('password').notEmpty().len(6, 20).trim();
        if (this.errors) {
            this.throw(422, 'Invalid email or password', {errors: this.errors});
        }

        var email    = this.request.body.email;
        var password = this.request.body.password;
        var user = yield User.authenticate(email, password, this);
        var token = jwt.sign(user, nconf.get('auth:jwt:secret'), { expiresInMinutes: 60 * 5 });
        this.body = {token: token};
    })

    .post('/signup', function *() { // duplicate of POST /users
        var user = new User(this.request.body);
        yield user.save();
        this.body = user;
        this.status = 201;
    })

    .post('/signout', function *() {
        delete this.state.user;
        this.status = 201;
    })

    .get('/profile', function *() {
        this.body = this.state.user;
    });
