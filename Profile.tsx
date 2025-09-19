
import React, { useState, useEffect } from 'react';
// FIX: Populating file to resolve parsing errors. Assuming this is a duplicate of components/Profile.tsx and adjusting paths accordingly.
import { db } from './services/db';
import { UserProfile } from './types';
import { UserProfileIcon } from './components/icons/UserProfileIcon';
import { EditIcon } from './components/icons/EditIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import { LogoutIcon } from './components/icons/LogoutIcon';

const defaultProfile: UserProfile = {
  id: 1,
  name: 'John Doe',
  phone: '9876543210',
  age: 30,
  gender: 'Prefer not to say',
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      let userProfile = await db.userProfile.get(1);
      if (!userProfile) {
        // If no profile, add the default one to the DB
        await db.userProfile.put(defaultProfile);
        userProfile = defaultProfile;
      }
      setProfile(userProfile);
      setFormData(userProfile);
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'age' ? parseInt(value) || 0 : value });
  };

  const handleSave = async () => {
    await db.userProfile.put(formData);
    setProfile(formData);
    setIsEditing(false);
  };
  
  const handleEdit = () => {
      if(profile) {
          setFormData(profile);
          setIsEditing(true);
      }
  }

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    // For this demo, we can just show an alert.
    alert("Logged out successfully! (Simulation)");
  };

  if (!profile) {
    return (
        <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 rounded-full bg-brand-blue animate-pulse"></div>
        </div>
    );
  }

  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="p-4 bg-brand-gray-700 rounded-full">
            <UserProfileIcon />
        </div>
        <div className='flex-grow'>
            <h2 className="text-3xl font-bold text-brand-gray-100">{profile.name}</h2>
            <p className="text-brand-gray-400">{profile.phone}</p>
        </div>
        <div>
            {isEditing ? (
                 <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                    <CheckIcon /> Save
                 </button>
            ) : (
                <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                    <EditIcon /> Edit Profile
                </button>
            )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-brand-gray-400">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                />
            </div>
             <div>
                <label className="text-sm font-medium text-brand-gray-400">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                />
            </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-brand-gray-400">Age</label>
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                />
            </div>
             <div>
                <label className="text-sm font-medium text-brand-gray-400">Gender</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                </select>
            </div>
        </div>
      </div>

      <div className="mt-8 border-t border-brand-gray-700 pt-6">
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-brand-red/20 border-2 border-brand-red text-brand-red font-bold rounded-xl shadow-md hover:bg-brand-red/30 transition-all"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
