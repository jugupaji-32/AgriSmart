import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelect,
  accept = "image/*",
  multiple = false,
  maxSize = 5,
  className,
  title = "Upload Files",
  description = `Drag and drop files here or click to browse (max ${maxSize}MB)`,
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragCounter(0);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div
      className={cn(
        'upload-area cursor-pointer',
        isDragging && 'border-olive bg-olive/5',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className="text-olive/60 text-4xl">
          {icon || <Upload />}
        </div>
        
        <div className="text-center">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ 
  file, 
  onRemove, 
  className 
}) => {
  const [preview, setPreview] = useState<string>('');

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className={cn('relative card-pastel p-4', className)}>
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-center space-x-3">
        {preview ? (
          <img 
            src={preview} 
            alt={file.name} 
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <ImageIcon size={20} className="text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;