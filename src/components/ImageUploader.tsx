import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Copy, Loader2, Image as ImageIcon } from 'lucide-react';

// Define the ImageUploader component
export const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a URL for local preview
      setUploadedImageUrl(null); // Reset uploaded URL on new file selection
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedImageUrl(null);
    }
  };

  // Handle actual image upload to a hypothetical API endpoint
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setUploadedImageUrl(null); // Clear previous URL

    const formData = new FormData();
    formData.append('file', selectedFile); // 'file' is the common field name for file uploads

    // IMPORTANT: Replace this URL with your actual image hosting API endpoint.
    // For example:
    // - Your own backend: 'https://your-backend.com/api/upload-image'
    // - Cloudinary (unsigned upload, for testing): 'https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload'
    //   (You'd also need to append 'upload_preset' to formData for Cloudinary unsigned uploads)
    const UPLOAD_API_URL = 'https://your-image-hosting-api.com/upload'; // Placeholder URL

    try {
      const response = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        body: formData, // Send the FormData object
        // Headers like 'Content-Type': 'multipart/form-data' are automatically set by fetch
        // when you pass a FormData object. Do NOT set it manually.
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const result = await response.json();
      // IMPORTANT: Adjust 'result.url' based on the actual response structure of your chosen API.
      // For Cloudinary, it might be result.secure_url. For others, it could be result.data.link, etc.
      const directImageUrl = result.url || result.data?.url || `https://mock-image-hosting.com/uploaded/${Date.now()}-${selectedFile.name}`; // Fallback mock URL

      setUploadedImageUrl(directImageUrl);

      toast({
        title: "Upload Successful!",
        description: "Image uploaded and URL generated.",
        variant: "default", // Changed from "success" to "default"
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading the image.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = () => {
    if (uploadedImageUrl) {
      // Using document.execCommand('copy') for broader iframe compatibility
      const tempInput = document.createElement('input');
      tempInput.value = uploadedImageUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      toast({
        title: "Copied!",
        description: "Image URL copied to clipboard.",
        variant: "default", // Changed from "success" to "default"
      });
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm space-y-6 max-w-md mx-auto bg-card text-card-foreground">
      <h2 className="text-2xl font-bold text-center mb-4">Image Uploader</h2>

      {/* File Input */}
      <div className="space-y-2">
        <Label htmlFor="image-upload">Select Image</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*" // Accept only image files
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden" // Hide the default file input
        />
        <Button
          onClick={triggerFileInput}
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
        >
          <ImageIcon className="h-5 w-5" />
          <span>{selectedFile ? selectedFile.name : "Choose File"}</span>
        </Button>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="text-center">
          <Label>Image Preview</Label>
          <img
            src={previewUrl}
            alt="Image Preview"
            className="mt-2 max-h-64 w-auto mx-auto rounded-md object-contain border"
          />
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-5 w-5" />
            Upload Image
          </>
        )}
      </Button>

      {/* Uploaded Image URL */}
      {uploadedImageUrl && (
        <div className="space-y-2">
          <Label htmlFor="image-url">Direct Image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="image-url"
              type="text"
              value={uploadedImageUrl}
              readOnly
              className="flex-1 bg-muted/50"
            />
            <Button onClick={handleCopyUrl} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            You can now use this URL in your website code or backend.
          </p>
        </div>
      )}
    </div>
  );
};
