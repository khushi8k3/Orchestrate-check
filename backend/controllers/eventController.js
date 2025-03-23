const Event = require("../models/Event");

exports.getDetailedReport = async (req, res) => {
    try {
      const { eventName, year, team } = req.query;
      const query = {};
  
      // Dynamically apply filters
      if (eventName) {
        query.eventName = { $regex: new RegExp(`^${eventName}$`, "i") };
      }
      if (team) {
        query.team = { $regex: new RegExp(`^${team}$`, "i") };
      }
      if (year) {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
        query.date = { $gte: startOfYear, $lte: endOfYear };
      }
  
      console.log("Generated Query:", query);
  
      // Fetch matching events
      const events = await Event.find(query);
  
      if (!events || events.length === 0) {
        return res.status(404).json({ message: "No events found with the specified criteria." });
      }
  
      // Generate reports for each matching event
      const reportData = events.map((event) => {
        // Task Stats
        const totalTasks = event.tasks?.length || 0;
        const completedTasks = event.tasks?.filter(task => task.status === "Completed").length || 0;
        const taskCompletionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
  
        // Budget Analysis
        const totalBudget = event.tasks?.reduce((sum, task) => sum + (task.budget || 0), 0);
  
        // Attendance Stats (Only for Limited Entry Events)
        let totalRSVP = 0;
        let totalAttended = 0;
        let attendancePercentage = 0;
  
        if (event.eventType === "limited-entry" && event.attendees) {
          totalRSVP = event.attendees?.length || 0;
          totalAttended = event.attendees?.filter(email => email !== "").length || 0;
          attendancePercentage = totalRSVP ? ((totalAttended / totalRSVP) * 100).toFixed(2) : 0;
        }
  
        return {
          eventName: event.eventName,
          year: event.date?.getFullYear(),
          team: event.team,
          eventType: event.eventType,
          totalRSVP,
          totalAttended,
          attendancePercentage,
          totalTasks,
          completedTasks,
          taskCompletionRate,
          totalBudget,
        };
      });
  
      res.status(200).json(reportData);
    } catch (error) {
      console.error("Error generating detailed report:", error);
      res.status(500).json({ error: error.message });
    }
  };

exports.getCompiledReport = async (req, res) => {
  try {
    const { eventName, year, team, eventType } = req.query;
    const query = {};

    // Dynamically apply filters
    if (eventName) {
      query.eventName = { $regex: new RegExp(`^${eventName}$`, "i") };
    }
    if (team) {
      query.team = { $regex: new RegExp(`^${team}$`, "i") };
    }
    if (eventType) {
      query.eventType = { $regex: new RegExp(`^${eventType}$`, "i") };
    }
    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
      query.date = { $gte: startOfYear, $lte: endOfYear };
    }

    console.log("Generated Query:", query);

    // Fetch matching events
    const events = await Event.find(query);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found with the specified criteria." });
    }

    // Generate reports for each matching event
    const reportData = events.map((event) => {
      // Ensure the date is valid
      const eventYear = event.date instanceof Date
        ? event.date.getFullYear()
        : new Date(event.date)?.getFullYear() || "N/A";

      // Task Stats
      const totalTasks = event.tasks?.length || 0;
      const completedTasks = event.tasks?.filter(task => task.status === "Completed").length || 0;
      const taskCompletionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

      // Budget Analysis
      const totalBudget = event.tasks?.reduce((sum, task) => sum + (task.budget || 0), 0);

      // Attendance Stats (Only for Limited Entry Events)
      let totalRSVP = 0;
      let totalAttended = 0;
      let attendancePercentage = 0;

      if (event.eventType === "limited-entry" && event.attendees) {
        totalRSVP = event.attendees?.length || 0;
        totalAttended = event.attendees?.filter(email => email !== "").length || 0;
        attendancePercentage = totalRSVP ? ((totalAttended / totalRSVP) * 100).toFixed(2) : 0;
      }

      return {
        eventName: event.eventName,
        year: eventYear,
        team: event.team,
        eventType: event.eventType,
        totalRSVP,
        totalAttended,
        attendancePercentage,
        totalTasks,
        completedTasks,
        taskCompletionRate,
        totalBudget,
      };
    });
    console.log("Report Data:", reportData);
    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
};
