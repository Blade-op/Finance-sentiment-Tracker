const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { format } = require('fast-csv');
const PDFDocument = require('pdfkit');

// Example data to export (replace with real data source)
const sampleData = [
  { name: 'John Doe', email: 'john@example.com', score: 95 },
  { name: 'Jane Smith', email: 'jane@example.com', score: 88 },
];

// Export to CSV
router.get('/csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
  const csvStream = format({ headers: true });
  csvStream.pipe(res);
  sampleData.forEach(row => csvStream.write(row));
  csvStream.end();
});

// Export to PDF
router.get('/pdf', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="data.pdf"');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(18).text('Exported Data', { align: 'center' });
  doc.moveDown();
  sampleData.forEach(row => {
    doc.fontSize(12).text(`Name: ${row.name}, Email: ${row.email}, Score: ${row.score}`);
  });
  doc.end();
});

module.exports = router;