import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const gerarRelatorioClientes = (clientes) => {
  const titulo = [
    { text: 'Relatório de Clientes', fontSize: 15, bold: true, margin: [15, 20, 0, 45] }
  ];

  const dados = clientes.map((cliente) => [
    { text: cliente.id, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: cliente.nome, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: cliente.email, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: cliente.fone, fontSize: 9, margin: [0, 2, 0, 2] }
  ]);

  const detalhes = [
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        body: [
          [
            { text: 'Código', style: 'tableHeader', fontSize: 10 },
            { text: 'Nome', style: 'tableHeader', fontSize: 10 },
            { text: 'E-mail', style: 'tableHeader', fontSize: 10 },
            { text: 'Telefone', style: 'tableHeader', fontSize: 10 }
          ],
          ...dados
        ]
      },
      layout: 'lightHorizontalLines'
    }
  ];

  const rodape = (paginaAtual, totalPaginas) => [
    { text: `${paginaAtual} / ${totalPaginas}`, alignment: 'right', fontSize: 9, margin: [0, 10, 20, 0] }
  ];

  const documento = {
    pageSize: 'A4',
    pageMargins: [15, 50, 15, 40],
    header: [titulo],
    content: [detalhes],
    footer: rodape
  };

  pdfMake.createPdf(documento).download();
};
