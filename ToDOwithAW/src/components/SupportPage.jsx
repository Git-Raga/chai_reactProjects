import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import db from "../appwrite/database";
import { Query } from 'appwrite';
import "@fontsource/tinos";

const SupportPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [newTicket, setNewTicket] = useState({
    ticketnumber: '',
    issueDescription: '',
    stepsToReproduce: '',
    urgency: '',
    reportedBy: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fetchExistingTickets = async () => {
    try {
      const fetchedTickets = await db.supporttickets.getTickets();
      setTickets(fetchedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchExistingTickets();
  }, []);

  const handleInputChange = (e) => {
    setNewTicket({
      ...newTicket,
      [e.target.name]: e.target.value,
    });
  };

 

  const handleSubmitNewTicket = async (e) => {
    e.preventDefault();
    if (newTicket.reportedBy === '') {
      alert('Please select a user for "Reported By"');
      return;
    }
    try {
        setIsSubmitting(true);
      const ticketCount = await db.supporttickets.getTickets();
      const ticketNumber = `TF_TKT_${String(ticketCount.total + 1).padStart(3, '0')}`;
      await db.supporttickets.createTicket({
        ticketnumber: ticketNumber,
        issueDescription: newTicket.issueDescription,
        stepsToReproduce: newTicket.stepsToReproduce,
        urgency: newTicket.urgency,
        reportedby: newTicket.reportedBy,
        status: 'Open',
        developerComments: '',
      });
      setNewTicket({
        ticketnumber: '',
        issueDescription: '',
        stepsToReproduce: '',
        urgency: '',
        reportedBy: '',
      });
      await fetchExistingTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          inputBg: 'bg-gray-600',
          tableBg: 'bg-gray-800',
          tableHeaderBg: 'bg-gray-600',
          tableRowBg: 'bg-gray-500',
          tableAltRowBg: 'bg-gray-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          headingColor: 'text-gray-300',
        };
      case 'green':
        return {
          bg: 'bg-cyan-800',
          text: 'text-white',
          inputBg: 'bg-cyan-700',
          tableBg: 'bg-cyan-800',
          tableHeaderBg: 'bg-cyan-700',
          tableRowBg: 'bg-cyan-800',
          tableAltRowBg: 'bg-cyan-700',
          button: 'bg-teal-600 hover:bg-teal-700',
          headingColor: 'text-gray-300',
        };
      default: // light
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          inputBg: 'bg-gray-50',
          tableBg: 'bg-white',
          tableHeaderBg: 'bg-gray-100',
          tableRowBg: 'bg-white',
          tableAltRowBg: 'bg-gray-50',
          button: 'bg-blue-500 hover:bg-blue-600',
          headingColor: 'text-gray-800',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-[97vh] font-titillium ${themeClasses.bg} ${themeClasses.text}`}>
      <div className="container mx-auto py-9 px-1">
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className={`${themeClasses.button} text-white font-bold py-1 px-4 rounded-lg transition-all duration-200`}
          >
            ← Back
          </button>
        </div>

        <h1 className={`text-4xl font-bold mb-4 text-center ${themeClasses.headingColor}`}>TaskForce App | 🚩 Support Tickets</h1>
        <div className="border border-gray-400 mb-2"></div>

        <div className="flex flex-col lg:flex-row gap-2">
          <div className="lg:w-1/3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Ticket</h2>
            <form onSubmit={handleSubmitNewTicket} className="space-y-4">
              <div>
                <label htmlFor="issueDescription" className="block font-bold mb-2 text-gray-700">
                  Issue Description
                </label>
                <textarea
                  id="issueDescription"
                  name="issueDescription"
                  rows="3"
                  className={`w-full border rounded px-3 py-2 ${themeClasses.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={newTicket.issueDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="stepsToReproduce" className="block font-bold mb-2 text-gray-700">
                  Steps to Reproduce
                </label>
                <textarea
                  id="stepsToReproduce"
                  name="stepsToReproduce"
                  rows="3"
                  className={`w-full border rounded px-3 py-2 ${themeClasses.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={newTicket.stepsToReproduce}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="urgency" className="block font-bold mb-2 text-gray-700">
                  Urgency
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  className={`w-full border rounded px-3 py-2 ${themeClasses.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={newTicket.urgency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select urgency</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="reportedBy" className="block font-bold mb-2 text-gray-700">
                  Reporter
                </label>
                <select
                  id="reportedBy"
                  name="reportedBy"
                  className={`w-full border rounded px-3 py-2 ${themeClasses.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={newTicket.reportedBy}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a user</option>
                  <option value="Mahima">Mahima</option>
                  <option value="Suresh">Suresh</option>
                  <option value="Abhishek">Abhishek</option>
                  <option value="Muskan">Muskan</option>
                  <option value="Swetha">Swetha</option>
                  <option value="Raghav M">Raghav M</option>
                  <option value="Dileep">Dileep</option>
                  <option value="Bhaskar">Bhaskar</option>
                  <option value="Architha">Architha</option>
                  <option value="Neha">Neha</option>
                  <option value="Matt">Matt</option>
                </select>
              </div>
              <button
  type="submit"
  className={`${themeClasses.button} text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
</button>
            </form>
          </div>

          <div className="lg:w-2/3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ticket Details</h2>
            <div className="overflow-x-auto ">
    <table className={` ${themeClasses.tableBg}`}>
    
    <colgroup>
        <col style={{ width: '5%' }} />
        <col style={{ width: '35%' }} />
        <col style={{ width: '35%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>
 
      <thead className={themeClasses.tableHeaderBg}>
        <tr>
        <th className="px-4 py-2 text-left ">Ticket#</th>
          <th className="px-4 py-2 text-left  ">Issue</th>
          <th className="px-4 py-2 text-left ">Steps</th>
          <th className="px-4 py-2 text-left ">Urgency</th>
          <th className="px-4 py-2 text-left">User</th>
          <th className="px-4 py-2 text-left ">Status</th>
          <th className="px-4 py-2 text-left ">Comments</th>
        </tr>
      </thead>
      <tbody>
        {tickets.sort((a, b) => a.ticketnumber.localeCompare(b.ticketnumber)).map((ticket, index) => (
          <tr
            key={ticket.$id}
            className={index % 2 === 0 ? themeClasses.tableRowBg : themeClasses.tableAltRowBg}
          >
            <td className="px-4 py-2">{ticket.ticketnumber}</td>
            <td className="px-4 py-2">{ticket.issueDescription}</td>
            <td className="px-4 py-2">{ticket.stepsToReproduce}</td>
            <td className="px-4 py-2">{ticket.urgency}</td>
            <td className="px-4 py-2">{ticket.reportedby}</td>
            <td className="px-4 py-2">{ticket.status}</td>
            <td className="px-4 py-2">{ticket.developerComments}</td>
          </tr>
                        ))}
                    </tbody>
                    </table>
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;