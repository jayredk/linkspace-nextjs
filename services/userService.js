import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getUserInfo = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userInfo = userDoc.data();
    return userInfo;
  } catch (error) {
    console.error(error);
  }
};