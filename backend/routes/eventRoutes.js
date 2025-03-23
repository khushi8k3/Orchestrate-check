/*const express = require("express");
const { getCompiledReport } = require("../controllers/eventController");

const router = express.Router();
router.get("/compiledReport", getCompiledReport);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getComprehensiveReport } = require("../controllers/eventController");

// This route returns the aggregated comprehensive report.
router.get("/compiledReport", getComprehensiveReport);

module.exports = router;*/
const express = require("express");
const router = express.Router();
const { getDetailedReport, getCompiledReport } = require("../controllers/eventController");

router.get("/detailedReport", getDetailedReport);
router.get("/compiledReport", getCompiledReport);

module.exports = router;

