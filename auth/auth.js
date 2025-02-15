const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({path: './config.env'});

function isAuthenticated(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Please login to access this resource."});
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
   
    jwt.verify(token,process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ message: error });
        }
        else{
            req.users = user;
            next();
        }
       
    });
};

function adminAuthorizeRole(req, res, next) {
    const { role } = req.users;
    if (role == "Admin") 
    next();
    else
    return res.status(403).json({ message: "Forbidden" });
    
}

module.exports = {isAuthenticated,adminAuthorizeRole};