const express = require("express");
const ExpressError = require("../expressError");
const slugify = require("slugify")
const db = require("../db");
let router =  new express.Router();

router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT industry_code, industry, comp_code 
      FROM industries`);
      return res.json({ "industries": results.rows });
    } catch (e) {
      return next(e);
    }
});


router.post('/', async (req, res, next) => {
    try {
      let { industry_code, industry, company_id, comp_code } = req.body;

      const results = await db.query(
          `INSERT INTO industries (industry_code, industry, company_id, comp_code ) VALUES ($1, $2, $3, $4)
           RETURNING industry_code, industry, company_id, comp_code `, 
           [industry_code, industry, company_id, comp_code ]);
      return res.status(201).json({ "industry": results.rows[0] })
    } catch (e) {
      return next(e)
    }
})


  module.exports = router;