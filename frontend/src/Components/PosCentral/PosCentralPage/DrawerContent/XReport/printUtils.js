// frontend/src/utils/printUtils.js
const sendToPrinter = async (pdfDataUri, reportId) => {
    console.log(`Attempting to send PDF to printer for report: ${reportId}`);
    try {
      const base64Marker = "base64,";
      const base64Index = pdfDataUri.indexOf(base64Marker);
      if (base64Index === -1 || !pdfDataUri.startsWith("data:application/pdf")) {
        throw new Error("Unexpected PDF data URI format");
      }
  
      let base64Content = pdfDataUri.substring(base64Index + base64Marker.length).trim();
      const paddingNeeded = base64Content.length % 4;
      if (paddingNeeded) {
        base64Content += "=".repeat(4 - paddingNeeded);
      }
  
      const byteString = atob(base64Content);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
  
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const filename = `report-${reportId}.pdf`;
      const file = new File([blob], filename, { type: "application/pdf" });
  
      const formData = new FormData();
      formData.append("pdfFile", file);
  
      console.log(`Sending fetch request to http://localhost:5001/api/print for ${filename}`);
      const response = await fetch("http://localhost:5001/api/print", {
        method: "POST",
        body: formData,
      });
  
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
  
      console.log(`Response from /api/print:`, result);
  
      if (!response.ok) {
        throw new Error(result.error || `Failed to print - Status: ${response.status}`);
      }
  
      console.log("Print job submitted successfully:", result);
      return result;
    } catch (error) {
      console.error(`Error sending to printer for report ${reportId}:`, error.message, error.stack);
      throw error;
    }
  };
  
  export { sendToPrinter };