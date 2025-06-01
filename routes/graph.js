const path = require('path');

const express = require('express');
const router = express.Router();

// returns graph with all nodes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/data/graph.json'));
});

module.exports = router;