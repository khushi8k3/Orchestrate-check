const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  team: { type: String, required: true },
  role: { type: String, default: "employee" },
  tasks: [
    {
      taskName: { type: String, required: true },
      deadline: { type: Date, required: true },
      status: { type: String, default: "Pending" }
    }
  ]
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
