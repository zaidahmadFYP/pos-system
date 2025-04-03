import { jsPDF } from "jspdf";

const generateDocketSlip = ({ selectedItems, subtotal, tax, total, transactionID, type, paymentMethod }) => {
  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 150 + selectedItems.length * 10], // 80mm wide, height adjusts based on content
  });

  // Set font and size
  doc.setFont("Courier");
  doc.setFontSize(10);

  let yPosition = 10; // Starting Y position for text

  // Header based on type
  if (type === "paid") {
    doc.text("***** PAID TRANSACTION RECEIPT *****", 40, yPosition, { align: "center" });
  } else {
    doc.text("***** TEMPORARY RECEIPT *****", 40, yPosition, { align: "center" });
  }
  yPosition += 5;
  doc.text("CASHIER #3", 40, yPosition, { align: "center" });
  yPosition += 5;
  const currentDateTime = new Date().toLocaleString();
  doc.text(currentDateTime, 40, yPosition, { align: "center" });
  yPosition += 5;

  // Add Transaction ID
  doc.text(`Transaction ID: ${transactionID}`, 40, yPosition, { align: "center" });
  yPosition += 5;

  // Divider
  doc.setLineWidth(0.5);
  doc.setDrawColor(0);
  doc.line(10, yPosition, 70, yPosition, "S"); // Dashed line
  yPosition += 5;

  // Items
  selectedItems.forEach((item, index) => {
    // Handle long item names by splitting them if necessary
    const itemName = `ITEM ${index + 1}: ${item.name}`;
    const maxWidth = 50; // Maximum width for the item name in mm
    const splitText = doc.splitTextToSize(itemName, maxWidth);
    splitText.forEach(line => {
      doc.text(line, 10, yPosition);
      yPosition += 5;
    });
    doc.text(`X${item.quantity}`, 20, yPosition);
    doc.text(`$${item.price.toFixed(2)}`, 70, yPosition, { align: "right" });
    yPosition += 5;
  });

  // Divider
  doc.line(10, yPosition, 70, yPosition, "S");
  yPosition += 5;

  // Totals
  doc.text("SUBTOTAL", 10, yPosition);
  doc.text(`$${subtotal.toFixed(2)}`, 70, yPosition, { align: "right" });
  yPosition += 5;
  doc.text("TAX", 10, yPosition);
  doc.text(`$${tax.toFixed(2)}`, 70, yPosition, { align: "right" });
  yPosition += 5;
  doc.text("TOTAL AMOUNT", 10, yPosition);
  doc.text(`$${total.toFixed(2)}`, 70, yPosition, { align: "right" });
  yPosition += 5;

  // Add Payment Method and Status for Paid Transaction
  if (type === "paid") {
    doc.text(`PAYMENT METHOD: ${paymentMethod.toUpperCase()}`, 10, yPosition);
    yPosition += 5;
    doc.text("STATUS: PAID", 10, yPosition);
    yPosition += 5;
  }

  // Divider
  doc.line(10, yPosition, 70, yPosition, "S");
  yPosition += 5;

  // Footer
  doc.text("THANK YOU FOR ORDERING!", 40, yPosition, { align: "center" });

  // Save the PDF with a filename
  const filename = type === "paid" ? `paid-transaction-${transactionID}.pdf` : `docket-slip-${transactionID}.pdf`;
  doc.save(filename);
};

export default generateDocketSlip;