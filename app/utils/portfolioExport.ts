import { Portfolio } from '../types/portfolio';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportPortfolioAsHTML = (portfolio: Portfolio): string => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.about.name}'s Portfolio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: white;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        h1 {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #1f2937;
        }
        h2 {
            font-size: 1.8rem;
            font-weight: bold;
            margin: 2rem 0 1rem 0;
            color: #1f2937;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 0.5rem;
        }
        h3 {
            font-size: 1.3rem;
            font-weight: bold;
            margin: 1rem 0 0.5rem 0;
            color: #374151;
        }
        p {
            margin: 0.5rem 0;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .section {
            margin-bottom: 2rem;
        }
        .experience-item, .education-item, .award-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background-color: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .skill-tag {
            background-color: #3b82f6;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
        }
        .testimonial {
            background-color: #f9fafb;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 4px solid #10b981;
        }
        .contact-info {
            background-color: #f9fafb;
            padding: 1rem;
            border-radius: 8px;
        }
        .contact-item {
            margin: 0.5rem 0;
        }
        ul {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
        }
        li {
            margin: 0.25rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1>${portfolio.about.name}</h1>
            <p style="font-size: 1.2rem; color: #6b7280; margin-bottom: 1rem;">${portfolio.about.role}</p>
            <p>${portfolio.about.bio}</p>
        </header>

        <!-- Experience -->
        ${portfolio.experiences && portfolio.experiences.length > 0 ? `
        <section class="section">
            <h2>Experience</h2>
            ${portfolio.experiences.map(exp => `
                <div class="experience-item">
                    <h3>${exp.position}</h3>
                    <p style="color: #6b7280; margin-bottom: 0.5rem;">${exp.company} • ${exp.startDate} - ${exp.endDate}</p>
                    <p>${exp.description}</p>
                    ${exp.achievements && exp.achievements.length > 0 ? `
                        <ul>
                            ${exp.achievements.map(achievement => `
                                <li>${achievement}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Education -->
        ${portfolio.education && portfolio.education.length > 0 ? `
        <section class="section">
            <h2>Education</h2>
            ${portfolio.education.map(edu => `
                <div class="education-item">
                    <h3>${edu.degree} in ${edu.field}</h3>
                    <p style="color: #6b7280; margin-bottom: 0.5rem;">${edu.institution} • ${edu.startDate} - ${edu.endDate}</p>
                    ${edu.description ? `<p>${edu.description}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Skills -->
        ${portfolio.skills && portfolio.skills.length > 0 ? `
        <section class="section">
            <h2>Skills</h2>
            <div class="skills-container">
                ${portfolio.skills.map(skill => `
                    <span class="skill-tag">${skill.name || skill}</span>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Awards -->
        ${portfolio.awards && portfolio.awards.length > 0 ? `
        <section class="section">
            <h2>Awards</h2>
            ${portfolio.awards.map(award => `
                <div class="award-item">
                    <h3>${award.title}</h3>
                    <p style="color: #6b7280; margin-bottom: 0.5rem;">${award.issuer} • ${award.date}</p>
                    ${award.description ? `<p>${award.description}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Testimonials -->
        ${portfolio.testimonials && portfolio.testimonials.length > 0 ? `
        <section class="section">
            <h2>Testimonials</h2>
            ${portfolio.testimonials.map(testimonial => `
                <div class="testimonial">
                    <p style="font-style: italic; margin-bottom: 1rem;">"${testimonial.content}"</p>
                    <div>
                        <p style="font-weight: bold; margin: 0;">${testimonial.name}</p>
                        <p style="color: #6b7280; margin: 0;">${testimonial.role}</p>
                    </div>
                </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Contact -->
        <section class="section">
            <h2>Contact</h2>
            <div class="contact-info">
                ${portfolio.contact.email ? `<div class="contact-item">Email: ${portfolio.contact.email}</div>` : ''}
                ${portfolio.contact.phone ? `<div class="contact-item">Phone: ${portfolio.contact.phone}</div>` : ''}
                ${portfolio.contact.linkedin ? `<div class="contact-item">LinkedIn: ${portfolio.contact.linkedin}</div>` : ''}
                ${portfolio.contact.github ? `<div class="contact-item">GitHub: ${portfolio.contact.github}</div>` : ''}
                ${portfolio.contact.website ? `<div class="contact-item">Website: ${portfolio.contact.website}</div>` : ''}
            </div>
        </section>
    </div>
</body>
</html>
  `;
  return html;
};

export const exportPortfolioAsPDF = async (portfolio: Portfolio): Promise<void> => {
  try {
    // Create a temporary div to render the portfolio
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.color = '#333';
    tempDiv.style.lineHeight = '1.6';
    
    // Generate the HTML content
    const htmlContent = exportPortfolioAsHTML(portfolio);
    
    // Set the HTML content
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);
    
    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert to canvas with better settings for PDF
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false,
      removeContainer: true,
    });
    
    // Remove the temporary div
    document.body.removeChild(tempDiv);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const pageHeight = pdfHeight;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download the PDF
    const fileName = `${portfolio.about.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const downloadPortfolioAsPDFFile = async (portfolio: Portfolio): Promise<void> => {
  try {
    // Validate portfolio data
    if (!portfolio || !portfolio.about || !portfolio.about.name) {
      throw new Error('Invalid portfolio data');
    }

    await exportPortfolioAsPDF(portfolio);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

export const downloadPortfolioAsHTML = (portfolio: Portfolio): void => {
  try {
    // Validate portfolio data
    if (!portfolio || !portfolio.about || !portfolio.about.name) {
      throw new Error('Invalid portfolio data');
    }

    const htmlContent = exportPortfolioAsHTML(portfolio);
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `${portfolio.about.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
    URL.revokeObjectURL(htmlUrl);
  } catch (error) {
    console.error('Error downloading HTML:', error);
    throw error;
  }
};

export const downloadPortfolioAsJSON = (portfolio: Portfolio): void => {
  try {
    // Validate portfolio data
    if (!portfolio || !portfolio.about || !portfolio.about.name) {
      throw new Error('Invalid portfolio data');
    }

    const jsonString = JSON.stringify(portfolio, null, 2);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `${portfolio.about.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
  } catch (error) {
    console.error('Error downloading JSON:', error);
    throw error;
  }
};

export const downloadPortfolio = async (portfolio: Portfolio) => {
  try {
    // Validate portfolio data
    if (!portfolio || !portfolio.about || !portfolio.about.name) {
      throw new Error('Invalid portfolio data');
    }

    // Try to download as PDF first
    try {
      await downloadPortfolioAsPDFFile(portfolio);
    } catch (pdfError) {
      console.warn('PDF generation failed, falling back to HTML:', pdfError);
      
      // Fallback to HTML download
      downloadPortfolioAsHTML(portfolio);
      
      throw new Error('PDF generation failed, but HTML version has been downloaded instead.');
    }
    
  } catch (error) {
    console.error('Error downloading portfolio:', error);
    throw error;
  }
}; 