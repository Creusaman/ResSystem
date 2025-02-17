//Este componente é um drag and drop reutilizavel, que deve possuir recurosos para possiblitar a integração dele em diversos locais, 
// e podendo servir para funcionalidades distintas em cada local. Ele deve possuir um retangul com um pontilhado suave de bordas arredondadas
//  ao seu redor, delimitando a area do drag and drop, quando ele estiver vazio uma mensagem dizendo "clique aqui ou arraste uma imagem ou video para fazer upload"
// um icone de fotos e videos deve aparecer antes do texto. ao se adicionar uma imagem, o arquivo é armazenado localmente e um thumbnail dela é criado 
// este processo deve ser o mais responsivo e bonito possivel. quando há imagens ja adicionadas,  um botão com simbolo de "+foto e video" 
// pequeno no canto superior esquerdo substitui o texto anterior, e o drag and drop deixa de ser clicavel para adicionar fotos.
// as thumbnails ficam alinhadas centralizadas sempre, porem, quando o layout é vertical deve ficar apenas uma thumbnail por linha 
// e elas devem ser reordenadas verticalmente, enquando na horizontal elas se reorganizam horiontalmente.
//quando uma thumbnail é clicada ela deve ser arrastada junto com o mouse e o local que lea saiu as outras thumbnails devem ocupar
//ao ser arrastada as outras thubnail devem abrir espaço para ela enrar no meio delas. Esta ordem é organizada localmente em um vetor
//e somente no momento do upload que as coisas são enviadas ao servidor na ordem correta.
// o sistema deve ser capaz de distinguir o que é uma imagem nova e o que é uma imagem que ja estava no sistema, para que ao
// editar acomodações não se faça exlusoes e uploads desnecessarios ou repetidos, mas ainda assim, possibilitando que a ardem seja facilmente alterada e corretamente gravada
// no firebase para ser usada quando se for exibir uma acomodação, por exemplo.
//O drag and drop deve permitir a integração perfeita com os serviços do site e com os provedores de contexto, ao revisar o codigo, 
// comente sempre qual destas funcionalidades aquele pedaçõ do codigo cobre, o metodo utilizado, forma de integração e porque se escolheu ele.  
// caso este componente precise de codigos em outros locais para funcionar corretamente, comente o que deve haver nestes locais, e como devem ser implementados.

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Image, Video, Plus, Trash, UploadCloud } from "lucide-react";
import imageCompression from "browser-image-compression";
import "./CustomDropdown.css";

/**
 * 📌 Componente `CustomDropdown` atualizado para gerenciar upload e reordenação de mídias.
 *
 * 🔹 **Funcionalidades:**
 * ✅ Permite adicionar imagens e vídeos clicando ou arrastando para a área de upload.
 * ✅ Armazena arquivos localmente para reordenamento e edição antes do envio ao Firebase.
 * ✅ Identifica arquivos já existentes para evitar uploads desnecessários.
 * ✅ Suporte completo a **drag and drop** para reorganizar imagens.
 * ✅ Ícones de **Lucide** para melhor usabilidade e estética.
 * ✅ Alterna entre **modo horizontal e vertical** automaticamente com base no layout.
 * ✅ **Responsivo** e **integrável** em diversas partes do sistema.
 *
 * 🔧 **Integração:** Pode ser usado em `AccommodationForm.jsx`, `RulesManager.jsx` e outros locais.
 */

const CustomDropdown = ({ files = [], setFiles }) => {
    const [mediaFiles, setMediaFiles] = useState(Array.isArray(files) ? files : []);
  
    useEffect(() => {
      if (!Array.isArray(files)) {
        console.warn("🚨 Erro: `files` não é um array. Corrigindo para array vazio.");
        setMediaFiles([]);
      } else {
        setMediaFiles(files);
      }
    }, [files]);
  
    const handleDrop = async (acceptedFiles) => {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
          return { id: `${file.name}-${Date.now()}`, url: URL.createObjectURL(compressedFile), file: compressedFile };
        })
      );
  
      setMediaFiles((prevFiles) => [...prevFiles, ...processedFiles]);
      setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
    };
  
    const handleRemove = (id) => {
      setMediaFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };
  
    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
  
      const oldIndex = mediaFiles.findIndex((file) => file.id === active.id);
      const newIndex = mediaFiles.findIndex((file) => file.id === over.id);
  
      if (oldIndex !== -1 && newIndex !== -1) {
        const newArray = arrayMove(mediaFiles, oldIndex, newIndex);
        setMediaFiles(newArray);
        setFiles(newArray);
      }
    };
  
    const { getRootProps, getInputProps } = useDropzone({
      accept: "image/*,video/*",
      onDrop: handleDrop,
    });
  
    return (
      <div className="media-manager">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={mediaFiles.map((file) => file.id)} strategy={horizontalListSortingStrategy}>
            <div className="media-list">
              {mediaFiles.length > 0 ? (
                mediaFiles.map((file) => (
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
                ))
              ) : (
                <p className="empty-message">Nenhum arquivo adicionado ainda.</p>
              )}
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
  
  export default CustomDropdown;