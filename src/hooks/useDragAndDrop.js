import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDropzone } from "react-dropzone";
import { Plus, X } from "lucide-react";

const UseDragAndDrop = ({ files = [], setFiles, layout = "vertical" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [tempPreview, setTempPreview] = useState(null);

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setTempPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*,video/*",
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleDragEnd = (event) => {
    if (!files || files.length === 0) return;
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      setFiles(arrayMove(files, oldIndex, newIndex));
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div className={`p-4 border rounded-lg bg-gray-100 ${layout === "horizontal" ? "flex items-center space-x-4" : ""}`}>
      {/* Botão fixo de adicionar */}
      <div {...getRootProps()} className={`p-4 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center ${layout === "horizontal" ? "h-full w-24" : "w-full h-24"}`}>
        <input {...getInputProps()} />
        <Plus size={24} />
      </div>

      {/* Área de Visualização e Reordenação */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={files.map((file) => file.id)} strategy={layout === "horizontal" ? horizontalListSortingStrategy : verticalListSortingStrategy}>
          <div className={`mt-4 ${layout === "horizontal" ? "flex space-x-2" : "grid grid-cols-3 gap-4"}`}>
            {files.map((file) => (
              <SortableMedia key={file.id} file={file} removeFile={removeFile} />
            ))}
            {isDragging && (
              <div className="w-24 h-24 bg-gray-300 flex items-center justify-center border-dashed border-2">
                <Plus size={24} />
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableMedia = ({ file, removeFile }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative w-24 h-24">
      {file.file.type.startsWith("image") ? (
        <img src={file.id} alt="preview" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <video controls className="w-full h-full object-cover rounded-lg">
          <source src={file.id} type={file.file.type} />
        </video>
      )}
      <button
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
        onClick={() => removeFile(file.id)}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default UseDragAndDrop;
