const connection = require('../connection');

exports.addBook = (req, res) => {

    let { title, author, description, cover_image_url } = req.body;
    var query = "INSERT INTO books (title, author, description, cover_image_url) VALUES (?, ?, ?, ?)";
    connection.query(query, [title, author, description, cover_image_url], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "Book added successfully!", data: results });
        }
    });
};

exports.getAllBooks = (req, res) => {

    var query = "SELECT * FROM books";
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};

exports.updateBooksById = (req, res) => {

    let { title, author, description, cover_image_url } = req.body;
    var query = "UPDATE books SET title = ?, author = ?, description = ?, cover_image_url = ? WHERE book_id = ?";
    connection.query(query, [title, author, description, cover_image_url, req.params.id], (error, results) => {
        if (!error) {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Book id not found" });
            } else {
                res.status(200).json({ message: "Book updated successfully!" });
            }
        } else {
            res.status(500).json(error);
        }
    });
};

exports.getBookById = (req, res) => {

    var query = "SELECT * FROM books WHERE book_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if (!error) {
            if (results.length <= 0) {
                res.status(404).json({ message: "Book id not found" });
            } else {
                res.status(200).json(results[0]);
            }
        } else {
            res.status(500).json(error);
        }
    });
};

exports.deleteBookById = (req, res) => {

    var query = "DELETE FROM books WHERE book_id = ?";
    connection.query(query, [req.params.id], (error, results) => {
        if (!error) {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Book id not found" });
            } else {
                res.status(200).json({ message: "Book deleted successfully!" });
            }
        } else {
            res.status(500).json(error);
        }
    });
};
