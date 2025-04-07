
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, processFile } from "@/utils/fileProcessing";
import ThreeBackground from "@/components/ThreeBackground";
import { Loader2 } from "lucide-react";

const Demo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileUrl(null);
      setAnalysisResult(null);
      
      toast({
        title: "File selected",
        description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload",
      });
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setFileUrl(url);
      
      toast({
        title: "File uploaded successfully",
        description: "Your file is ready for analysis",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = async () => {
    if (!fileUrl) {
      toast({
        variant: "destructive",
        title: "No file uploaded",
        description: "Please upload a file first",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processFile(fileUrl);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete",
        description: "Your dataset has been successfully analyzed",
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error analyzing your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDemo = () => {
    setFile(null);
    setFileUrl(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <ThreeBackground variant="demo" />
      
      <div className="content-container">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Interactive Demo</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a dataset and see how our multi-agent AI system analyzes and extracts insights.
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle>Data Analysis Demo</CardTitle>
              <CardDescription>
                Upload a CSV, TSV, or any other structured dataset for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload">1. Upload File</TabsTrigger>
                  <TabsTrigger value="process" disabled={!fileUrl}>2. Process Data</TabsTrigger>
                  <TabsTrigger value="result" disabled={!analysisResult}>3. View Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="py-4">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.tsv,.xlsx,.json"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-lg font-medium mb-1">
                          Drag and drop your file here, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports CSV, TSV, XLSX, and JSON files (max 10MB)
                        </p>
                      </label>
                    </div>
                    
                    {file && (
                      <div className="flex flex-col sm:flex-row items-center justify-between bg-secondary/50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                            Remove
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleUpload} 
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              'Upload'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {fileUrl && (
                      <div className="bg-green-900/20 border border-green-500/20 text-green-500 p-3 rounded-lg">
                        <p className="font-medium">File successfully uploaded</p>
                        <p className="text-sm">Ready for processing</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="process" className="py-4">
                  <div className="space-y-6 text-center">
                    <div className="bg-secondary/30 p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Ready to analyze your data</h3>
                      <p className="text-muted-foreground mb-6">
                        Our AI agents will now analyze your dataset, generate custom code,
                        and extract meaningful insights.
                      </p>
                      
                      <Button 
                        onClick={handleProcess} 
                        disabled={isProcessing} 
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Start Analysis'
                        )}
                      </Button>
                    </div>
                    
                    {isProcessing && (
                      <div className="bg-secondary/30 p-6 rounded-lg">
                        <h4 className="font-medium mb-2">Analysis in progress</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Our AI agents are working on your dataset...</p>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full animate-pulse-slow" style={{width: '60%'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="result" className="py-4">
                  <div className="space-y-6">
                    <div className="bg-secondary/30 p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-4">Analysis Results</h3>
                      
                      {analysisResult && (
                        <div 
                          className="prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: analysisResult }}
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetDemo}>Reset Demo</Button>
              {analysisResult && (
                <Button>Download Report</Button>
              )}
            </CardFooter>
          </Card>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to analyze your own data?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Contact us for a personalized demonstration with your actual datasets.
            </p>
            <Button asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Demo;
