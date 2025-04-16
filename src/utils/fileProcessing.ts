
// This file contains utilities for file processing and API interactions

interface FileProcessingConfig {
  apiBaseUrl: string;
}

export const config: FileProcessingConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
};

// Upload file to FastAPI backend
export const uploadFile = async (file: File): Promise<string> => {
  console.log(`Uploading file ${file.name} to FastAPI backend`);
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.file_id; // Return the file ID for processing
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Process file with FastAPI backend
export const processFile = async (fileId: string): Promise<string> => {
  console.log(`Processing file with ID: ${fileId}`);
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/process/${fileId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Processing failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.markdown_content; // Return markdown content
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};

// Generate PDF from markdown content
export const generatePDF = async (markdownContent: string, filename = "analysis-report.pdf"): Promise<void> => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ markdown_content: markdownContent }),
    });
    
    if (!response.ok) {
      throw new Error(`PDF generation failed with status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
