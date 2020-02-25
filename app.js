const Express = require('express');
const BodyParser = require('body-parser');
const Speakeasy = require('speakeasy');

let app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));

app.post('/secret',(req, res) => {
    let secret = Speakeasy.generateSecret({ length: 10});
    res.send({'secret': secret.base32});
});

app.post('/generate',(req, res) => {
    res.send({
        'token': Speakeasy.totp({
            secret: req.body.secret,
            encoding: 'base32'
        }),
        'remaing': (60 - Math.floor((new Date().getTime() / 1000.0 % 30)))
    });
});

app.post('/validate',(req, res) => {
    res.send({
        'valid': Speakeasy.totp.verify({
            secret: req.body.secret,
            encoding: 'base32',
            token: req.body.token,
            window: 0
        })
    })

});

app.listen(3000, () => {
    console.log('Listening at : 3000');
})
