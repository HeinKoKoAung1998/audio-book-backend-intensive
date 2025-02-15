const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const connection = require('../connection');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const generateToken = user =>
    jwt.sign({ user_id: user.user_id, email: user.email, role: 'User' }, process.env.JWT_SECRET, { expiresIn: '1h' });

exports.googleSignIn = (req, res) => {
    const { idToken } = req.body;

    const client = new OAuth2Client(process.env.OAUTH2_CLIENT_ID);

    client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    }).then(ticket => {
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        let query = 'select * from users where email=?';
        connection.query(query, [email], (err, results) => {

            if (err) {
                return res.status(500).json({ err: " Database error" });
            }
            else if (results.length > 0) {
                const token = generateToken(results[0]);

                return res.status(200).json({ token: token });
            } else {
                query = 'INSERT INTO users(name,email,role,auth_provider) values(? ,? ,"User","Google")';
                connection.query(query, [name, email], (err, results) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    query = 'SELECT user_id,email,name FROM users where email=?';
                    connection.query(query, [email], (err, results) => {
                        if (err) {
                            return res.status(400).json({ err: 'email does not exist' })
                        }
                        console.log(results[0]);

                        const token = generateToken(results[0]);
                        return res.status(200).json({ token: token });
                    })
                })
            }
        })
    }).catch(e => {
        return res.status(400).json({ messsage: 'Invalid token' })
    });
}