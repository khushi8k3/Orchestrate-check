import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ReportsHome = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [years, setYears] = useState([]);
  const [eventCounts, setEventCounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [eventTypeDistribution, setEventTypeDistribution] = useState({});
  const [budgetByType, setBudgetByType] = useState({});
  const [budgetByTeam, setBudgetByTeam] = useState({});

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/compiledReport`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format from API.');
      }

      console.log("Full API Response:", response.data);

      const aggregatedData = response.data.reduce((acc, cur) => {
        const key = `${cur.year}-${cur.eventType}`;

        if (!acc[key]) {
          acc[key] = {
            year: cur.year,
            team: cur.team || 'N/A',
            eventType: cur.eventType,
            eventCount: 0,
            eventNames: [],
            totalBudget: 0
          };
        }

        acc[key].eventCount += 1;
        acc[key].totalBudget += Number(cur.totalBudget) || 0;
        if (cur.eventName) acc[key].eventNames.push(cur.eventName);

        return acc;
      }, {});

      const finalData = Object.values(aggregatedData);
      setReportData(finalData);
      console.log("Processed Data for ReportsHome:", finalData);
    } catch (err) {
      console.error("Error fetching compiled report:", err);
      setError("No data found.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Update state variables when reportData changes
  useEffect(() => {
    if (reportData.length === 0) return;

    const eventsPerYear = {};
    const budgetPerYear = {};
    const eventTypeDist = {};
    const budgetByEventType = {};
    const budgetByTeams = {};

    reportData.forEach((cur) => {
      eventsPerYear[cur.year] = (eventsPerYear[cur.year] || 0) + cur.eventCount;
      budgetPerYear[cur.year] = (budgetPerYear[cur.year] || 0) + cur.totalBudget;
      eventTypeDist[cur.eventType] = (eventTypeDist[cur.eventType] || 0) + cur.eventCount;
      budgetByEventType[cur.eventType] = (budgetByEventType[cur.eventType] || 0) + cur.totalBudget;
      budgetByTeams[cur.team] = (budgetByTeams[cur.team] || 0) + cur.totalBudget;
    });

    console.log("Updated Data for Charts:", { eventsPerYear, budgetPerYear, eventTypeDist, budgetByEventType, budgetByTeams });

    setYears(Object.keys(eventsPerYear));
    setEventCounts(Object.values(eventsPerYear));
    setBudgets(Object.values(budgetPerYear));
    setEventTypeDistribution(eventTypeDist);
    setBudgetByType(budgetByEventType);
    setBudgetByTeam(budgetByTeams);
  }, [reportData]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };
  console.log("Years State:", years);
console.log("Event Counts State:", eventCounts);
console.log("Budgets State:", budgets);
  return (
    <div>
      <h2>Reports Dashboard</h2>
      {loading && <p>Loading report...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && reportData.length > 0 ? (
        <div>
          <h3>Event Count per Year</h3>
          {years.length > 0 ? (
            <Bar style={{ height: '400px', width: '600px', border: '1px solid red' }}
              data={{
                labels: years,
                datasets: [{ label: 'Event Count', data: eventCounts, backgroundColor: '#007bff' }]
              }}
              options={barOptions}
            />
          ) : <p>No event data available.</p>}

          <h3>Total Budget per Year (₹)</h3>
          {years.length > 0 ? (
            <Bar
              data={{
                labels: years,
                datasets: [{ label: 'Total Budget', data: budgets, backgroundColor: '#28a745' }]
              }}
              options={barOptions}
            />
          ) : <p>No budget data available.</p>}

          <h3>Event Type Distribution</h3>
          {Object.keys(eventTypeDistribution).length > 0 ? (
            <Pie
              data={{
                labels: Object.keys(eventTypeDistribution),
                datasets: [{ data: Object.values(eventTypeDistribution), backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'] }]
              }}
              options={pieOptions}
            />
          ) : <p>No event type data available.</p>}

          <h3>Budget Spent by Event Type</h3>
          {Object.keys(budgetByType).length > 0 ? (
            <Bar
              data={{
                labels: Object.keys(budgetByType),
                datasets: [{ data: Object.values(budgetByType), backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'] }]
              }}
              options={barOptions}
            />
          ) : <p>No budget type data available.</p>}

          <h3>Budget Allocation by Team</h3>
          {Object.keys(budgetByTeam).length > 0 ? (
            Object.entries(budgetByTeam).map(([team, budget], index) => (
              <div key={index}>
                <h4>{team}</h4>
                <Bar
                  data={{
                    labels: [team],
                    datasets: [{ label: 'Total Budget', data: [budget], backgroundColor: '#17a2b8' }]
                  }}
                  options={barOptions}
                />
              </div>
            ))
          ) : <p>No team budget data available.</p>}
        </div>
      ) : !loading && <p>No data available.</p>}
    </div>
  );
};

export default ReportsHome;
