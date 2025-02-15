const e = require("express");
const connection = require("../connection");

exports.addAudioFile = (req, res) => {

    let { title, book_id,youtube_url } = req.body;
    var query = "INSERT INTO audiofiles (title,book_id, youtube_url) VALUES (?,?,?)";
    connection.query(query, [title,book_id, youtube_url], (error, results) => {
        if(!error){
            return res.status(200).json({message: "Audio file added successfully!",data: results});
        }else{
            return res.status(500).json(error);
        }
    });
};

exports.getAllAudioFiles = (req, res) => {
    
    var query = "SELECT * FROM audiofiles";
    connection.query(query, (error, results) => {
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error);
        }
    })
};

exports.updateAudioFileById = (req, res) => {

    let { title, youtube_url } = req.body;
    var query = "UPDATE audiofiles SET title = ?, youtube_url = ? WHERE audio_id = ?";
    connection.query(query, [title, youtube_url, req.params.id], (error, results) => {
        if(!error){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Audio file id not found"});
            }else{
                return res.status(200).json({message: "Audio file updated successfully!"});
            }
        }else{
            return res.status(500).json(error);
        }
    });
};

exports.getAudioFileById = (req, res) => {

    var query = "SELECT * FROM audiofiles WHERE audio_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if(!error){
            if(results.length <= 0){
                return res.status(404).json({message: "Audio file id not found"});
            }else{
                return res.status(200).json(results[0]);
            }
        }else{
            return res.status(500).json(error);
        }
    });
};

exports.getAudioFileByBookId = (req, res) => {

    let {id} = req.params;
    var query = "SELECT * FROM audiofiles WHERE book_id=?";
    connection.query(query, [id], (error, results) => {
        if(!error){
            if(results.length <= 0){
                return res.status(404).json({message: "Book id not found"});
            }else{
                return res.status(200).json(results);
            }
        }else{
            return res.status(500).json(error);
        }
    });
};

exports.deleteAudioFileById = (req, res) => {

    var query = "DELETE FROM audiofiles WHERE audio_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if(!error){
            return res.status(200).json({message: "Audio file deleted successfully!"});
        }else{
            return res.status(500).json(error);
        }
    });
};
