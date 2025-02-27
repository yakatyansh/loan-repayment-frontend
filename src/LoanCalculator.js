import React, { useState } from "react";
import axios from "axios";
import "./LoanCalculator.css"; 

const LoanCalculator = () => {
  const [formData, setFormData] = useState({
    disbursement_date: "",
    principal: "",
    tenure: "",
    interest_rate: "",
    moratorium_period: "",
    emi_frequency: "monthly",
  });

  const [loanSchedule, setLoanSchedule] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoanSchedule([]);

    try {
      const formattedDate = formData.disbursement_date
        ? new Date(formData.disbursement_date).toISOString().split("T")[0]
        : "";

      const requestData = {
        disbursement_date: formattedDate,
        principal: formData.principal ? parseFloat(formData.principal) : 0,
        tenure: formData.tenure ? parseInt(formData.tenure, 10) : 0,
        interest_rate: formData.interest_rate
          ? parseFloat(formData.interest_rate)
          : 0,
        moratorium_period: formData.moratorium_period
          ? parseInt(formData.moratorium_period, 10)
          : 0,
        emi_frequency: formData.emi_frequency,
      };

      console.log("🚀 Request Data:", requestData);

      const response = await axios.post(
        "https://loan-repayment-backend.onrender.com/schedule",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Response Data:", response.data);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setLoanSchedule(response.data);
      }
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      setError("Error fetching loan schedule. Please check your input.");
    }
  };

  return (
    <div className="loan-container">
      <h2>Loan Repayment Schedule Calculator</h2>
      <form className="loan-form" onSubmit={handleSubmit}>
        <label>Disbursement Date:</label>
        <input type="date" name="disbursement_date" value={formData.disbursement_date} onChange={handleChange} required />

        <label>Principal Amount:</label>
        <input type="number" name="principal" value={formData.principal} onChange={handleChange} required />

        <label>Tenure (Months):</label>
        <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} required />

        <label>Interest Rate (% per annum):</label>
        <input type="number" name="interest_rate" value={formData.interest_rate} onChange={handleChange} required />

        <label>Moratorium Period (Months):</label>
        <input type="number" name="moratorium_period" value={formData.moratorium_period} onChange={handleChange} />

        <label>EMI Frequency:</label>
        <select name="emi_frequency" value={formData.emi_frequency} onChange={handleChange}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>

        <button type="submit">Generate Schedule</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {loanSchedule.length > 0 && (
        <div className="schedule">
          <h3>Loan Repayment Schedule</h3>
          <table>
            <thead>
              <tr>
                <th>Installment No</th>
                <th>Due Date</th>
                <th>EMI Amount</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {loanSchedule.map((installment, index) => (
                <tr key={index}>
                  <td>{installment.installment_no}</td>
                  <td>{installment.date}</td>
                  <td>{installment.emi}</td>
                  <td>{installment.principal_component}</td>
                  <td>{installment.interest_component}</td>
                  <td>{installment.remaining_principal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
