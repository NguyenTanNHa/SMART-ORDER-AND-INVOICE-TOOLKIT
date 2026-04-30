import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Order } from "./db";

export function generateInvoicePDF(order: Order) {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set default font
  doc.setFont("helvetica");

  // Title / Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text("INVOICE", 14, 20);

  // Company Info (Placeholder)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Smart Order & Invoice Toolkit", 14, 28);
  doc.text("123 Business Road, Tech City", 14, 33);
  doc.text("support@smarttoolkit.com", 14, 38);

  // Invoice Details
  const rightColX = 140;
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`Invoice # ${order.id?.slice(-6).toUpperCase() || 'DRAFT'}`, rightColX, 28);
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  doc.text(`Date: ${dateStr}`, rightColX, 33);
  
  // Bill To Section
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Bill To:", 14, 52);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(order.customerName, 14, 58);
  let currentY = 63;
  if (order.customerEmail) {
    doc.text(`Email: ${order.customerEmail}`, 14, currentY);
    currentY += 5;
  }
  if (order.phone) {
    doc.text(`Phone: ${order.phone}`, 14, currentY);
  }

  // Draw Line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 70, 196, 70);

  // Order Items Table
  const tableBody = order.items.map(item => {
    return [item.productName, item.quantity.toString(), `$${item.price.toFixed(2)}`, `$${(item.quantity * item.price).toFixed(2)}`];
  });

  autoTable(doc, {
    startY: 75,
    head: [["Description", "Quantity", "Unit Price", "Total"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: [31, 41, 55], // text-slate-800
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // Calculate final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY || 100;

  // Add Summary / Total
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Total Due:", 140, finalY + 15);
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55); // Primary dark color
  doc.text(`$${order.totalAmount.toFixed(2)}`, 165, finalY + 15, { align: "left" });

  // Add footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });

  // Save the PDF
  doc.save(`Invoice_${order.id || 'DRAFT'}.pdf`);
}
