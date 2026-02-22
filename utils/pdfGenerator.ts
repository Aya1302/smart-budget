
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas dimensions are zero. Rendering may have failed.');
    }

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'l' : 'p',
      unit: 'pt',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
