
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

export const generateFullReport = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  // Check if element has dimensions
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    console.warn('Element has zero dimensions, attempting to wait for render...');
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  try {
    const width = element.scrollWidth;
    const height = element.scrollHeight;

    const imgData = await toJpeg(element, {
      quality: 1.0,
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      pixelRatio: 2,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        margin: '0'
      }
    });

    if (!imgData || imgData === 'data:,') {
      throw new Error('Image data is empty. Rendering may have failed.');
    }
    
    const pdf = new jsPDF({
      orientation: width > height ? 'l' : 'p',
      unit: 'pt',
      format: [width, height]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
