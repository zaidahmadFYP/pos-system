import { jsPDF } from "jspdf"
import generateQRCode from "./GenerateQRCode"

const loadImageAsBase64 = (url) => {
  console.log(`Loading image: ${url}`)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = url

    img.onload = () => {
      console.log(`Image loaded successfully: ${url}`)
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL("image/png")
      resolve({ dataURL, width: img.width, height: img.height })
    }

    img.onerror = (err) => {
      console.error(`Failed to load image: ${url}`, err)
      reject(new Error(`Failed to load image: ${url} - ${err.message}`))
    }
  })
}

const sendToPrinter = async (pdfDataUri, transactionID) => {
  console.log(`Attempting to send PDF to printer for transaction: ${transactionID}`)
  try {
    if (!pdfDataUri || typeof pdfDataUri !== "string") {
      throw new Error("Invalid or missing PDF data URI")
    }

    const base64Marker = "base64,"
    const base64Index = pdfDataUri.indexOf(base64Marker)
    if (base64Index === -1 || !pdfDataUri.startsWith("data:application/pdf")) {
      throw new Error("Unexpected PDF data URI format")
    }

    let base64Content = pdfDataUri.substring(base64Index + base64Marker.length).trim()
    if (!base64Content) {
      throw new Error("Could not extract base64 content from data URI")
    }

    const paddingNeeded = base64Content.length % 4
    if (paddingNeeded) {
      base64Content += "=".repeat(4 - paddingNeeded)
    }

    if (!/^[A-Za-z0-9+/=]+$/.test(base64Content)) {
      throw new Error("Base64 string contains invalid characters")
    }

    const byteString = atob(base64Content)
    const mimeType = "application/pdf"
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([arrayBuffer], { type: mimeType })
    const filename = `transaction-${transactionID}.pdf`
    const file = new File([blob], filename, { type: mimeType })

    const formData = new FormData()
    formData.append("pdfFile", file)

    console.log(`Sending fetch request to http://localhost:5001/api/print for ${filename}`)
    const response = await fetch("http://localhost:5001/api/print", {
      method: "POST",
      body: formData,
    })

    let result
    try {
      result = await response.json()
    } catch (jsonError) {
      console.error("Failed to parse response as JSON:", jsonError)
      const text = await response.text()
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
    }

    console.log(`Response from /api/print:`, result)

    if (!response.ok) {
      throw new Error(result.error || `Failed to print - Status: ${response.status}`)
    }

    console.log("Print job submitted successfully:", result)
    return result
  } catch (error) {
    console.error(`Error sending to printer for transaction ${transactionID}:`, error.message, error.stack)
    alert(`Failed to send receipt to printer for transaction ${transactionID}. Error: ${error.message}`)
    throw error
  }
}

const generateDocketSlip = async ({
  selectedItems,
  subtotal,
  tax,
  total,
  transactionID,
  type = "temporary",
  paymentMethod = "",
}) => {
  console.log(`Generating docket slip for transaction: ${transactionID}, type: ${type}`)
  try {
    const headerLogoUrl = "/images/loop.png"
    const headerLogoData = await loadImageAsBase64(headerLogoUrl)

    console.log(`Generating QR code for transaction: ${transactionID}`)
    const qrCodeData = generateQRCode(transactionID)
    if (!qrCodeData) {
      console.warn(`QR code generation failed for transaction: ${transactionID}`)
    }

    const footerLogoUrl = "/images/cheezious_logo.png"
    const footerLogoData = await loadImageAsBase64(footerLogoUrl)

    // Create PDF with the exact docker paper size of 80 x 3276 mm
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 3276], // Using the specific dock paper size
    })

    doc.setFont("courier", "normal")
    let y = 5 // Reduced top padding from 10 to 5

    const headerTargetWidth = 35
    const headerAspectRatio = headerLogoData.width / headerLogoData.height
    const headerCalculatedHeight = headerTargetWidth / headerAspectRatio
    const headerImgX = (80 - headerTargetWidth) / 2 - 2 // Shifted slightly left

    console.log(`Adding header logo at y=${y}`)
    doc.addImage(headerLogoData.dataURL, "PNG", headerImgX, y, headerTargetWidth, headerCalculatedHeight)
    y += headerCalculatedHeight + 6

    if (qrCodeData) {
      const qrTargetSize = 25
      const qrImgX = (80 - qrTargetSize) / 2 - 2 // Shifted slightly left to match other centered elements
      console.log(`Adding QR code at y=${y}`)
      doc.addImage(qrCodeData.dataURL, "PNG", qrImgX, y, qrTargetSize, qrTargetSize)
      y += qrTargetSize + 3
    }

    doc.setDrawColor(150, 150, 150)
    doc.setLineWidth(0.5)
    doc.line(3, y, 73, y) // Adjusted line position slightly to the left
    y += 4

    doc.setFontSize(11)
    doc.setFont("courier", "bold")
    if (type === "paid") {
      doc.text("***** PAID TRANSACTION RECEIPT *****", 38, y, { align: "center" })
    } else {
      doc.text("***** TEMPORARY RECEIPT *****", 38, y, { align: "center" })
    }
    y += 6

    doc.setFontSize(9)
    doc.setFont("courier", "normal")
    doc.text("CASHIER #3", 38, y, { align: "center" })
    y += 4

    const date = new Date()
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    doc.text(`${formattedDate}, ${formattedTime}`, 38, y, { align: "center" })
    y += 4

    doc.setFont("courier", "bold")
    doc.text(`Transaction ID: ${transactionID}`, 38, y, { align: "center" })
    y += 6

    doc.setDrawColor(100, 100, 100)
    doc.setLineWidth(0.7)
    doc.line(5, y, 75, y)
    y += 6

    doc.setFontSize(11)
    doc.setFont("courier", "bold")
    doc.text("Items", 6, y)
    y += 5
    doc.setFontSize(9)
    doc.setFont("courier", "normal")

    selectedItems.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248)
        doc.rect(3, y - 2, 70, 7 + (item.name.length > 25 ? 4 : 0), "F")
      }

      const itemName = `ITEM ${index + 1}: ${item.name}`
      const maxWidth = 52
      const splitText = doc.splitTextToSize(itemName, maxWidth)

      splitText.forEach((line, lineIndex) => {
        doc.text(line, 6, y + lineIndex * 4)
      })

      const lineCount = splitText.length
      y += (lineCount - 1) * 4

      doc.text(`X${item.quantity}`, 13, y + 4)

      // Only print price on paid receipts or LOOPAY temporary receipts
      if (type === "paid" || (type === "temporary" && paymentMethod.toUpperCase() === "LOOPAY")) {
        doc.text(`${item.price.toFixed(2)}`, 70, y + 4, { align: "right" })
      }

      y += 8
    })

    doc.setDrawColor(130, 130, 130)
    doc.setLineWidth(0.5)
    doc.line(5, y, 75, y)
    y += 1
    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(0.3)
    doc.line(5, y, 75, y)
    y += 5

    // Display the Summary section with pricing details for paid receipts or LOOPAY temporary receipts
    if (type === "paid" || (type === "temporary" && paymentMethod.toUpperCase() === "LOOPAY")) {
      doc.setFontSize(11)
      doc.setFont("courier", "bold")
      doc.text("Summary", 6, y)
      y += 5

      doc.setFontSize(9)
      doc.setFont("courier", "normal")

      doc.text("SUBTOTAL", 6, y)
      doc.text(`${subtotal.toFixed(2)}`, 70, y, { align: "right" })
      y += 4

      doc.text("TAX", 6, y)
      doc.text(`${tax.toFixed(2)}`, 70, y, { align: "right" })
      y += 5

      doc.setFillColor(240, 240, 240)
      doc.rect(3, y - 2, 70, 8, "F")

      doc.setFontSize(11)
      doc.setFont("courier", "bold")
      doc.text("TOTAL AMOUNT", 6, y + 2)
      doc.text(`${total.toFixed(2)}`, 70, y + 2, { align: "right" })
      y += 8
    }

    if (type === "paid") {
      doc.setDrawColor(130, 130, 130)
      doc.setLineWidth(0.5)
      doc.line(5, y, 75, y)
      y += 5

      doc.setFontSize(9)
      doc.setFont("courier", "bold")
      doc.text(`PAYMENT METHOD: ${paymentMethod.toUpperCase()}`, 38, y, { align: "center" })
      y += 4

      doc.text("STATUS: PAID", 38, y + 1, { align: "center" })
      y += 7
    } else {
      doc.setDrawColor(130, 130, 130)
      doc.setLineWidth(0.5)
      doc.line(5, y, 75, y)
      y += 5

      doc.setFontSize(9)
      doc.setFont("courier", "bold")
      doc.text(`PAYMENT METHOD: ${paymentMethod.toUpperCase()}`, 38, y, { align: "center" })
      y += 4

      doc.text("STATUS: NOT PAID", 38, y + 1, { align: "center" })
      y += 7
    }

    // Add LOOPAY QR code for temporary slips with LOOPAY payment method
    if (type === "temporary" && paymentMethod.toUpperCase() === "LOOPAY") {
      // Add a heading above the QR code
      doc.setFontSize(10)
      doc.setFont("courier", "bold")
      doc.text("SCAN QR CODE TO PAY", 38, y, { align: "center" })
      y += 5

      // Draw an arrow pointing down to the QR code
      doc.setDrawColor(0, 0, 0)
      doc.setFillColor(0, 0, 0)

      // Arrow pointing down
      const arrowX = 38
      const arrowY = y + 3
      const arrowWidth = 6

      // Draw arrow head
      doc.triangle(arrowX, arrowY + 5, arrowX - arrowWidth / 2, arrowY, arrowX + arrowWidth / 2, arrowY, "F")

      // Draw arrow body
      doc.setLineWidth(1.5)
      doc.line(arrowX, arrowY, arrowX, arrowY - 5)

      y += 10

      // Add a highlighted background for the QR code
      doc.setFillColor(245, 245, 245)

      const qrTargetWidth = 35
      const qrPadding = 4
      const qrBackgroundWidth = qrTargetWidth + qrPadding * 2
      const qrBackgroundX = (80 - qrBackgroundWidth) / 2

      // Load and display the LOOPAY QR code
      const loopayQRUrl = "/images/Solana_QR_Code.png"
      try {
        const loopayQRData = await loadImageAsBase64(loopayQRUrl)

        const qrAspectRatio = loopayQRData.width / loopayQRData.height
        const qrCalculatedHeight = qrTargetWidth / qrAspectRatio

        // Draw rounded rectangle background
        doc.roundedRect(qrBackgroundX, y - 2, qrBackgroundWidth, qrCalculatedHeight + qrPadding * 2, 2, 2, "F")

        // Draw QR code on top of background
        const qrImgX = (80 - qrTargetWidth) / 2
        doc.addImage(loopayQRData.dataURL, "PNG", qrImgX, y + qrPadding, qrTargetWidth, qrCalculatedHeight)

        y += qrCalculatedHeight + qrPadding * 2 + 2

        // Add a prompt below the QR code
        doc.setFontSize(9)
        doc.setFont("courier", "bold")
        doc.text("OPEN PHANTOM WALLET & SCAN", 38, y, { align: "center" })
        y += 4
        doc.setFontSize(8)
        doc.setFont("courier", "normal")
        //doc.text("Complete payment to confirm your order", 38, y, { align: "center" })

        //y += 8
      } catch (error) {
        console.error("Failed to load LOOPAY QR code:", error)
        y += 5
      }
    }

    doc.setDrawColor(100, 100, 100)
    doc.setLineWidth(0.7)
    doc.line(5, y, 75, y)
    y += 6

    doc.setFontSize(10)
    doc.setFont("courier", "bold")
    doc.text("THANK YOU FOR ORDERING!", 38, y, { align: "center" })
    y += 5

    doc.setFontSize(7)
    doc.setFont("courier", "normal")
    const poweredByText = "Powered by"
    const poweredByWidth = doc.getTextWidth(poweredByText)

    const footerLogoWidth = 15
    const footerLogoAspectRatio = footerLogoData.width / footerLogoData.height
    const footerLogoHeight = footerLogoWidth / footerLogoAspectRatio

    const combinedWidth = poweredByWidth + footerLogoWidth + 1
    const startX = 38 - combinedWidth / 2

    const textHeight = doc.getTextDimensions(poweredByText).h
    const maxHeight = Math.max(textHeight, footerLogoHeight)
    const topY = y

    doc.text(poweredByText, startX, topY + (maxHeight - textHeight) / 2 + 2)

    console.log(`Adding footer logo at y=${topY}`)
    doc.addImage(
      footerLogoData.dataURL,
      "PNG",
      startX + poweredByWidth + 1,
      topY + (maxHeight - footerLogoHeight) / 2,
      footerLogoWidth,
      footerLogoHeight,
    )

    const pdfDataUri = doc.output("datauristring")
    console.log(`PDF generated: ${pdfDataUri.substring(0, 100)}...`)

    let printResult = null
    console.log(`Sending ${type} receipt to printer for transaction: ${transactionID}`)
    printResult = await sendToPrinter(pdfDataUri, transactionID)

    console.log(`Docket slip generation completed for transaction: ${transactionID}`)
    return {
      transactionID,
      pdfDataUri,
      type,
      printResult,
    }
  } catch (error) {
    console.error(`Error generating docket slip for transaction ${transactionID}:`, error)
    alert(`Failed to generate docket slip for transaction ${transactionID}. Error: ${error.message}`)
    return null
  }
}

const printReceipt = async (pdfDataUri, transactionID) => {
  console.log(`Manually printing receipt for transaction: ${transactionID}`)
  if (!pdfDataUri || !transactionID) {
    console.error("No receipt data available to print")
    alert("No receipt data available to print")
    return null
  }
  return await sendToPrinter(pdfDataUri, transactionID)
}

const displayPdf = (pdfDataUri) => {
  console.log("Opening PDF in new window")
  const newWindow = window.open()
  newWindow.document.write(`
    <iframe width="100%" height="100%" src="${pdfDataUri}" frameborder="0"></iframe>
  `)
}

export default generateDocketSlip
export { printReceipt, displayPdf, sendToPrinter }
