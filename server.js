const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

app.get('/api/graph', (req, res) => {
    res.sendFile(path.join(__dirname, './public/data/graph.json'))
    console.log('Send graph data')
})

app.listen(3000)