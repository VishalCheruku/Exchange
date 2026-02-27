
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth"; 
import {getStorage} from 'firebase/storage'
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyASszaJ_gvVdbOT3iP3env85Gjp42fEYog",
  authDomain: "xchange-55555.firebaseapp.com",
  projectId: "xchange-55555",
  storageBucket: "xchange-55555.firebasestorage.app",
  messagingSenderId: "353288352995",
  appId: "1:353288352995:web:bfdd17167fdbee0ae3c1d6",
  measurementId: "G-T0S0JFWH9F"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const fireStore = getFirestore(app);
const analytics = getAnalytics(app);


const fetchFromFirestore = async () => {
    try {
      const productsCollection = collection(fireStore, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) 
      console.log("Fetched products from Firestore:", productList);
      return productList;
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      return [];
    }
  };
  

  export {
    auth,
    provider,
    storage,
    fireStore,
    fetchFromFirestore
  }

