// server/controllers/studentscontroller.js
const mysql = require("mysql");

const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Basic CRUD operations
exports.view = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        connection.query("SELECT * FROM coustom", (err, rows) => {
            connection.release();
            if(!err) {
                res.render("home", { rows });
            } else {
                console.log("Error in listing data " + err);
            }
        });
    });
};

exports.adduser = (req, res) => {
    res.render("adduser");
};

exports.save = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const { name, grade, age, dob, address, mobile } = req.body;
        connection.query("INSERT INTO coustom (NAME, GRADE, AGE, DOB, ADDRESS, MOBILE) VALUES (?, ?, ?, ?, ?, ?)",
            [name, grade, age, dob, address, mobile],
            (err, rows) => {
                connection.release();
                if(!err) {
                    res.render("adduser", { msg: "User data added successfully" });
                } else {
                    console.log("Error in listing data " + err);
                }
            }
        );
    });
};

exports.edituser = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        let id = req.params.id;
        connection.query("SELECT * FROM coustom WHERE ID = ?", [id], (err, rows) => {
            connection.release();
            if(!err) {
                res.render("edituser", { rows });
            } else {
                console.log("Error in listing data " + err);
            }
        });
    });
};

exports.edit = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const { name, grade, age, dob, address, mobile } = req.body;
        let id = req.params.id;
        connection.query("UPDATE coustom SET NAME=?, GRADE=?, AGE=?, DOB=?, ADDRESS=?, MOBILE=? WHERE ID=?",
            [name, grade, age, dob, address, mobile, id],
            (err, rows) => {
                connection.release();
                if(!err) {
                    connection.query("SELECT * FROM coustom WHERE ID=?", [id], (err, rows) => {
                        if(!err) {
                            res.render("edituser", { rows, msg: "User data updated successfully" });
                        }
                    });
                } else {
                    console.log("Error in listing data " + err);
                }
            }
        );
    });
};

exports.delete = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        let id = req.params.id;
        connection.query("DELETE FROM coustom WHERE ID=?", [id], (err, rows) => {
            connection.release();
            if(!err) {
                res.redirect("/");
            } else {
                console.log(err);
            }
        });
    });
};

// Marks related operations
exports.viewMarks = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const studentId = req.params.id;

        connection.query("SELECT * FROM coustom WHERE ID = ?", [studentId], (err, studentRows) => {
            if(err) {
                connection.release();
                console.log("Error fetching student: " + err);
                return;
            }

            connection.query("SELECT * FROM student_marks WHERE student_id = ?",
                [studentId],
                (err, markRows) => {
                    connection.release();
                    if(!err) {
                        res.render("viewMarks", {
                            student: studentRows[0],
                            marks: markRows
                        });
                    } else {
                        console.log("Error fetching marks: " + err);
                    }
                }
            );
        });
    });
};

exports.addMarksForm = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const studentId = req.params.id;
        connection.query("SELECT * FROM coustom WHERE ID = ?", [studentId], (err, rows) => {
            connection.release();
            if(!err) {
                res.render("addMarks", { student: rows[0] });
            } else {
                console.log("Error fetching student: " + err);
            }
        });
    });
};

exports.saveMarks = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const { subject_name, marks } = req.body;
        const studentId = req.params.id;

        connection.query(
            "INSERT INTO student_marks (student_id, subject_name, marks) VALUES (?, ?, ?)",
            [studentId, subject_name, marks],
            (err, result) => {
                connection.release();
                if(!err) {
                    res.redirect(`/student/${studentId}/marks`);
                } else {
                    console.log("Error saving marks: " + err);
                }
            }
        );
    });
};

exports.editMarksForm = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const { id: studentId, markId } = req.params;

        connection.query(
            "SELECT m.*, c.NAME as student_name FROM student_marks m JOIN coustom c ON m.student_id = c.ID WHERE m.mark_id = ? AND m.student_id = ?",
            [markId, studentId],
            (err, rows) => {
                connection.release();
                if(!err) {
                    res.render("editMarks", { mark: rows[0], studentId });
                } else {
                    console.log("Error fetching mark details: " + err);
                }
            }
        );
    });
};

exports.updateMarks = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const { subject_name, marks } = req.body;
        const { id: studentId, markId } = req.params;

        connection.query(
            "UPDATE student_marks SET subject_name = ?, marks = ? WHERE mark_id = ? AND student_id = ?",
            [subject_name, marks, markId, studentId],
            (err, result) => {
                connection.release();
                if(!err) {
                    res.redirect(`/student/${studentId}/marks`);
                } else {
                    console.log("Error updating marks: " + err);
                }
            }
        );
    });
};

exports.deleteMarks = (req, res) => {
    con.getConnection((err, connection) => {
        if(err) throw err;
        const { id: studentId, markId } = req.params;

        connection.query(
            "DELETE FROM student_marks WHERE mark_id = ? AND student_id = ?",
            [markId, studentId],
            (err, result) => {
                connection.release();
                if(!err) {
                    res.redirect(`/student/${studentId}/marks`);
                } else {
                    console.log("Error deleting marks: " + err);
                }
            }
        );
    });
};