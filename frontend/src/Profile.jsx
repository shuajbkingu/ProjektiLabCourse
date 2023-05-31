
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {

    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const maskPassword = (password) => {
    const maskLength = password.length ;
    const maskedPassword = '*'.repeat(maskLength) ;
    return maskedPassword;
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-heading">Profile</h1>
      <ul className="profile-list">
        <li className="profile-item">
          <strong>ID:</strong> {profileData.id}
        </li>
        <li className="profile-item">
          <strong>Name:</strong> {profileData.name}
        </li>
        <li className="profile-item">
          <strong>Email:</strong> {profileData.email}
        </li>
        <li className="profile-item">
          <strong>Password:</strong>
          <span>{maskPassword(profileData.password)}</span>
        </li>
      </ul>
    </div>
  );
};
export default ProfilePage;
