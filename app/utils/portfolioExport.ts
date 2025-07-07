import { Portfolio } from '../types/portfolio';

export const exportPortfolioAsHTML = (portfolio: Portfolio): string => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.about.name}'s Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
        }
    </style>
</head>
<body class="bg-white text-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Header -->
        <header class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-2">${portfolio.about.name}</h1>
            <p class="text-xl text-gray-600">${portfolio.about.role}</p>
            <p class="mt-4 text-gray-700">${portfolio.about.bio}</p>
        </header>

        <!-- Experience -->
        ${portfolio.experiences && portfolio.experiences.length > 0 ? `
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Experience</h2>
            ${portfolio.experiences.map(exp => `
                <div class="mb-6">
                    <h3 class="text-xl font-semibold">${exp.position}</h3>
                    <p class="text-gray-600">${exp.company} • ${exp.startDate} - ${exp.endDate}</p>
                    <p class="mt-2">${exp.description}</p>
                    ${exp.achievements && exp.achievements.length > 0 ? `
                        <ul class="list-disc ml-6 mt-2">
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
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Education</h2>
            ${portfolio.education.map(edu => `
                <div class="mb-6">
                    <h3 class="text-xl font-semibold">${edu.degree} in ${edu.field}</h3>
                    <p class="text-gray-600">${edu.institution} • ${edu.startDate} - ${edu.endDate}</p>
                    ${edu.description ? `<p class="mt-2">${edu.description}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Skills -->
        ${portfolio.skills && portfolio.skills.length > 0 ? `
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Skills</h2>
            <div class="flex flex-wrap gap-2">
                ${portfolio.skills.map(skill => `
                    <span class="px-3 py-1 bg-gray-100 rounded-full">${skill}</span>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Awards -->
        ${portfolio.awards && portfolio.awards.length > 0 ? `
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Awards</h2>
            ${portfolio.awards.map(award => `
                <div class="mb-4">
                    <h3 class="text-xl font-semibold">${award.title}</h3>
                    <p class="text-gray-600">${award.issuer} • ${award.date}</p>
                    ${award.description ? `<p class="mt-2">${award.description}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Testimonials -->
        ${portfolio.testimonials && portfolio.testimonials.length > 0 ? `
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Testimonials</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${portfolio.testimonials.map(testimonial => `
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <p class="italic mb-4">"${testimonial.content}"</p>
                        <div class="flex items-center">
                            <div>
                                <p class="font-semibold">${testimonial.name}</p>
                                <p class="text-gray-600">${testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Contact -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Contact</h2>
            <div class="flex flex-col gap-2">
                ${portfolio.contact.email ? `<p>Email: ${portfolio.contact.email}</p>` : ''}
                ${portfolio.contact.phone ? `<p>Phone: ${portfolio.contact.phone}</p>` : ''}
                ${portfolio.contact.linkedin ? `<p>LinkedIn: ${portfolio.contact.linkedin}</p>` : ''}
                ${portfolio.contact.github ? `<p>GitHub: ${portfolio.contact.github}</p>` : ''}
                ${portfolio.contact.website ? `<p>Website: ${portfolio.contact.website}</p>` : ''}
            </div>
        </section>
    </div>
</body>
</html>
  `;
  return html;
};

export const downloadPortfolio = (portfolio: Portfolio) => {
  // Download as HTML
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

  // Also download as JSON for backup
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
}; 