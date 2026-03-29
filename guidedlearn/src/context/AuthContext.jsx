import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase එකෙන් බලනවා කවුරුහරි ලොග් වෙලා ඉන්නවද කියලා
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ලොග් වෙලා ඉන්නවා නම් Firestore එකෙන් එයාගේ වැඩිපුර විස්තර (නම වගේ) ගන්නවා
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setUser({ ...currentUser, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 💡 ලොග් වුණු User අලුත් කෙනෙක් නම් විතරක් Firestore එකේ දත්ත සේව් කරනවා
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
        profilePic: user.photoURL, // Google Profile Picture එක ගන්නවා
        createdAt: serverTimestamp(),
        role: "student"
      });
    }
    return user;
  } catch (error) {
    throw error;
  }
};

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, googleSignIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);