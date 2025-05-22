import QRCode from "qrcode-generator";

// Function to generate QR code as base64 dataURL
const generateQRCode = (transactionID) => {
  try {
    // Create QR code with error correction level 'L' (Low)
    const qr = QRCode(0, 'L');
    
    // Set the data to be encoded - the transaction ID
    qr.addData(transactionID);
    
    // Calculate the optimal size of the QR code
    qr.make();
    
    // Get the QR code as a data URL
    const qrDataURL = qr.createDataURL(4); // Scale factor of 4
    
    // Return the data URL and size information
    return {
      dataURL: qrDataURL,
      // QR codes are square, so width equals height
      size: qr.getModuleCount() * 4 // Size in pixels based on scale factor
    };
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

export default generateQRCode;