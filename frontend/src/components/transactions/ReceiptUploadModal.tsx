import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUploadArea } from "./FileUploadArea";
import { TransactionForm } from "./TransactionForm";
import { useReceiptProcessing } from "./hooks/useReceiptProcessing";
import { useTransactionForm } from "./hooks/useTransactionForm";
import type { SimpleBudgetCategory } from "./types";
import { FileText } from "lucide-react";

interface ReceiptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionData: {
    title: string;
    amount: number;
    categoryId: number;
    type: "income" | "expense";
  }) => void;
  budgetCategories: readonly SimpleBudgetCategory[];
}

const ReceiptUploadModal: React.FC<ReceiptUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budgetCategories,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const {
    isProcessing,
    progress,
    extractedText,
    extractedAmount,
    processReceipt,
    resetProcessing,
  } = useReceiptProcessing();

  const {
    formData,
    updateFormField,
    setAmount,
    handleSubmit: handleFormSubmit,
    resetForm,
  } = useTransactionForm({
    onSubmit,
    onClose,
    initialTitle: selectedFile?.name.replace(/\.[^/.]+$/, "") || "",
  });

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    resetProcessing();
    updateFormField('title', file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleProcessReceipt = async () => {
    if (!selectedFile) return;
    
    try {
      const { amount } = await processReceipt(selectedFile);
      if (amount) {
        setAmount(amount);
      }
    } catch {
      alert("Failed to process receipt. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    handleFormSubmit(e);
    setSelectedFile(null);
    resetProcessing();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Receipt Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <FileUploadArea onFileSelect={handleFileSelect} selectedFile={selectedFile} />

          {/* Help Text */}
          {!selectedFile && (
            <p className="text-sm text-gray-500 text-center">
              Upload a receipt photo to automatically extract the bill amount and details
            </p>
          )}

          {/* Selected File Info and Clear Button */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">{selectedFile.name}</p>
                  <p className="text-sm text-blue-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  resetProcessing();
                  resetForm();
                }}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          )}

          {/* Process Button */}
          {selectedFile && (
            <Button
              onClick={handleProcessReceipt}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Extract Bill Amount"}
            </Button>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Processing receipt...</p>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Transaction Form */}
          {(extractedText || extractedAmount !== null) && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                {extractedAmount && (
                  <p className="text-lg font-semibold text-green-600">
                    Amount: ₹{extractedAmount.toFixed(2)}
                  </p>
                )}
              </div>

              <TransactionForm
                formData={formData}
                budgetCategories={budgetCategories}
                onFormDataChange={updateFormField}
                onSubmit={handleSubmit}
                onClose={onClose}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptUploadModal;
