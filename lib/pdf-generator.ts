import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { CVData } from "./cv";

/**
 * Download CV as PDF using html2canvas to capture the rendered CV preview
 */
export async function downloadCVAsPDF(
  elementId: string,
  filename: string = "cv-harvard.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Capture the element as canvas with high quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Calculate PDF dimensions (A4 size)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    // Add image to PDF (first page)
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}

/**
 * Generate Harvard-style CV PDF with custom template
 * This creates a clean, professional PDF directly without rendering HTML
 */
export function generateHarvardStylePDF(
  data: CVData,
  photo?: string | null,
  filename: string = "cv-harvard.pdf"
): void {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10,
    lineHeight: number = 5
  ): number => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Add photo if available (positioned higher to avoid overlap)
  if (photo) {
    try {
      const photoSize = 30;
      const photoX = pageWidth - margin - photoSize;
      const photoY = margin - 11; // Move photo up 5mm
      pdf.addImage(photo, "JPEG", photoX, photoY, photoSize, photoSize);
    } catch (error) {
      console.warn("Could not add photo to PDF:", error);
    }
  }

  // Header - Name (leave space for photo on the right)
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  const nameMaxWidth = photo ? contentWidth - 35 : contentWidth; // Reserve space for photo
  pdf.text(data.personal.fullName.toUpperCase(), margin, yPosition);
  yPosition += 8;

  // Title
  if (data.personal.title) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.personal.title, margin, yPosition);
    yPosition += 6;
  }

  // Contact Information
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const contactInfo = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
    data.personal.linkedin,
  ]
    .filter(Boolean)
    .join(" • ");
  yPosition = addWrappedText(contactInfo, margin, yPosition, contentWidth - 35, 9, 4);
  yPosition += 2;

  // Horizontal line
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Summary
  if (data.personal.summary) {
    yPosition = addWrappedText(
      data.personal.summary,
      margin,
      yPosition,
      contentWidth,
      10,
      5
    );
    yPosition += 6;
  }

  // Helper to add section heading
  const addSectionHeading = (title: string) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title.toUpperCase(), margin, yPosition);
    yPosition += 2;
    pdf.setLineWidth(0.3);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;
  };

  // Experience Section
  if (data.experience && data.experience.length > 0) {
    addSectionHeading("Professional Experience");
    
    data.experience.forEach((exp) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      // Company name
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(exp.company, margin, yPosition);

      // Dates (right aligned)
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
      if (dates) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const dateWidth = pdf.getTextWidth(dates);
        pdf.text(dates, pageWidth - margin - dateWidth, yPosition);
      }
      yPosition += 5;

      // Role and location
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      const roleText = exp.location ? `${exp.role} • ${exp.location}` : exp.role;
      pdf.text(roleText, margin, yPosition);
      yPosition += 5;

      // Highlights
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      exp.highlights.forEach((highlight) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        // Bullet point
        pdf.circle(margin + 2, yPosition - 1.5, 0.5, "F");
        yPosition = addWrappedText(highlight, margin + 5, yPosition, contentWidth - 5, 9, 4);
        yPosition += 1;
      });
      yPosition += 3;
    });
  }

  // Education Section
  if (data.education && data.education.length > 0) {
    addSectionHeading("Education");
    
    data.education.forEach((edu) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      // School name
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(edu.school, margin, yPosition);

      // Dates (right aligned)
      const dates = [edu.startDate, edu.endDate].filter(Boolean).join(" – ");
      if (dates) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const dateWidth = pdf.getTextWidth(dates);
        pdf.text(dates, pageWidth - margin - dateWidth, yPosition);
      }
      yPosition += 5;

      // Degree and location
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      const degreeText = edu.location ? `${edu.degree} • ${edu.location}` : edu.degree;
      pdf.text(degreeText, margin, yPosition);
      yPosition += 5;

      // Highlights
      if (edu.highlights && edu.highlights.length > 0) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        edu.highlights.forEach((highlight) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.circle(margin + 2, yPosition - 1.5, 0.5, "F");
          yPosition = addWrappedText(highlight, margin + 5, yPosition, contentWidth - 5, 9, 4);
          yPosition += 1;
        });
      }
      yPosition += 3;
    });
  }

  // Projects Section
  if (data.projects && data.projects.length > 0) {
    addSectionHeading("Projects");
    
    data.projects.forEach((project) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      // Project name
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(project.name, margin, yPosition);
      yPosition += 5;

      // Summary
      if (project.summary) {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        yPosition = addWrappedText(project.summary, margin, yPosition, contentWidth, 9, 4);
        yPosition += 2;
      }

      // Link
      if (project.link) {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink(project.link, margin, yPosition, { url: project.link });
        pdf.setTextColor(0, 0, 0);
        yPosition += 4;
      }

      // Highlights
      if (project.highlights && project.highlights.length > 0) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        project.highlights.forEach((highlight) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.circle(margin + 2, yPosition - 1.5, 0.5, "F");
          yPosition = addWrappedText(highlight, margin + 5, yPosition, contentWidth - 5, 9, 4);
          yPosition += 1;
        });
      }
      yPosition += 3;
    });
  }

  // Skills Section
  if (data.skills && data.skills.length > 0) {
    addSectionHeading("Skills");
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const skillsText = data.skills.join(" • ");
    yPosition = addWrappedText(skillsText, margin, yPosition, contentWidth, 10, 5);
    yPosition += 5;
  }

  // Certifications Section
  if (data.certifications && data.certifications.length > 0) {
    addSectionHeading("Certifications");
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    data.certifications.forEach((cert) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.circle(margin + 2, yPosition - 1.5, 0.5, "F");
      yPosition = addWrappedText(cert, margin + 5, yPosition, contentWidth - 5, 10, 5);
      yPosition += 1;
    });
    yPosition += 5;
  }

  // Languages Section
  if (data.languages && data.languages.length > 0) {
    addSectionHeading("Languages");
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const languagesText = data.languages.join(" • ");
    yPosition = addWrappedText(languagesText, margin, yPosition, contentWidth, 10, 5);
  }

  // Save the PDF
  pdf.save(filename);
}
