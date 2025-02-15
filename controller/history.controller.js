const connection = require('../connection');

exports.addListeningHistory = (req, res) => {
    
    let { user_id, audio_id, last_listened_time } = req.body;
    let query = "SELECT * FROM listeninghistory WHERE user_id=? AND audio_id=?";
    connection.query(query, [user_id, audio_id], (err, results) => {
        if (!err) {
            if (results.length > 0) {
                var { history_id } = results[0];
                query = "UPDATE listeninghistory SET last_listened_time=? where history_id=?";
                connection.query(query, [last_listened_time, history_id], (err, results) => {
                    if (!err) {
                        if (results.affectedRows == 0) {
                            res.status(404).json({ message: "History id not found!" });
                        } else {
                            res.status(200).json({ message: "Listening History updated successfully" });
                        }
                    } else {
                        res.status(500).json(err);
                    }
                })
            } else {
                query = "INSERT INTO listeninghistory (user_id, audio_id, last_listened_time) VALUES (?, ?, ?)";
                connection.query(query, [user_id, audio_id, last_listened_time], (error, results) => {
                    if (error) {
                        res.status(500).json(error);
                    } else {
                        res.status(200).json({ message: "Listening history added successfully!", data: results });
                    }
                });
            }
        } else {
            res.status(500).json(err);
        }
    })

};

exports.getListeningHistoryById = (req, res) => {
    let query = "SELECT * FROM listeninghistory WHERE history_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if (!error) {
            if (results.length <= 0) {
                res.status(404).json({ message: "Listening history id not found" });
            } else {
                res.status(200).json(results[0]);
            }
        } else {
            res.status(500).json(error);
        }
    });
};

exports.getListeningHistoryByUserId = (req, res) => {
    let query = "SELECT * FROM listeninghistory WHERE user_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if (!error) {
            if (results.length <= 0) {
                res.status(404).json({ message: "Listening history id not found" });
            } else {
                res.status(200).json(results);
            }
        } else {
            res.status(500).json(error);
        }
    });
};

exports.deleteListeningHistoryById = (req, res) => {
    let query = "DELETE FROM listeninghistory WHERE history_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if (!error) {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Listening history id does not found" });
            } else {
                res.status(200).json({ message: "Listening history deleted successfully!" });
            }
        } else {
            res.status(500).json(error);
        }
    });
}