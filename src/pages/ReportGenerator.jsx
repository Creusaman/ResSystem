import React, { useState, useEffect } from "react";
import { fetchAllReservations, fetchAllClients } from "../services/firestoreService"; // Correção na importação
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./ReportGenerator.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function ReportGenerator() {
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [reportType, setReportType] = useState("reservas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationsData = await fetchAllReservations(); // Usando fetchAllReservations corretamente
        const clientsData = await fetchAllClients(); // Usando fetchAllClients corretamente
        setReservations(reservationsData);
        setClients(clientsData);
      } catch (error) {
        console.error("Erro ao buscar dados para o relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generatePDF = () => {
    const reportTitle = [
      { text: reportType === "reservas" ? "Relatório de Reservas" : "Relatório de Clientes", fontSize: 15, bold: true, margin: [15, 20, 0, 45] }
    ];

    const data = reportType === "reservas" ? reservations.map(res => [
      res.id, res.hospede, res.quarto, res.checkIn, res.checkOut, res.status
    ]) : clients.map(client => [
      client.id, client.nome, client.email, client.fone
    ]);

    const headers = reportType === "reservas" ? 
      ["ID", "Hóspede", "Quarto", "Check-In", "Check-Out", "Status"] : 
      ["ID", "Nome", "E-mail", "Telefone"];

    const content = [
      {
        table: {
          headerRows: 1,
          widths: Array(headers.length).fill("*"),
          body: [
            headers.map(header => ({ text: header, style: "tableHeader", fontSize: 10 })),
            ...data
          ]
        },
        layout: "lightHorizontalLines"
      }
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [15, 50, 15, 40],
      header: reportTitle,
      content,
      footer: (currentPage, pageCount) => [
        { text: `${currentPage} / ${pageCount}`, alignment: "right", fontSize: 9, margin: [0, 10, 20, 0] }
      ]
    };

    pdfMake.createPdf(docDefinition).download();
  };

  return (
    <div className="report-generator">
      <h1>Gerador de Relatórios</h1>
      <label>Tipo de Relatório:</label>
      <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
        <option value="reservas">Reservas</option>
        <option value="clientes">Clientes</option>
      </select>
      <button onClick={generatePDF} disabled={loading}>
        {loading ? "Carregando..." : "Gerar PDF"}
      </button>
    </div>
  );
}

export default ReportGenerator;
