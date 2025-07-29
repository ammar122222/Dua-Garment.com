import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Copy, Loader2, Image as ImageIcon } from 'lucide-react';

// TODO: Set your ImgBB API key here
const IMGBB_API_KEY = '9c9c4faeef9f91e57d93e122fcae5ade'; // <-- REPLACE THIS WITH YOUR REAL API KEY

export const ImageUploader = ({
  onUploadComplete,
}: {
  onUploadComplete: (urls: string[]) => void;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setUploadedUrls([]);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast({
        title: 'No files selected',
        description: 'Please select image files to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const newUrls: string[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', IMGBB_API_KEY); // Set your ImgBB API Key above

      try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result?.data?.url) {
          newUrls.push(result.data.url);
        } else {
          throw new Error('Invalid upload response');
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload Failed',
          description: error.message || 'One or more images failed to upload.',
          variant: 'destructive',
        });
      }
    }

    setUploadedUrls(newUrls);
    onUploadComplete(newUrls); // Send URLs back to parent
    setIsLoading(false);

    toast({
      title: 'Upload Complete',
      description: `${newUrls.length} image(s) uploaded successfully.`,
    });
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied!',
      description: 'Image URL copied to clipboard.',
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm space-y-6 max-w-xl mx-auto bg-card text-card-foreground">
      <h2 className="text-2xl font-bold text-center mb-4">Upload Multiple Images</h2>

      {/* Hidden File Input */}
      <Input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button onClick={triggerFileInput} variant="outline" className="w-full">
        <ImageIcon className="mr-2 h-5 w-5" />
        Choose Images
      </Button>

      {/* Previews */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {previewUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Preview ${idx + 1}`}
              className="w-full h-32 object-cover rounded border"
            />
          ))}
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!selectedFiles.length || isLoading}
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
            Upload {selectedFiles.length} Image(s)
          </>
        )}
      </Button>

      {/* Uploaded URLs */}
      {uploadedUrls.length > 0 && (
        <div className="space-y-3 mt-6">
          <Label>Uploaded Image URLs:</Label>
          {uploadedUrls.map((url, idx) => (
            <div key={idx} className="flex space-x-2 items-center">
              <Input readOnly value={url} className="bg-muted/50" />
              <Button size="icon" onClick={() => handleCopy(url)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
