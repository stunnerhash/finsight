import React from 'react';
import { Upload, FileText, Image } from 'lucide-react';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    
    return selectedFile.type === "application/pdf" ? "pdf" : "image";
  };

  const getFileSize = () => {
    if (!selectedFile) return null;
    return (selectedFile.size / 1024 / 1024).toFixed(2);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Upload Receipt Image
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          selectedFile 
            ? "border-green-500 bg-green-50/50 shadow-sm" 
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/50"
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDropFile}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="space-y-2">
            {getFileIcon() === "pdf" ? (
              <FileText className="h-12 w-12 text-red-500 mx-auto" />
            ) : (
              <Image className="h-12 w-12 text-green-500 mx-auto" />
            )}
            <p className="font-medium text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-500">
              {getFileSize()} MB
            </p>
            <p className="text-sm text-green-600 font-medium">
              ✓ File selected successfully
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="font-medium text-gray-900">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, JPEG, PDF up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
