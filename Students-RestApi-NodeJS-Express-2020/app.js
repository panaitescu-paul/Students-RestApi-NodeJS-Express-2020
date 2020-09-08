const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = 3000;
const fs = require('fs');

// CREATE a student
app.post("/api/students", (req, res) => {
    console.log("req.body: ", req.body);
    let student = req.body;
    let jsonData = fs.readFileSync('students.json');
    let students = JSON.parse(jsonData);
    let numberOfStudents = Object.keys(students).length;
    students[`student_${numberOfStudents + 1}`] = student;
    fs.writeFileSync('students.json', JSON.stringify(students));

    res.json({
        status: 200,
        message: 'Student successfully added!',
        student
    });
});

// READ all students
app.get("/api/students", (req, res) => {
    let jsonData = fs.readFileSync('students.json');
    let students = JSON.parse(jsonData);

    console.log("students:", students);
    res.json({
        status: 200,
        students
    });
});

// READ a specific student by id
app.get("/api/students/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let jsonData = fs.readFileSync('students.json');
    let students = JSON.parse(jsonData);
    let student = students[`student_${req.params.id}`];

    console.log("student:", student);
    res.json({
        status: 200,
        student
    });
});

// DELETE a specific student by id
app.delete("/api/students/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let jsonData = fs.readFileSync('students.json');
    let students = JSON.parse(jsonData);
    let student = students[`student_${req.params.id}`];
    delete students[`student_${req.params.id}`];
    fs.writeFileSync('students.json', JSON.stringify(students));

    console.log("students:", students);
    res.json({
        status: 200,
        message: 'Student successfully deleted!',
        student
    });
});

// UPDATE a specific student by id
app.put("/api/students/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    console.log("req.body: ",  req.body);
    let jsonData = fs.readFileSync('students.json');
    let students = JSON.parse(jsonData);
    let studentFound = false;

    for (let i=1; i<=Object.keys(students).length; i++) {
       if(students[`student_${i}`] === students[`student_${req.params.id}`]) {  // if the student id exists in the json file
           students[`student_${req.params.id}`] = req.body;
           let student = students[`student_${req.params.id}`];
           fs.writeFileSync('students.json', JSON.stringify(students));

           res.json({
               status: 200,
               message: 'Student successfully updated!',
               student
           });
           studentFound = true;
           break;
       }
    }
    if (!studentFound) {
        res.json({
            status: 404,
            message: 'Student not found!'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
