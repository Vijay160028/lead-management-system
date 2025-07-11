import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusOptions = ["New Lead", "Lead Sent", "Deal Done"];

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (!token) {
      alert("Please log in");
      navigate("/");
    }

    if (email) setUserEmail(email);
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/leads");
      setLeads(response.data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setEditedStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdate = async (lead) => {
    const updatedStatus = editedStatuses[lead.id] || lead.status;
    const updatedLead = { ...lead, status: updatedStatus };

    try {
      await axios.put(`http://127.0.0.1:8000/leads/${lead.id}`, updatedLead);
      fetchLeads();
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleNewLeadChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const handleAddLead = async (e) => {
    e.preventDefault();

    const leadToAdd = {
      ...newLead,
      id: Date.now(), // or you can let backend assign an ID
      status: "New Lead",
    };

    try {
      await axios.post("http://127.0.0.1:8000/leads", leadToAdd);
      setNewLead({ name: "", email: "", phone: "", source: "" });
      fetchLeads();
    } catch (error) {
      console.error("Failed to add lead:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Lead Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Welcome, <strong>{userEmail}</strong>
          </span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* New Lead Form */}
      <form
        onSubmit={handleAddLead}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Add New Lead
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newLead.name}
            onChange={handleNewLeadChange}
            required
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newLead.email}
            onChange={handleNewLeadChange}
            required
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newLead.phone}
            onChange={handleNewLeadChange}
            required
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="source"
            placeholder="Lead Source"
            value={newLead.source}
            onChange={handleNewLeadChange}
            required
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Lead
          </button>
        </div>
      </form>

      {/* Leads Table */}
      <div className="overflow-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 text-left text-sm text-gray-700 dark:text-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Current Status</th>
              <th className="px-6 py-4">Change Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">{lead.name}</td>
                <td className="px-6 py-4">{lead.email}</td>
                <td className="px-6 py-4">{lead.phone}</td>
                <td className="px-6 py-4">{lead.source}</td>
                <td className="px-6 py-4">{lead.status}</td>
                <td className="px-6 py-4">
                  <select
                    className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                    value={editedStatuses[lead.id] || lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                    onClick={() => handleUpdate(lead)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}

            {leads.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
