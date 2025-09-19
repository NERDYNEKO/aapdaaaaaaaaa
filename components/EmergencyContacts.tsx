import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { PersonalContact } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UserIcon } from './icons/UserIcon';

const nationalHelplines = [
  { name: 'National Emergency Number', number: '112' },
  { name: 'Police', number: '100' },
  { name: 'Fire', number: '101' },
  { name: 'Ambulance', number: '102' },
  { name: 'Disaster Management Services', number: '108' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Child Helpline', number: '1098' },
];

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<PersonalContact[]>([]);
  const [newContact, setNewContact] = useState<{ name: string; number: string }>({ name: '', number: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const allContacts = await db.personalContacts.toArray();
      setContacts(allContacts);
    };
    fetchContacts();
  }, []);

  const handleAddContact = async () => {
    if (!newContact.name.trim() || !newContact.number.trim()) {
      setError('Name and number cannot be empty.');
      return;
    }
    setError('');
    const id = await db.personalContacts.add({ name: newContact.name, number: newContact.number });
    setContacts([...contacts, { id, ...newContact }]);
    setNewContact({ name: '', number: '' });
    setIsAdding(false);
  };

  const handleDeleteContact = async (id: number) => {
    await db.personalContacts.delete(id);
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-brand-gray-100 mb-4 flex items-center gap-3">
          <PhoneIcon />
          Emergency Helplines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nationalHelplines.map(helpline => (
            <div key={helpline.name} className="p-4 bg-brand-gray-900/50 border border-brand-gray-700 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-brand-gray-300">{helpline.name}</span>
              <a href={`tel:${helpline.number}`} className="font-bold text-lg text-brand-blue hover:underline">{helpline.number}</a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-brand-gray-100 flex items-center gap-3">
                <UserIcon />
                Personal Contacts
            </h2>
            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon />
                    Add Contact
                </button>
            )}
        </div>
        
        {isAdding && (
          <div className="p-4 bg-brand-gray-900/50 border border-brand-gray-700 rounded-lg mb-4 space-y-4">
            <h3 className="text-lg font-semibold text-brand-gray-200">Add New Contact</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="flex-1 p-2 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.number}
                onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
                className="flex-1 p-2 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-4">
              <button onClick={handleAddContact} className="px-4 py-2 bg-brand-green text-white font-semibold rounded-lg hover:bg-green-600">Save</button>
              <button onClick={() => { setIsAdding(false); setError(''); }} className="px-4 py-2 bg-brand-gray-600 text-white font-semibold rounded-lg hover:bg-brand-gray-500">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <div key={contact.id} className="p-4 bg-brand-gray-900/50 border border-brand-gray-700 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-brand-gray-200">{contact.name}</p>
                  <a href={`tel:${contact.number}`} className="text-brand-gray-400 hover:text-brand-blue">{contact.number}</a>
                </div>
                <button onClick={() => contact.id && handleDeleteContact(contact.id)} className="p-2 text-brand-gray-400 hover:text-brand-red rounded-full hover:bg-brand-red/10">
                  <TrashIcon />
                </button>
              </div>
            ))
          ) : (
            <p className="text-brand-gray-400 text-center py-4">You haven't added any personal contacts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
