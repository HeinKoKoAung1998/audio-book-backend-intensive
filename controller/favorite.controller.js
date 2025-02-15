const connection = require('../connection');

exports.addFavorite = (req, res) => {

    let { user_id, audio_id } = req.body;

    var query = "SELECT * FROM favorites WHERE user_id=? and audio_id=?";
    connection.query(query,[user_id,audio_id],(err,results)=>{
        if( !err){
            if( results.length > 0){
                return res.status(400).json({message: "This audio is already in your favorites"});
            }else{
                query = "INSERT INTO favorites (user_id, audio_id) VALUES (?, ?)";
                connection.query(query, [user_id, audio_id], (error, results) => {
                    if (error) {
                        res.status(500).json(error);
                    } else {
                        res.status(200).json({ message: "Favorite added successfully!", data: results });
                    }
                });
            }
        }else{
            return res.status(500).json(err);
        }
    });
   
};

exports.getAllFavorites = (req, res) => {
    var query = "SELECT * FROM favorites";
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};

exports.getAllFavoriteByUserId = (req, res) => {
    let {id} = req.params;
    var query = "SELECT * FROM favorites WHERE user_id = ?";
    connection.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    })
};

exports.getFavoriteById = (req, res) => {
    var query = "SELECT * FROM favorites WHERE favorite_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if (!error) {
            if (results.length <= 0) {
                res.status(404).json({ message: "Favorite id not found" });
            } else {
                res.status(200).json(results[0]);
            }
        } else {
            res.status(500).json(error);
        }
    });
};

exports.deleteFavoriteById = (req, res) => {
    let { user_id,audio_id } = req.body;
    var query = "DELETE FROM favorites WHERE  audio_id = ? and user_id = ?";
    connection.query(query, [audio_id,user_id], (error, results) => {
        if (!error) {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: " Id does not found" });
            } else {
                res.status(200).json({ message: "Favorite deleted successfully!" });
            }
        } else {
            res.status(500).json(error);
        }
    });
};

exports.deleteAllFavorites = (req, res) => {
    let query = "DELETE FROM favorites";
    connection.query(query, (error, results) => {
        if (!error) {
            res.status(200).json({ message: "All favorites deleted successfully!" });
        } else {
            res.status(500).json(error);
        }
    })
};
