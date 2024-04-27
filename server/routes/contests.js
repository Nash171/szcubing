var express = require('express');
var router = express.Router();

// contests route  
router.get("/", (req, res) => {
    res.json({
        contests: [
            { id: 1, name: "Test Contest 1", type: "3x3x3", started: new Date(), end: new Date(), compete: true },
            { id: 2, name: "Test Contest 2", type: "2x2x2", started: new Date(), end: new Date(), compete: false },
            { id: 3, name: "Test Contest 3", type: "4x4x4", started: new Date(), end: new Date(), compete: true },
        ]
    })
});

module.exports = router;