const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const ptp = require("pdf-to-printer");
const os = require("os"); // For detecting the operating system

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log(`Received file: ${file.originalname}, mime: ${file.mimetype}`);
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Printer names for each platform (replace with your printer names)
const PRINTER_NAMES = {
  win32: "Epson L3150 Series", // Windows printer name
  darwin: "Epson_L3150_Series", // macOS printer name (update after testing)
};

// Get the platform-specific printer name
const getPrinterName = () => {
  const platform = os.platform();
  const printerName = PRINTER_NAMES[platform] || null;
  console.log(`Platform detected: ${platform}, using printer: ${printerName}`);
  return printerName;
};

// Get available printers
router.get("/printers", async (req, res) => {
  try {
    console.log("Fetching available printers");
    const printers = await ptp.getPrinters();
    console.log("Printers found:", printers);
    res.json({ printers });
  } catch (error) {
    console.error("Error fetching printers:", error);
    res.status(500).json({ error: "Failed to get printer list", details: error.message });
  }
});

// Print route
router.post("/", upload.single("pdfFile"), async (req, res) => {
  let tempFilePath;
  try {
    console.log("Received print request");
    if (!req.file) {
      console.error("No PDF file provided in request");
      return res.status(400).json({ error: "No PDF file provided" });
    }

    console.log(`Processing PDF: ${req.file.originalname}, size: ${req.file.size} bytes`);
    const tempDir = path.join(__dirname, "../temp");
    await fs.mkdir(tempDir, { recursive: true });
    tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);

    console.log(`Writing PDF to temporary file: ${tempFilePath}`);
    await fs.writeFile(tempFilePath, req.file.buffer);

    const printerName = getPrinterName();
    console.log(`Selected printer: ${printerName}`);

    if (!printerName) {
      console.error("No printer specified for this platform");
      return res.status(400).json({ error: "No printer specified for this platform" });
    }

    console.log(`Sending PDF to printer: ${printerName}`);
    const printOptions = {
      printer: printerName,
    };

    // Add SumatraPDF path for Windows if not in PATH
    if (os.platform() === "win32") {
      // Uncomment and set the path if needed
      // printOptions.sumatraPdfPath = "C:\\Path\\To\\SumatraPDF.exe";
    }

    await ptp.print(tempFilePath, printOptions);

    console.log("PDF sent to printer successfully");
    res.json({
      success: true,
      message: "Document sent to printer",
      printer: printerName,
    });
  } catch (error) {
    console.error("Error in print route:", error.stack);
    res.status(500).json({
      error: "Failed to print document",
      details: error.message,
    });
  } finally {
    if (tempFilePath) {
      try {
        console.log(`Cleaning up temporary file: ${tempFilePath}`);
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error("Error removing temporary file:", err);
      }
    }
  }
});

module.exports = router;