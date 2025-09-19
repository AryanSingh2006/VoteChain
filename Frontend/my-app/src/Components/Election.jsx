import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";

const Election = ({ getPhaseColor, renderPhaseButton }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get(`${API}/voting/all`);
        setElections(res.data?.elections || []);
      } catch (error) {
        setElections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  // Show only elections that are ended or result phase
  const history = elections.filter(e => e.phase === "ended" || e.phase === "result");

  return (
    <div className="bg-white rounded-3xl mb-8 shadow-sm border border-gray-100">
      <div className="p-6">
        <h3 className="text-4xl font-Bold font-montserrat text-gray-800">Election History</h3>
      </div>
      <div className="p-3">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No past elections found.</p>
        ) : (
          <div className="space-y-4">
            {history.map((election) => (
              <div key={election._id} className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-normal text-gray-800 mb-2">{election.title}</h4>
                    <p className="text-gray-600 mb-3">{election.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Phase:{" "}
                        <span className={`font-semibold ${getPhaseColor ? getPhaseColor(election.phase) : ""}`}>
                          {election.phase.toUpperCase()}
                        </span>
                      </span>
                      <span className="text-gray-600">
                        Start: {new Date(election.startTime).toLocaleString()}
                      </span>
                      <span className="text-gray-600">
                        Blockchain ID: {election.blockchainElectionId || "Not set"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {renderPhaseButton ? renderPhaseButton(election) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Election;
