
// This file contains utilities for file processing and API interactions

interface FileProcessingConfig {
  apiBaseUrl: string;
}

export const config: FileProcessingConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
};

// Upload file to FastAPI backend and process it immediately
export const uploadAndProcessFile = async (file: File): Promise<{fileId: string; markdown: string}> => {
  console.log(`Uploading and processing file ${file.name} to FastAPI backend`);
  
  // In a real implementation, we'd send the file to FastAPI
  // For now, we'll simulate the API response
  
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock file ID that would normally come from the server
  const mockFileId = `file-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  
  // Simulate markdown result
  const mockMarkdown = `# Analysis Results for ${file.name}

## Dataset Overview
This is a simulated analysis of the uploaded file. In a real implementation, this markdown would contain:

- Statistical summaries
- Data visualizations
- Key insights and findings
- Recommendations

## Sample Data Visualization
\`\`\`
+----------------+------------+
| Category       | Value      |
+----------------+------------+
| Sales          | $12,500    |
| Customers      | 430        |
| Growth Rate    | 5.7%       |
| Satisfaction   | 4.2/5      |
+----------------+------------+
\`\`\`

## Insights
1. The data shows a positive trend in customer acquisition
2. Revenue increased by 12% compared to previous period
3. Customer retention rate is above industry average
4. There are opportunities for improvement in product category B

## Recommendations
- Focus marketing efforts on high-performing segments
- Consider expanding product line based on customer feedback
- Address service delays in the fulfillment process
`;

  return { fileId: mockFileId, markdown: mockMarkdown };
};

// Generate PDF directly from markdown content using jsPDF
export const generatePDF = async (markdownContent: string, filename = "analysis-report.pdf"): Promise<void> => {
  try {
    console.log("Generating PDF from markdown content using jsPDF");
    
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Analysis Report", 20, 20);
    
    // Process the markdown content
    // Remove headings prefixes (# ## ###) and code blocks
    const processedContent = markdownContent
      .replace(/^#+\s+/gm, "")  // Remove heading markers while preserving content
      .replace(/```[\s\S]+?```/g, "[DATA TABLE]");  // Replace code blocks
    
    // Basic word wrapping by splitting content into lines
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(processedContent, 170);
    
    // Add content with proper positioning
    doc.text(lines, 20, 30);
    
    // Save and download the PDF
    doc.save(filename);
    
    console.log("PDF generation completed");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("PDF generation failed. Please try again later.");
  }
};

// Define the interface for contact form data
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

// Submit contact form to FastAPI backend
export const submitContactForm = async (formData: ContactFormData): Promise<boolean> => {
  console.log("Submitting contact form data:", formData);
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error(`Submission failed with status: ${response.status}`);
    }
    
    return true; // Return success
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return false; // Return failure
  }
};
