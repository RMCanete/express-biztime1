const express = require("express");
const ExpressError = require("../expressError");
const slugify = require("slugify")
const db = require("../db");
let router =  new express.Router();

router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT code, name FROM companies`);
      return res.json({ "companies": results.rows });
    } catch (e) {
      return next(e);
    }
});

router.get('/:code', async (req, res, next) => {
    try {
      let { code } = req.params;

      const companyResults = await db.query(
          `SELECT code, name, description FROM companies WHERE code = $1`, [code])
    
      const invoiceResults = await db.query(
          `SELECT id FROM invoices WHERE comp_code = $1`, [code])
      
      const industryResults = await db.query(
            `SELECT id, industry FROM industries WHERE comp_code = $1`, [code])

      if (companyResults.rows.length === 0) {
        throw new ExpressError(`Can't find code of ${code}`, 404)
      }
      let company = companyResults.rows[0];
      let invoices = invoiceResults.rows;
      let industries = industryResults.rows;

      company.invoices = invoices.map(invoice => invoice.id)
      company.industries = industries.map(industry => industry.industry)
      return res.send({ "company": company })
    } catch (e) {
      return next(e)
    }
});

router.post('/', async (req, res, next) => {
    try {
      let { name, description } = req.body;
      let code = slugify(name, {lower:true});

      const results = await db.query(
          'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
      return res.status(201).json({ "company": results.rows[0] })
    } catch (e) {
      return next(e)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
      let { code } = req.params;
      let { name, description } = req.body;

      const results = await db.query(
          `UPDATE companies SET name=$1, description=$2 WHERE code = $3 
          RETURNING code, name, description`, [name, description, code]);
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't find code of ${code}`, 404)
      }
      return res.send({ "company": results.rows[0] })
    } catch (e) {
      return next(e)
    }
});

router.delete('/:code', async (req, res, next) => {
    try {
      let { code } = req.params;

      const results = await db.query(
          'DELETE FROM companies WHERE code = $1 RETURNING code', [code])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't find code of ${code}`, 404)
      }
      return res.json({ status: "deleted" })
    } catch (e) {
      return next(e)
    }
})

  module.exports = router;