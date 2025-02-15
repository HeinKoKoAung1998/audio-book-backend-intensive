const connection = require('../connection');

exports.addUserActivity = (req, res) => {

    let { user_id,last_active_time } = req.body;

    var query = "INSERT INTO useractivity (user_id,last_active_time,status) VALUES (?,?,'Active') on duplicate key update last_active_time=?,status='Active'";
    connection.query(query, [user_id,last_active_time,last_active_time], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "User activity added successfully!" });
        }
    });
};

exports.getActiveUsers = (req, res) => {

    var query = "SELECT * FROM useractivity WHERE status='Active' and last_active_time > NOW() - INTERVAL 5 MINUTE";
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};