require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const apiRoutes = require('./router/api')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

const CorsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'CREATE', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(express.json())
app.use(cors(CorsOptions));
app.use(cors({ origin: 'https://shortlist-assignment-frontend.vercel.app/' }));


app.get('/', (req, res) => {
    res.send("Healthy Server!")
})

app.use('/api', apiRoutes)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${3000}`)
})