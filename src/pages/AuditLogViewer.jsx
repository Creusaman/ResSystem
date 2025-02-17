import React, { useEffect, useState } from "react";
import { AuditLogService } from "../services/AuditLogService";
import "./AuditLogViewer.css";

function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await AuditLogService.getLogs();
      setLogs(data);
      setFilteredLogs(data);
    };
    fetchLogs();
  }, []);

  const handleFilter = () => {
    let filtered = logs;

    if (selectedUser) {
      filtered = filtered.filter((log) => log.userId === selectedUser);
    }
    if (selectedDate) {
      filtered = filtered.filter(
        (log) => new Date(log.timestamp.toDate()).toLocaleDateString() === selectedDate
      );
    }
    setFilteredLogs(filtered);
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Data,Ação,Descrição\n" +
      filteredLogs
        .map(
          (log) =>
            `${new Date(log.timestamp.toDate()).toLocaleString()},${log.actionType},${log.description}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "logs.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="audit-log">
      <h2>Histórico de Alterações</h2>
      
      <div className="filters">
        <label>Filtrar por Usuário:</label>
        <input
          type="text"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          placeholder="ID do Usuário"
        />

        <label>Filtrar por Data:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button onClick={handleFilter}>Aplicar Filtros</button>
        <button onClick={exportToCSV}>📥 Exportar CSV</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Ação</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp.toDate()).toLocaleString()}</td>
              <td>{log.actionType}</td>
              <td>{log.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditLogViewer;
