require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const apiRoutes = require('./router/api')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(express.json())
app.use(cors()); 


app.get('/', (req, res) => {
    res.send("Healthy Server!")
})

app.use('/api', apiRoutes)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${3000}`)
})