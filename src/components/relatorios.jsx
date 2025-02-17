import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const gerarRelatorioReservas = (reservas) => {
  const titulo = [
    { text: 'Relatório de Reservas', fontSize: 15, bold: true, margin: [15, 20, 0, 45] }
  ];

  const dados = reservas.map((reserva) => [
    { text: reserva.id, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: reserva.hospede, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: reserva.quarto, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: reserva.checkIn, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: reserva.checkOut, fontSize: 9, margin: [0, 2, 0, 2] },
    { text: reserva.status, fontSize: 9, margin: [0, 2, 0, 2] }
  ]);

  const detalhes = [
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*', '*'],
        body: [
          [
            { text: 'ID', style: 'tableHeader', fontSize: 10 },
            { text: 'Hóspede', style: 'tableHeader', fontSize: 10 },
            { text: 'Quarto', style: 'tableHeader', fontSize: 10 },
            { text: 'Check-In', style: 'tableHeader', fontSize: 10 },
            { text: 'Check-Out', style: 'tableHeader', fontSize: 10 },
            { text: 'Status', style: 'tableHeader', fontSize: 10 }
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
