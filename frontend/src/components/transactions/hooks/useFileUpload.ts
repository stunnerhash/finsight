import { useState, useRef } from 'react';

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (
      file &&
      (file.type.startsWith("image/") || file.type === "application/pdf")
    ) {
      setSelectedFile(file);
      return true;
    }
    return false;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    
    return selectedFile.type === "application/pdf" ? "pdf" : "image";
  };

  const getFileSize = () => {
    if (!selectedFile) return null;
    return (selectedFile.size / 1024 / 1024).toFixed(2);
  };

  return {
    selectedFile,
    fileInputRef,
    handleFileSelect,
    handleFileInputChange,
    handleDragOver,
    handleDrop,
    openFileDialog,
    clearFile,
    getFileIcon,
    getFileSize,
  };
};
