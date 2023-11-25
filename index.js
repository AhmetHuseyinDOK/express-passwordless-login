const express = require('express');
const { userService } = require('./services/user');
const { loginCodeService } = require('./services/code');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

userService.createUser('Ahmet', 'ahmet@deneme.com')
userService.createUser('Mehmet', 'mehmet@deneme.com')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/me', authenticateToken, (req, res) => {
    res.send(userService.getUserById(req.user.userId));
});


app.post('/send-verification-code', (req, res) => {
    const email = req.body?.email;
    if (!email) {
        return res.status(422).send({
            'error': 'email is required'
        })
    }

    const user = userService.findByEmail(email);
    if (!user) {
        return res.status(403).send({
            'error': 'user not found'
        })
    }

    loginCodeService.createCodeForEmail(email)

    res.send({
        'message': 'Code has been sent'
    })
})

app.post('/verification', (req, res) => {
    const { email, code } = req.body;
    if (!(email && code)) {
        return res.status(422).send({
            'error': 'email and code is required'
        })
    }

    const foundEntry = loginCodeService.findCode(email, code);
    if (!foundEntry) {
        return res.status(403).send({
            'error': 'code not found'
        })
    }

    if (foundEntry.expiresAt < new Date()) {
        return res.status(403).send({
            'error': 'code is expired'
        })
    }

    if (!foundEntry.active) {
        return res.status(403).send({
            'error': 'code is not active'
        })
    }

    foundEntry.active = false;

    const user = userService.findByEmail(foundEntry.email);
    if (!user) {
        return res.status(403).send({
            'error': 'user is not found'
        })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
})





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
