require('dotenv').config()

const express = require('express')
const weatherRoutes = require('./routes/weatherApi')
const cors = require('cors')
const app = express()
app.use(cors())
app.use((req,res,next)=>{
    console.log("call url : "+req.url)
    next()
})


app.get('/api',(req,res)=>{
    res.send('Api running')
})

weatherRoutes(app)




let PORT = process.env.PORT || 4200
app.listen(PORT, () => {
    console.log("Your app is listening on PORT " + PORT);
    console.log("link : http://localhost:" + PORT);
})