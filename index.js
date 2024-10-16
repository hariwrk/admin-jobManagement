const express = require('express');
const mysql = require('mysql');
const axios = require('axios');

const app = express();
const port = 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  port:3306,
  user:'root',
  database:'job'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Sample route to fetch data
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Sample route to add data
app.post('/users', (req, res) => {
  const user = req.body;
  db.query('INSERT INTO users SET ?', user, (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, ...user });
  });
});

app.get('/jobs', async(req,res)=>{
    try{
        const response = await axios.get('http://localhost:3001/api/v1/admin/');
        res.json(response.data);
    }
    catch(err){
        console.error(err);
        res.json({msg:err});
    }
})

app.post('/apply', async (req,res) => {
  try{
  const {jobId,userId, appliedDate} = req.body;
  
  const apply = await axios.post("http://localhost:3004/apply",{
    jobId,
    userId,
    appliedDate
  })

  res.json({status: "applied",
    msg:apply.data.jobDetails
  })
  }
  catch(err){
    console.log(err);
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});