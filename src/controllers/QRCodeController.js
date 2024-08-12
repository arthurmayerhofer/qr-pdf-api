import { PDFDocument, rgb, PDFName, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

/**
 * Generates a PDF with two QR codes placed side by side and clickable link buttons above them.
 *
 * @param {string} text1 - The text for the first QR code (also used for the link).
 * @param {string} text2 - The text for the second QR code (also used for the link).
 * @param {Uint8Array} pdfBuffer - The existing PDF buffer to modify.
 * @returns {Promise<Uint8Array>} The modified PDF bytes.
 */
export const drawPdfQR = async (text1, text2, pdfBuffer) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPage(0);

    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Generate QR codes
    const qrResponse1 = await QRCode.toDataURL(text1);
    const qrImage1 = await pdfDoc.embedPng(qrResponse1);

    const qrResponse2 = await QRCode.toDataURL(text2);
    const qrImage2 = await pdfDoc.embedPng(qrResponse2);

    const qrSize = 2 * 56.69;
    const spacing = 20;
    const yPosition = 30;
    const buttonHeight = 20;
    const buttonWidth = qrSize;

    const firstQrXPosition = page.getWidth() - qrSize - spacing;

    page.drawImage(qrImage1, {
      x: firstQrXPosition,
      y: yPosition,
      width: qrSize,
      height: qrSize,
    });

    drawCustomText(page, firstQrXPosition, yPosition, qrSize, spacing, 'Clique ', 'AQUI', ' e saiba mais.', boldFont, text1);

    const secondQrXPosition = firstQrXPosition - qrSize - spacing;

    page.drawImage(qrImage2, {
      x: secondQrXPosition,
      y: yPosition,
      width: qrSize,
      height: qrSize,
    });

    drawCustomText(page, secondQrXPosition, yPosition, qrSize, spacing, 'Clique ', 'AQUI', ' para comprar.', boldFont, text2);

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (err) {
    console.error('Error creating PDF with QR and links:', err);
    throw new Error('Error creating PDF with QR and links');
  }
};

/**
 * Draws custom text on the PDF with specific color formatting and makes "AQUI" clickable.
 *
 * @param {PDFPage} page - The PDF page to draw on.
 * @param {number} xPosition - The x position to start drawing the text.
 * @param {number} yPosition - The y position to start drawing the text.
 * @param {number} qrSize - The size of the QR code.
 * @param {number} spacing - The spacing above the QR code.
 * @param {string} textPart1 - The first part of the text.
 * @param {string} textPart2 - The highlighted part of the text.
 * @param {string} textPart3 - The last part of the text.
 * @param {PDFDocument} font - The bold font.
 * @param {string} link - The link associated with "AQUI".
 */
function drawCustomText(page, xPosition, yPosition, qrSize, spacing, textPart1, textPart2, textPart3, font, link) {
  const darkGreen = rgb(0, 0.5, 0);
  const lightGreen = rgb(0.5, 1, 0.5);
  const fontSize = 18;

  const textPart1Width = font.widthOfTextAtSize(textPart1, fontSize);
  const textPart2Width = font.widthOfTextAtSize(textPart2, fontSize);

  page.drawText(textPart1, {
    x: xPosition + 5,
    y: yPosition + qrSize + spacing + 20,
    size: fontSize,
    font: font,
    color: darkGreen,
  });

  page.drawText(textPart2, {
    x: xPosition + 5 + textPart1Width,
    y: yPosition + qrSize + spacing + 20,
    size: fontSize,
    font: font,
    color: lightGreen,
  });

  const annot = page.node.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [
      xPosition + 5 + textPart1Width,
      yPosition + qrSize + spacing + 5,
      xPosition + 5 + textPart1Width + textPart2Width,
      yPosition + qrSize + spacing + 20 + fontSize,
    ],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: link,
    },
  });

  const annots = page.node.lookup(PDFName.of('Annots')) || page.node.context.obj([]);
  annots.push(annot);
  page.node.set(PDFName.of('Annots'), annots);

  page.drawText(textPart3, {
    x: xPosition + 5 -10,
    y: yPosition + qrSize + spacing,
    size: fontSize,
    font: font,
    color: darkGreen,
  });
}
