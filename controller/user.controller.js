const connection = require("../connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");

dotenv.config({ path: './config.env' });

exports.signUp = (req, res) => {

    var { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({ message: "Input can not be empty!" });
    }

    const hash = bcrypt.hashSync(password, 10);
    var query = "SELECT name,email,password FROM users WHERE email=?";
    connection.query(query, [email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "INSERT INTO users(name,email,password,role,auth_provider) VALUES(?,?,?,'User','Email')";
                connection.query(query, [name, email, hash], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: 'Succesfully registered!' })
                    } else {
                        return res.status(500).json(err)
                    }
                })
            } else {
                return res.status(400).json({ message: 'Email already exist!' })
            }
        } else {
            return res.status(500).json(err)
        }
    });
};

exports.login = (req, res) => {

    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ message: "Input can not be empty!" });
    }

    var query = "SELECT user_id,name,email,password,role FROM users WHERE email=?";
    connection.query(query, [email], (err, results) => {
        if (!err) {
            if (results.length == 0) {
                return res.status(401).json({ message: "incorrect email" })
            }
            if (results.length > 0) {
                const check = bcrypt.compareSync(password, results[0].password);
                if (check) {
                    const response = { user_id: results[0].user_id, email: results[0].email, role: results[0].role };
                    const token = jwt.sign(response, process.env.JWT_SECRET, { expiresIn: '1h' });

                    return res.status(200).json({ message: 'Succesfully logged in!', token: token });
                } else {
                    return res.status(401).json({ message: "Incorrect password" })
                }
            }
        } else {
            return res.status(500).json(err)
        }
    });
};

exports.getAllUserInfo = (req, res) => {

    var query = "SELECT user_id,name,email,auth_provider FROM users WHERE role='User'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    });
};

exports.getOneUserInfo = (req, res) => {

    let { user_id } = req.users;
    let expiresIn = new Date(req.users.exp * 1000);

    var query = "SELECT user_id,name,email,auth_provider,role FROM users WHERE user_id=?";
    connection.query(query, [user_id], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                res.status(404).json({ message: 'User id not found' });
            } else {
                const userData = {
                    'user_id': results[0].user_id,
                    'name': results[0].name,
                    'email': results[0].email,
                    'role': results[0].role,
                    'expiresIn': expiresIn
                }
                return res.status(200).json(userData);
            }
        } else {
            res.status(500).json(err);
        }
    });
};

exports.getOneUserById = (req,res)=>{
    let  { id }  = req.params;

    var query = "SELECT user_id,name,email,auth_provider FROM users WHERE user_id=?";

    connection.query( query, [ id ], (err, results)=>{
        if( !err ){
            if( results.length <= 0 ){
               return res.status(400).json({ message : 'Id does not found!'});
            }else{
              return res.status(200).json(results);
            }
        }else{
            return res.status(500).json(err)
        }
    });
};


exports.updateRole = (req, res) => {

    let {  role,user_id } = req.body ;

    var query = "UPDATE users SET role=? WHERE user_id=?";
    connection.query(query, [ role,user_id ], (err, results) => {
        if (!err) {
            if (results.affectedRows > 0) {
                return res.status(200).json({ message: 'Role updated successfully' })
            }
            return res.status(400).json({ message: 'User Id does not exit!' });
        } else {
            return res.status(500).json(err)
        }
    });
};

exports.changePassword = (req, res) => {

    const { oldPassword, newPassword } = req.body;
    const { user_id } = res.users;

    var query = "SELECT * FROM users WHERE user_id=? AND password=?";
    connection.query(query, [user_id, oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect old password!" });
            } else if (results[0].password == user.oldPassword) {
                query = " update users set password=? where user_id=? ";
                connection.query(query, [newPassword, user_id], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password updated Successfully" })
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(500).json({ message: "Something went wrong" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
};

exports.deleteAll = (req, res) => {
    
    connection.query("DELETE FROM users", (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "deleted" });
        } else {
            return res.status(500).json(err);
        }
    });
};

exports.deleteById = (req, res) => {
    let { id } = req.params;

    var query = "DELETE FROM users WHERE user_id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "User is Deleted " });
        } else {
            return res.status(500).json(err);
        }
    });
};

const OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  async function sendEmail(to, subject, text) {
    try {
      const accessToken = await OAuth2Client.getAccessToken();
      
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
      });
  
      const mailOptions = {
        from: `"Audio Book" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      };
  
      const result = await transporter.sendMail(mailOptions);
      console.log("Email sent:", result);
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: 'heinkokoaungmgk1998@gmail.com', // Your Gmail address
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: '1//04FDiIlfNxswLCgYIARAAGAQSNwF-L9IrPanPzKifMzdbVMCV0KbYg2qiVjwJo-OOCPAp9pXBVxRdC2DN3dzDeX6CasvumS9aQj4',
//         accessToken: 'ya29.a0AXeO80QgUXX5Z-d53buN-q2iAILNemLDhUhyjUztnJ_9zoYlS6--0jUWAQVJzwxhhsC3D1745FCK-dd61EHC0V0D5P8ir804rdWSUzAKIlAcIwCrCG_pimSzrscXZGLRk3Azsg6L6tSty_GTQWSPWOcaQA5ta3dK98W9yaFCaCgYKAbwSARESFQHGX2MislzTuF0TSLK85Oar-Ew6gg0175', // Optional, if you have it
//     },
// });

exports.forgotPassword =  (req, res) => {
    const { email } = req.body;
    const resetToken = uuidv4();
    const expiryTime = new Date(Date.now() + 3600000); // 1 hour
  
    connection.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ message: "User not found" });
  
      connection.query(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, expiryTime, email],
        async (err) => {
          if (err) return res.status(500).json({ error: err.message });
  
          const resetLink = `http://localhost:8080/users/reset-password/${resetToken}`;
        //   const mailOptions = {
        //     from: 'heinkokoaungmgk1998@gmail.com',
        //     to: email,
        //     subject: "Password Reset",
        //     text: `Click here to reset your password: ${resetLink}`,
        //   };
  
          try {
            // await transporter.sendMail(mailOptions);
            sendEmail(email,"Password Reset",`Click here to reset your password: ${resetLink}`)
            res.json({ message: "Password reset email sent" });
          } catch (mailErr) {
            res.status(500).json({ error: mailErr });
          }
        }
      );
    });
  };
  
  // Handle Password Reset
  exports.resetPassword =  (req, res) => {
    
    const { token } = req.params;
    const { newPassword } = req.body;
  
    connection.query("SELECT * FROM users WHERE reset_token = ?", [token], async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(400).json({ message: "Invalid or expired token" });
     
      const user = result[0];
      if (new Date(user.reset_token_expiry) < new Date()) {
        return res.status(400).json({ message: "Token expired" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      connection.query(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?",
        [hashedPassword, user.user_id],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: updateErr.message });
          res.json({ message: "Password updated successfully" });
        }
      );
    });
  };

  exports.renderResetPasswordForm = (req, res) => {
    const { token } = req.params;

    // Check if the token is valid and not expired
    connection.query(
        "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
        [token, new Date()],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0) return res.status(400).send("Invalid or expired token");

            const user = result[0];
            if (new Date(user.reset_token_expiry) < new Date()) {
              return res.status(400).send("<h2>Token expired</h2>");
            }
            // Render an HTML form for resetting the password
             res.send(`
      <html>
        <head>
          <title>Reset Password</title>
        </head>
        <body>
          <h2>Reset Your Password</h2>
          <form action="/users/reset-password/${token}" method="POST">
            <label>New Password:</label>
            <input type="password" name="newPassword" required />
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);
        }
    );
};

