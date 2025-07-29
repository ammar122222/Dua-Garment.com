import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // { id: UID }
  const [userInfo, setUserInfo] = useState(null); // Firestore data
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            setIsAuthenticated(true);
            setUser({ id: firebaseUser.uid });

            // ✅ Fetch Firestore user info
            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUserInfo(docSnap.data());
            } else {
              console.warn("⚠️ No user document found in Firestore.");
              setUserInfo(null);
            }

            setRole(firebaseUser.email === "admin@duagarments.com" ? "admin" : "customer");
          } else {
            setIsAuthenticated(false);
            setUser(null);
            setUserInfo(null);
            setRole(null);
          }
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setUser({ id: result.user.uid });

      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      }

      const userRole = result.user.email === "admin@duagarments.com" ? "admin" : "customer";
      setRole(userRole);
      return { success: true, role: userRole };
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setUser(null);
      setUserInfo(null);
      setRole(null);
      return { success: false, error };
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserInfo(null);
    setRole(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Logout failed silently.");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userInfo, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
