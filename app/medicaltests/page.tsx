"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MedicalTestsPage() {
  const [tests, setTests] = useState([]);

  // Fetch data with the JOIN requirement
  useEffect(() => {
    fetch('/api/medical-tests') // We will create this API route next
      .then((res) => res.json())
      .then((data) => setTests(data));
  }, []);

  // --- Part D: Export to Excel ---
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medical Tests");
    XLSX.writeFile(workbook, "Medical_Tests_Report.xlsx");
  };

  // --- Part D: Export to PDF ---
 const exportToPDF = () => {
  try {
    const doc = new jsPDF();
    
    // Add a title
    doc.setFontSize(18);
    doc.text("Medical Tests Report", 14, 20);
    
    // Call autoTable directly using the 'doc' as the first argument
    autoTable(doc, {
      startY: 30,
      head: [['Test Name', 'Category', 'Unit', 'Min', 'Max']],
      body: tests.map((t: any) => [
        t.name, 
        t.category, 
        t.unit, 
        t.normalmin, 
        t.normalmax
      ]),
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38] } // Red color to match your button
    });

    doc.save("Medical_Tests_Report.pdf");
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate PDF. Check console for details.");
  }
};
  return (
    <div className="p-8 bg-white min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Tests Management</h1>
        <div className="space-x-4">
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">Download Excel</button>
          <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded">Print to PDF</button>
        </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Test Name</th>
            <th className="border p-2 text-left">Category Name</th>
            <th className="border p-2 text-left">UOM Name</th>
            <th className="border p-2 text-center">Normal Min</th>
            <th className="border p-2 text-center">Normal Max</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test: any, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border p-2">{test.name}</td>
              <td className="border p-2">{test.category}</td>
              <td className="border p-2">{test.unit}</td>
              <td className="border p-2 text-center">{test.normalmin}</td>
              <td className="border p-2 text-center">{test.normalmax}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}