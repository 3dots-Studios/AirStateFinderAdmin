import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config'; // Assuming you have firebase config setup
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { ServiceList } from '../types';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

export default function Services() {
  const [services, setServices] = useState<ServiceList[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch services from Firestore
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'ServiceList'), where('isAvailable', '==', true));
        const querySnapshot = await getDocs(q);

        const servicesList = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<ServiceList, 'id'>; // Explicitly cast to match `ServiceList`
          return {
            id: doc.id,
            ...data,
          };
        });

        setServices(servicesList);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      }
    };

    fetchServices();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !number || !address || !selectedServiceId) {
      toast.error('Please fill in all fields and select a service');
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth(); // Get the auth instance
      const userId = auth.currentUser?.uid; // Get the current user's UID

      await addDoc(collection(db, 'Services'), {
        name,
        serviceId: selectedServiceId,
        number,
        address,
        userId, // Include the user ID
        payment_status: 'unpaid', // Default payment status
        review_status: 'pending', // Default review status
        seen_status: 'unseen', // Default seen status
        createdAt: serverTimestamp(), // Firestore server timestamp
      });

      toast.success('Service request submitted successfully!');

      // Reset form fields after submission
      setName('');
      setNumber('');
      setAddress('');
      setSelectedServiceId(null);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast.error('Failed to submit service request');
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 ml-4">Available Services</h1>

      <div className="md:flex md:flex-row gap-5 space-y-2">
        {services.map(service => (
          <div
            key={service.id}
            className={`p-4 border rounded cursor-pointer ${
              selectedServiceId === service.id ? 'bg-[#AE1729] text-white' : 'bg-white'
            } md:w-[20%]`}
            onClick={() => setSelectedServiceId(service.id)}
          >
            <h2 className="text-xl font-bold">{service.service_name}</h2>
            <p>Price: GHC {service.price}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 mt-4 rounded-md shadow-md w-full md:w-[50%] mx-auto">
        <h2 className="text-xl font-bold mb-4">Submit Service Request</h2>

        <label className="block mb-2">Name</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mb-4"
          placeholder="Enter your name"
        />

        <label className="block mb-2">Phone Number</label>
        <input 
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mb-4"
          placeholder="Enter your phone number"
        />

        <label className="block mb-2">Address</label>
        <input 
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mb-4"
          placeholder="Enter your address"
        />

        <button
          type="submit"
          className="w-full p-2 bg-[#AE1729] text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
