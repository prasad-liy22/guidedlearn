const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 

const coursesDatabase = require('./database.json');


app.get('/courses', (req, res) => {
    res.json(coursesDatabase);
});


app.post('/courses', (req, res) => {
    const newCourse = req.body;
    
    newCourse.id = coursesDatabase.length + 1; 
    
    coursesDatabase.push(newCourse); 
    
    res.status(201).json(newCourse); 
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});