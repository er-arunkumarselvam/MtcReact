import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CONFIG from '../../Config';
import Loader from '../../components/Loader';

const TimeKeeperRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, []);

  const { staffNumber } = userInfo;

  useEffect(() => {
    const fetchInspectionRecords = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${CONFIG.URL}/admins/viewForm`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data && Array.isArray(response.data)) {
          const filteredRecords = response.data.filter(record => record.staffNumberFormPojo === staffNumber);
          setRecords(filteredRecords.reverse());
        } else {
          console.error('No valid records found');
          setError('No valid records found');
        }
      } catch (error) {
        console.error('Error fetching inspection records:', error);
        setError('Error fetching inspection records');
      }
      finally {
        setLoading(false);
      }
    };

    if (staffNumber) {
      fetchInspectionRecords();
    }
  }, [staffNumber]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredRecords = selectedDate
    ? records.filter(record => {
      const recordDate = new Date(record.dateAndTimeOfSubmission).toISOString().split('T')[0];
      return recordDate === selectedDate;
    })
    : records;

  return (
    <div className="record-container">
      <h3 className="record-title">Time Keeper Records</h3>

      <div className="date-input-container">
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={handleDateChange}
          className='date-input'
        />
      </div>

      <div className="cards-container">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => {
              const recordDateTime = new Date(record.dateAndTimeOfSubmission);
              const formattedDate = recordDateTime.toLocaleDateString(); 
              const formattedTime = recordDateTime.toLocaleTimeString(); 

              return (
                <div key={index} className="record-card">
                  <div className="card-body">
                    <p><span  className="record-title">Fleet No:</span> {record.vehicleFleetNumberFormPojo}</p>
                    <p><span  className="record-title">Comments:</span> {record.additionalInfoFormPojo}</p>
                    <p><span  className="record-title">Date of Submission:</span> {formattedDate}</p>
                    <p><span  className="record-title">Time of Submission:</span> {formattedTime}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No time keeper records found</p>
          )
        )}
      </div>
      <Loader loading={loading} />
    </div>
  );
};

export default TimeKeeperRecord;
