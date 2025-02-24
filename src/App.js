import { useState } from "react";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({
    disbursement_date: "",
    principal: "",
    tenure: "",
    emi_frequency: "monthly",
    interest_rate: "",
    moratorium_period: "",
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
      const formattedDate = new Date(formData.disbursement_date)
        .toISOString()
        .split("T")[0];

      const requestData = {
        ...formData,
        disbursement_date: formattedDate,
        principal: parseFloat(formData.principal),
        tenure: parseInt(formData.tenure),
        interest_rate: parseFloat(formData.interest_rate),
        moratorium_period: parseInt(formData.moratorium_period),
      };

      console.log("Request Payload:", requestData); 

      const response = await axios.post(
        "https://loan-repayment-backend.onrender.com/schedule",
        requestData
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setLoanSchedule(response.data);
      }
    } catch (err) {
      setError("Error fetching loan schedule. Please check your input.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Loan Repayment Schedule</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <label className="block mb-2">
          Disbursement Date:
          <input
            type="date"
            name="disbursement_date"
            value={formData.disbursement_date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Principal Amount:
          <input
            type="number"
            name="principal"
            value={formData.principal}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Tenure (Months):
          <input
            type="number"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          EMI Frequency:
          <select
            name="emi_frequency"
            value={formData.emi_frequency}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="bi-monthly">Bi-Monthly</option>
            <option value="half-yearly">Half-Yearly</option>
          </select>
        </label>

        <label className="block mb-2">
          Interest Rate (% per year):
          <input
            type="number"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-4">
          Moratorium Period (Months):
          <input
            type="number"
            name="moratorium_period"
            value={formData.moratorium_period}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Generate Schedule
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {loanSchedule.length > 0 && (
        <div className="mt-6 w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Repayment Schedule</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Installment No</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">EMI</th>
                <th className="border p-2">Principal</th>
                <th className="border p-2">Interest</th>
                <th className="border p-2">Remaining Principal</th>
              </tr>
            </thead>
            <tbody>
              {loanSchedule.map((installment, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{installment.installment_no}</td>
                  <td className="border p-2">{installment.date}</td>
                  <td className="border p-2">{installment.emi}</td>
                  <td className="border p-2">{installment.principal_component}</td>
                  <td className="border p-2">{installment.interest_component}</td>
                  <td className="border p-2">{installment.remaining_principal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
