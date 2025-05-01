// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs").promises;
// const ptp = require("pdf-to-printer");
// const os = require("os"); // For detecting the operating system

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     console.log(`Received file: ${file.originalname}, mime: ${file.mimetype}`);
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF files are allowed"), false);
//     }
//   },
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

// // Printer names for each platform (replace with your printer names)
// const PRINTER_NAMES = {
//   win32: "Epson L3150 Series", // Windows printer name
//   darwin: "Epson_L3150_Series", // macOS printer name (update after testing)
// };

// // Get the platform-specific printer name
// const getPrinterName = () => {
//   const platform = os.platform();
//   const printerName = PRINTER_NAMES[platform] || null;
//   console.log(`Platform detected: ${platform}, using printer: ${printerName}`);
//   return printerName;
// };

// // Get available printers
// router.get("/printers", async (req, res) => {
//   try {
//     console.log("Fetching available printers");
//     const printers = await ptp.getPrinters();
//     console.log("Printers found:", printers);
//     res.json({ printers });
//   } catch (error) {
//     console.error("Error fetching printers:", error);
//     res.status(500).json({ error: "Failed to get printer list", details: error.message });
//   }
// });

// // Print route
// router.post("/", upload.single("pdfFile"), async (req, res) => {
//   let tempFilePath;
//   try {
//     console.log("Received print request");
//     if (!req.file) {
//       console.error("No PDF file provided in request");
//       return res.status(400).json({ error: "No PDF file provided" });
//     }

//     console.log(`Processing PDF: ${req.file.originalname}, size: ${req.file.size} bytes`);
//     const tempDir = path.join(__dirname, "../temp");
//     await fs.mkdir(tempDir, { recursive: true });
//     tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);

//     console.log(`Writing PDF to temporary file: ${tempFilePath}`);
//     await fs.writeFile(tempFilePath, req.file.buffer);

//     const printerName = getPrinterName();
//     console.log(`Selected printer: ${printerName}`);

//     if (!printerName) {
//       console.error("No printer specified for this platform");
//       return res.status(400).json({ error: "No printer specified for this platform" });
//     }

//     console.log(`Sending PDF to printer: ${printerName}`);
//     const printOptions = {
//       printer: printerName,
//     };

//     // Add SumatraPDF path for Windows if not in PATH
//     if (os.platform() === "win32") {
//       // Uncomment and set the path if needed
//       // printOptions.sumatraPdfPath = "C:\\Path\\To\\SumatraPDF.exe";
//     }

//     await ptp.print(tempFilePath, printOptions);

//     console.log("PDF sent to printer successfully");
//     res.json({
//       success: true,
//       message: "Document sent to printer",
//       printer: printerName,
//     });
//   } catch (error) {
//     console.error("Error in print route:", error.stack);
//     res.status(500).json({
//       error: "Failed to print document",
//       details: error.message,
//     });
//   } finally {
//     if (tempFilePath) {
//       try {
//         console.log(`Cleaning up temporary file: ${tempFilePath}`);
//         await fs.unlink(tempFilePath);
//       } catch (err) {
//         console.error("Error removing temporary file:", err);
//       }
//     }
//   }
// });

// module.exports = router;

//============================================================================

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs").promises;
// const ptp = require("pdf-to-printer");
// const os = require("os");
// const { exec } = require("child_process");
// const util = require("util");
// const execPromise = util.promisify(exec);

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     console.log(`Received file: ${file.originalname}, mime: ${file.mimetype}`);
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF files are allowed"), false);
//     }
//   },
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// const PRINTER_NAMES = {
//   win32: "Epson L3150 Series",
//   darwin: "HP_LaserJet_Professional_P_1102w",
// };

// const getPrinterName = () => {
//   const platform = os.platform();
//   const printerName = PRINTER_NAMES[platform] || null;
//   console.log(`Platform detected: ${platform}, using printer: ${printerName}`);
//   return printerName;
// };

// // Fallback function to get printers on macOS using lpstat
// const getPrintersFallback = async () => {
//   if (os.platform() !== "darwin") {
//     throw new Error("Fallback only supported on macOS");
//   }
//   try {
//     console.log("Falling back to lpstat to get printers");
//     const { stdout } = await execPromise("lpstat -p");
//     const printers = stdout
//       .split("\n")
//       .filter((line) => line.startsWith("printer"))
//       .map((line) => {
//         const name = line.split(" ")[1];
//         return { name, isDefault: line.includes("is default") };
//       });
//     console.log("Printers found via lpstat:", printers);
//     return printers;
//   } catch (error) {
//     console.error("Error in lpstat fallback:", error);
//     throw error;
//   }
// };

// // Get available printers
// router.get("/printers", async (req, res) => {
//   try {
//     console.log("Fetching available printers");
//     let printers;
//     try {
//       printers = await ptp.getPrinters();
//     } catch (ptpError) {
//       console.error("pdf-to-printer failed to get printers:", ptpError.message);
//       if (os.platform() === "darwin") {
//         console.log("Attempting fallback to lpstat on macOS");
//         printers = await getPrintersFallback();
//       } else {
//         throw ptpError;
//       }
//     }
//     console.log("Printers found:", printers);
//     res.json({ printers });
//   } catch (error) {
//     console.error("Error fetching printers:", error.message, error.stack);
//     res.status(500).json({ error: "Failed to get printer list", details: error.message });
//   }
// });

// // Fallback printing on macOS using lp directly
// const printWithLp = async (filePath, printerName) => {
//   try {
//     // Quote the file path to handle spaces
//     const quotedFilePath = `"${filePath}"`;
//     console.log(`Using lp to print on macOS: lp -d ${printerName} ${quotedFilePath}`);
//     const { stdout, stderr } = await execPromise(`lp -d ${printerName} ${quotedFilePath}`);
//     console.log("lp output:", stdout);
//     if (stderr) console.error("lp stderr:", stderr);
//     return true;
//   } catch (error) {
//     console.error("Error printing with lp:", error.message, error.stderr);
//     throw error;
//   }
// };

// // Print route
// router.post("/", upload.single("pdfFile"), async (req, res) => {
//   let tempFilePath;
//   try {
//     console.log("Received print request");
//     if (!req.file) {
//       console.error("No PDF file provided in request");
//       return res.status(400).json({ error: "No PDF file provided" });
//     }

//     console.log(`Processing PDF: ${req.file.originalname}, size: ${req.file.size} bytes`);
//     const tempDir = path.join(__dirname, "../temp");
//     await fs.mkdir(tempDir, { recursive: true });
//     tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);

//     console.log(`Writing PDF to temporary file: ${tempFilePath}`);
//     await fs.writeFile(tempFilePath, req.file.buffer);

//     const printerName = getPrinterName();
//     console.log(`Selected printer: ${printerName}`);

//     if (!printerName) {
//       console.error("No printer specified for this platform");
//       return res.status(400).json({ error: "No printer specified for this platform" });
//     }

//     console.log(`Sending PDF to printer: ${printerName}`);
//     let printSuccess = false;
//     if (os.platform() === "darwin") {
//       // Skip ptp.print since it consistently fails on macOS
//       console.log("Using lp directly on macOS");
//       await printWithLp(tempFilePath, printerName);
//       printSuccess = true;
//     } else {
//       // Windows
//       const printOptions = { printer: printerName };
//       await ptp.print(tempFilePath, printOptions);
//       printSuccess = true;
//     }

//     console.log("PDF sent to printer successfully");
//     res.json({
//       success: true,
//       message: "Document sent to printer",
//       printer: printerName,
//     });
//   } catch (error) {
//     console.error("Error in print route:", error.message || error, error.stack);
//     res.status(500).json({
//       error: "Failed to print document",
//       details: error.message || "Unknown error",
//     });
//   } finally {
//     if (tempFilePath) {
//       try {
//         console.log(`Cleaning up temporary file: ${tempFilePath}`);
//         await fs.unlink(tempFilePath);
//       } catch (err) {
//         console.error("Error removing temporary file:", err);
//       }
//     }
//   }
// });

// module.exports = router;

//=====================================================================
//================== FULL CODE WITH FALLBACK HARDCODDED NAMES AND DEFAULT PRINTERS SELECTION =======================================
//======================================================================

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const ptp = require("pdf-to-printer");
const os = require("os");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

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
  limits: { fileSize: 10 * 1024 * 1024 },
});

const PRINTER_NAMES = {
  win32: "BIXOLON SRP-E300 (Copy 1)",
  darwin: "HP_LaserJet_Professional_P_1102w",
};

// Function to get the printer name, prioritizing the default printer with a fallback to hardcoded printers
const getPrinterName = async () => {
  const platform = os.platform();
  const fallbackPrinter = PRINTER_NAMES[platform] || null;
  console.log(`Platform detected: ${platform}, fallback printer: ${fallbackPrinter}`);

  try {
    let printers;
    if (platform === "darwin") {
      // On macOS, use lpstat to get printers
      printers = await getPrintersFallback();
    } else {
      // On Windows, use pdf-to-printer
      printers = await ptp.getPrinters();
    }

    console.log("Available printers:", printers);

    // Find the default printer
    const defaultPrinter = printers.find((p) => (platform === "darwin" ? p.isDefault : p.default));
    if (defaultPrinter) {
      const defaultPrinterName = defaultPrinter.name;
      console.log(`Default printer found: ${defaultPrinterName}`);
      return defaultPrinterName;
    } else {
      console.log("No default printer found, falling back to hardcoded printer");
    }

    // If no default printer is found, fall back to the hardcoded printer
    if (fallbackPrinter) {
      // Verify the fallback printer exists in the list of available printers
      const printerExists = printers.some((p) => p.name === fallbackPrinter);
      if (printerExists) {
        console.log(`Using fallback printer: ${fallbackPrinter}`);
        return fallbackPrinter;
      } else {
        console.log(`Fallback printer ${fallbackPrinter} not available`);
      }
    }

    console.error("No suitable printer found");
    return null;
  } catch (error) {
    console.error("Error finding printer:", error.message);
    // If there's an error (e.g., failed to get printers), fall back to the hardcoded printer if defined
    if (fallbackPrinter) {
      console.log(`Error occurred, using fallback printer: ${fallbackPrinter}`);
      return fallbackPrinter;
    }
    return null;
  }
};

// Fallback function to get printers on macOS using lpstat
const getPrintersFallback = async () => {
  if (os.platform() !== "darwin") {
    throw new Error("Fallback only supported on macOS");
  }
  try {
    console.log("Falling back to lpstat to get printers");
    const { stdout } = await execPromise("lpstat -p");
    if (!stdout) {
      console.error("lpstat returned empty output");
      return [];
    }
    const printers = stdout
      .split("\n")
      .filter((line) => line.startsWith("printer"))
      .map((line) => {
        const name = line.split(" ")[1];
        return { name, isDefault: line.includes("is default") };
      });
    console.log("Printers found via lpstat:", printers);
    return printers;
  } catch (error) {
    console.error("Error in lpstat fallback:", error);
    return [];
  }
};

// Get available printers
router.get("/printers", async (req, res) => {
  try {
    console.log("Fetching available printers");
    let printers;
    try {
      printers = await ptp.getPrinters();
    } catch (ptpError) {
      console.error("pdf-to-printer failed to get printers:", ptpError.message);
      if (os.platform() === "darwin") {
        console.log("Attempting fallback to lpstat on macOS");
        printers = await getPrintersFallback();
      } else {
        throw ptpError;
      }
    }
    console.log("Printers found:", printers);
    res.json({ printers });
  } catch (error) {
    console.error("Error fetching printers:", error.message, error.stack);
    res.status(500).json({ error: "Failed to get printer list", details: error.message });
  }
});

// Fallback printing on macOS using lp directly
const printWithLp = async (filePath, printerName) => {
  try {
    // Quote the file path to handle spaces
    const quotedFilePath = `"${filePath}"`;
    console.log(`Using lp to print on macOS: lp -d ${printerName} ${quotedFilePath}`);
    const { stdout, stderr } = await execPromise(`lp -d ${printerName} ${quotedFilePath}`);
    console.log("lp output:", stdout);
    if (stderr) console.error("lp stderr:", stderr);
    return true;
  } catch (error) {
    console.error("Error printing with lp:", error.message, error.stderr);
    throw error;
  }
};

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

    const printerName = await getPrinterName();
    console.log(`Selected printer: ${printerName}`);

    if (!printerName) {
      console.error("No suitable printer found");
      return res.status(400).json({ error: "No suitable printer found" });
    }

    console.log(`Sending PDF to printer: ${printerName}`);
    let printSuccess = false;
    if (os.platform() === "darwin") {
      console.log("Using lp directly on macOS");
      await printWithLp(tempFilePath, printerName);
      printSuccess = true;
    } else {
      const printOptions = { printer: printerName };
      await ptp.print(tempFilePath, printOptions);
      printSuccess = true;
    }

    console.log("PDF sent to printer successfully");
    res.json({
      success: true,
      message: "Document sent to printer",
      printer: printerName,
    });
  } catch (error) {
    console.error("Error in print route:", error.message || error, error.stack);
    res.status(500).json({
      error: "Failed to print document",
      details: error.message || "Unknown error",
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