const express = require('express');
const mongoose = require('mongoose');
const port = 3004;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/appliedJobs")
    .then(()=>console.log('mongoDB connected'))
    .catch((err) => console.log(err))


const appliedSchema = new mongoose.Schema({
    jobId: String,
    appliedDate: String,
    userId: Number
})

const applied = mongoose.model('appliedSchema', appliedSchema);

app.post("/apply", async (req,res) => {

    try{
        const appJob = new applied({
            jobId: req.body.jobId,
            appliedDate: req.body.appliedDate,
            userId: req.body.userId
        })

        await appJob.save();

        res.json({
            msg: "job applied",
            jobDetails: appJob
        })
    }
    catch(err){
        res.json(err);
    }
})

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
    
})