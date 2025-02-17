// QuillEditor.jsx
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuillEditor({ value, onChange }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // Formatação básica
          [{ list: 'ordered' }, { list: 'bullet' }], // Listas
          ['link', 'image'], // Links e imagens
          ['clean'], // Limpar formatação
        ],
      }}
      formats={['bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image']}
    />
  );
}

export default QuillEditor;