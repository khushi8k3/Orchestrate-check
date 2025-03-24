import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import '../../styles/reports.css'; 

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const DetailedEventReport = () => {
  const [eventName, setEventName] = useState('');
  const [team, setTeam] = useState('');
  const [year, setYear] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reportRef = useRef();

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/detailedReport`, {
        params: { eventName, team, year }
      });
      console.log("Response Data:", response.data);
      setReportData(response.data);
    } catch (err) {
      console.error("Error fetching detailed report:", err);
      setError("No data found for the given criteria.");
    }
    setLoading(false);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
  };

  const downloadPDF = () => {
    html2canvas(reportRef.current).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 150);
      pdf.save("Detailed_Event_Report.pdf");
    });
  };

  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Detailed Report");
    sheet.columns = [
      { header: "Event Name", key: "eventName", width: 30 },
      { header: "Year", key: "year", width: 10 },
      { header: "Total RSVP", key: "totalRSVP", width: 15 },
      { header: "Total Attended", key: "totalAttended", width: 20 },
      { header: "Attendance %", key: "attendancePercentage", width: 15 },
      { header: "Total Tasks", key: "totalTasks", width: 15 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
      { header: "Task Completion Rate %", key: "taskCompletionRate", width: 20 },
      { header: "Total Budget", key: "totalBudget", width: 20 },
    ];
    reportData.forEach(event => {
      sheet.addRow(event);
    });
    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), "Detailed_Event_Report.xlsx");
    });
  };

  return (
    <div>
      <div className="form-section">
        <h2>Filter Detailed Reports</h2>
        <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        <input type="text" placeholder="Team Name" value={team} onChange={(e) => setTeam(e.target.value)} />
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <button onClick={fetchReport}>Generate Report</button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {loading && <p>Loading report...</p>}
      {!loading && reportData.length > 0 && (
        <div className="report-section" ref={reportRef}>
          <h2>Detailed Report Results</h2>
          <div className="event-container">
            {reportData.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-details">
                  <p><strong>Event Name:</strong> {event.eventName}</p>
                  <p><strong>Year:</strong> {event.year}</p>
                  <p><strong>Attendance %:</strong> {event.attendancePercentage}%</p>
                  <p><strong>Task Completion Rate:</strong> {event.taskCompletionRate}%</p>
                  <p><strong>Total Budget:</strong> ₹{event.totalBudget}</p>
                </div>
                <div className="chart-container">
                <div className="chart-wrapper">
                  <Pie
                    className="chart"
                    data={{
                      labels:event.totalAttended === 0 || event.totalRSVP === 0
                          ? ['Not Attended']
                          : event.totalAttended === event.totalRSVP
                            ? ['Attended']
                            : ['Attended', 'Not Attended'],
                      datasets: [{
                        label: 'Attendance',
                        data: event.totalRSVP === 0
                          ? [1]
                          : event.totalAttended === 0
                            ? [1]
                            : event.totalAttended === event.totalRSVP
                              ? [1]
                              : [event.totalAttended, event.totalRSVP - event.totalAttended],
                        backgroundColor: event.totalAttended === 0 || event.totalRSVP === 0
                            ? ['#f44336'] // Red for 0% attendance
                            : event.totalAttended === event.totalRSVP
                              ? ['#4caf50'] // Green for 100% attendance
                              : ['#4caf50', '#f44336']
                      }]
                    }}
                    options={chartOptions}
                  />
                  </div>
                  <div className="chart-wrapper">
                  <Bar
                    className="chart"
                    data={{
                      labels: ['Completed Tasks', 'Pending Tasks'],
                      datasets: [{
                        label: 'Tasks',
                        data: [event.completedTasks, event.totalTasks - event.completedTasks],
                        backgroundColor: ['#2196f3', '#ff9800']
                      }]
                    }}
                    options={chartOptions}
                  />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="download-btn" onClick={downloadPDF}>Download PDF</button>
          <button className="download-btn" onClick={downloadExcel}>Download Excel</button>
        </div>
      )}
    </div>
  );
};

export default DetailedEventReport;
