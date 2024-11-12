import { db } from '../utils/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export const getUserInfo = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userInfo = userDoc.data();
    return userInfo;
  } catch (error) {
    console.error(error);
  }
};

export const updateUserBlocks = async (uid, newBlocks) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      blocks: newBlocks,
    });
  } catch (error) {
    console.error(error);
  }
};


export const isSlugAvailable = async (slug) => {
  try {
    const q = query(collection(db, 'users'), where('slug', '==', slug));

    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error(error);
  }
};

export const updateSlug = async (userId, newSlug) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      slug: newSlug,
    });
  } catch (error) {
    console.error(error);
  }
};