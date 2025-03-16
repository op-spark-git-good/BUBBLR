/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Image } from 'react-bootstrap';

const avatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
];

const AvatarUploader = ({ refreshUser }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/auth/current_user')
      .then((res) => {
        setUser(res.data);
        setSelectedAvatar(res.data.avatar || avatars[0]);
      })
      .catch((err) => {
        console.error('Error fetching user', err);
      });
  }, []);

  const selectAvatar = async (avatar) => {
    try {
      await axios.put(`/avatar/select-avatar/${user.googleId}`, { avatar });
      setSelectedAvatar(avatar);
      refreshUser();
    } catch (err) {
      console.error('Error updating avatar', err);
    }
  };

  return (
    <div className="avatar-uploader text-center">
      <h5>Select Your Avatar</h5>
      <div className="avatar-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {avatars.map((avatar) => (
          <Image
            key={avatar}
            src={avatar}
            width={60}
            height={60}
            roundedCircle
            style={{
              border: selectedAvatar === avatar ? '3px solid blue' : '3px solid transparent',
              cursor: 'pointer',
            }}
            onClick={() => selectAvatar(avatar)}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarUploader;
