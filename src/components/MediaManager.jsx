import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Image, Trash, UploadCloud } from "lucide-react";
import imageCompression from "browser-image-compression";
import "./MediaManager.css";

const MediaManager = ({ files, setFiles }) => {
  
  const handleDrop = async (acceptedFiles) => {
    const processedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
        return { id: `${file.name}-${Date.now()}`, url: URL.createObjectURL(compressedFile), file: compressedFile };
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
  };

  const handleRemove = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((file) => file.id === active.id);
    const newIndex = files.findIndex((file) => file.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setFiles((prevFiles) => arrayMove(prevFiles, oldIndex, newIndex));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*,video/*",
    onDrop: handleDrop
  });

  return (
    <div className="media-manager">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={files.map((file) => file.id)} strategy={horizontalListSortingStrategy}>
          <div className="media-list">
            {files.map((file) => (
              <div key={file.id} className="media-item">
                {file.url.endsWith(".mp4") ? (
                  <video src={file.url} controls className="media-thumbnail" />
                ) : (
                  <img src={file.url} alt="thumbnail" className="media-thumbnail" />
                )}
                <button type="button" className="delete-btn" onClick={() => handleRemove(file.id)}>
                  <Trash size={20} color="red" />
                </button>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <UploadCloud size={32} color="gray" />
        <p>Clique ou arraste arquivos aqui para adicionar</p>
      </div>
    </div>
  );
};

export default MediaManager;
