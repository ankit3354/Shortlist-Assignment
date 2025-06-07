require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const apiRoutes = require('./router/api')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'https://shortlist-assignment-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json())
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send("Healthy Server!")
})

app.use('/api', apiRoutes)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${3000}`)
})