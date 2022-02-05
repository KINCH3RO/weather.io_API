require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use((req,res,next)=>{
    console.log("call")
    next()
})
const weatherRoutes = require('./routes/weatherApi')

weatherRoutes(app)




let PORT = process.env.PORT || 4200
app.listen(PORT, () => {
    console.log("Your app is listening on PORT " + PORT);
    console.log("link : http://localhost:" + PORT);
})