import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase Auth එකේ විස්තර
  const [userData, setUserData] = useState(null); // 💡 Firestore Database එකේ විස්තර (Role එක වගේ)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Firebase එකෙන් බලනවා කවුරුහරි ලොග් වෙලා ඉන්නවද කියලා
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // 2. ලොග් වෙලා ඉන්නවා නම්, 💡 onSnapshot හරහා Real-time එයාගේ දත්ත ගන්නවා
        // මේකෙන් වෙන්නේ User ගේ Role එක මාරු කරපු ගමන් Page එක Refresh කරන්නේ නැතුව ඉබේම Update වෙන එකයි!
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false);
        });
        
        return () => unsubscribeDoc(); // Cleanup function
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // 💡 ලොග් වුණු User අලුත් කෙනෙක් නම් විතරක් Firestore එකේ දත්ත සේව් කරනවා
      const userDocRef = doc(db, "users", loggedInUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: loggedInUser.uid,
          fullName: loggedInUser.displayName,
          email: loggedInUser.email,
          profilePic: loggedInUser.photoURL, // Google Profile Picture එක ගන්නවා
          createdAt: serverTimestamp(),
          role: "student" // 💡 අලුත් කෙනෙක් ආවම Default Role එක "student" වෙනවා
        });
      }
      return loggedInUser;
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    // 💡 userData එකත් Provider එක හරහා අනිත් පේජ් වලට යවනවා
    <AuthContext.Provider value={{ user, userData, loading, logout, googleSignIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);