import  { useEffect, useState } from 'react';
import { db } from '../firebase/config'; // Firebase config
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns'; // For date formatting
import { getAuth } from 'firebase/auth';

// Define types for each collection
interface DueDiligence {
  id: string;
  name: string;
  image: string;
  phone: string; // Changed to string
  address: string;
  createdAt: Date;
  paymentStatus: string;
  reviewStatus: string;
  seenStatus: string;
  userId: string;
}

interface LostLand {
  id: string;
  name: string;
  image: string;
  phone: string; // Changed to string
  address: string;
  createdAt: Date;
  paymentStatus: string;
  reviewStatus: string;
  seenStatus: string;
  userId: string;
}

interface Service {
  id: string;
  serviceId: string;
  name: string;
  number: string; // Changed to string
  address: string;
  payment_status: string;
  review_status: string;
  seen_status: string;
  createdAt: Date;
  service_name?: string;
  price?: number;
}

const History = () => {
  const [userUid, setUserUid] = useState<string | null>(null); // Initialize with null
  const [dueDiligenceList, setDueDiligenceList] = useState<DueDiligence[]>([]);
  const [lostLandList, setLostLandList] = useState<LostLand[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [selectedTab, setSelectedTab] = useState<'dueDiligence' | 'lostLand' | 'services'>('dueDiligence');

  // Fetch user ID on mount
  useEffect(() => {
    const auth = getAuth(); // Get the auth instance
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserUid(currentUser.uid);
    } else {
      toast.error('No user logged in');
    }
  }, []);

  // Fetch due diligence documents
  const fetchDueDiligence = async (uid: string) => {
    try {
      const q = query(collection(db, 'DD'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as DueDiligence[];
      setDueDiligenceList(list);
    } catch (error) {
      toast.error('Error fetching Due Diligence data');
      console.error(error);
    }
  };

  // Fetch lost land documents
  const fetchLostLand = async (uid: string) => {
    try {
      const q = query(collection(db, 'LostLands'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as LostLand[];
      setLostLandList(list);
    } catch (error) {
      toast.error('Error fetching Lost Land data');
      console.error(error);
    }
  };

  // Fetch services and resolve service_name and price
  const fetchServices = async (uid: string) => {
    try {
      const q = query(collection(db, 'Services'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const servicesList = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const serviceData = docSnap.data() as Service;
          const serviceDoc = await getDoc(doc(db, 'ServiceList', serviceData.serviceId));
          const serviceInfo = serviceDoc.data();
          return {
            ...serviceData,
            service_name: serviceInfo?.service_name,
            price: serviceInfo?.price,
            createdAt: serviceData.createdAt.toDate(),
          };
        })
      );
      setServicesList(servicesList);
    } catch (error) {
      toast.error('Error fetching Services data');
      console.error(error);
    }
  };

  // Helper function to format Firestore timestamps
  const formatDate = (timestamp: Date | undefined) => {
    if (!timestamp) return 'Invalid date';
    return format(timestamp, 'PPP p');
  };

  useEffect(() => {
    if (userUid) {
      fetchDueDiligence(userUid);
      fetchLostLand(userUid);
      fetchServices(userUid);
    }
  }, [userUid]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold ml-4 mb-4">History</h1>
      <div className="flex mb-4">
        <button onClick={() => setSelectedTab('dueDiligence')} className={`px-4 py-2 text-xs md:text-md ${selectedTab === 'dueDiligence' ? ' border-2 border-b-[#AE1729] text-black' : 'bg-gray-200'}`}>Due Diligence</button>
        <button onClick={() => setSelectedTab('lostLand')} className={`px-4 py-2  text-xs md:text-md ${selectedTab === 'lostLand' ? 'border-2 border-b-[#AE1729] text-black' : 'bg-gray-200'}`}>Lost Land</button>
        <button onClick={() => setSelectedTab('services')} className={`px-4 py-2  text-xs md:text-md ${selectedTab === 'services' ? 'border-2 border-b-[#AE1729] text-black' : 'bg-gray-200'}`}>Services</button>
      </div>

      {selectedTab === 'dueDiligence' && (
        <div className='grid grid-flow-row'>
          {dueDiligenceList.map(item => (
            <div key={item.id} className="border p-4 mb-2 md:w-[30%] bg-white rounded-md">
              <img src={item.image} alt={`${item.name}'s document`} className="w-full h-auto" />
              <h2>{item.name}</h2>
              <p>Phone: {item.phone}</p>
              <p>Address: {item.address}</p>
              <p>Created At: {formatDate(item.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'lostLand' && (
        <div className='grid grid-flow-row'>
          {lostLandList.map(item => (
            <div key={item.id} className="border p-4 mb-2 md:w-[30%] bg-white rounded-md">
              <img src={item.image} alt={`${item.name}'s document`} className="w-full h-auto" />
              <h2>{item.name}</h2>
              <p>Phone: {item.phone}</p>
              <p>Address: {item.address}</p>
              <p>Created At: {formatDate(item.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'services' && (
        <div>
          {servicesList.map(item => (
            <div key={item.id} className="border p-4 mb-2 bg-white rounded-md">
              <h2>Service: {item.service_name || 'Unknown'}</h2>
              <p>Price: {item.price ? `GHC ${item.price}` : 'N/A'}</p>
              <p>Name: {item.name}</p>
              <p>Phone: {item.number}</p>
              <p>Address: {item.address}</p>
              <p>Created At: {formatDate(item.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;