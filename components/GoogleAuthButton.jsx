import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '@/utils/firebase';

import { Button } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { doc, setDoc } from 'firebase/firestore';
import { useSetUser } from '@/stores/userStore';


export default function GoogleAuthButton({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useSetUser();

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const { user, _tokenResponse } = userCredential;
      

      if (_tokenResponse?.isNewUser) {
        const slug = user.uid.substring(0, 8);
        const username = user.email.match(/^([a-zA-Z0-9._%+-]+)@/)[1];

        const defaultUserData = {
          slug,
          profile: {
            avatar: `https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2Fdefault-avatar.webp?alt=media&token=64b6170e-9a6c-429f-b3f1-38aa1340bd86`,
            email: user.email,
            name: username,
            description: '歡迎來到我的頁面！',
            bgColor: 'black',
            textColor: 'white',
            themeColor: 'blue',
            links: [
              {
                icon: 'facebook',
                text: 'Facebook',
                url: '',
              },
              {
                icon: 'youtube',
                text: 'Youtube',
                url: '',
              },
              {
                icon: 'instagram',
                text: 'Instagram',
                url: '',
              },
            ],
          },
          sections: [
            {
              id: crypto.randomUUID(),
              type: 'text-button',
              is_public: true,
              isSolid: false,
              hasSubtitle: false,
              hasImage: false,
              fontSize: 'sm',
              buttons: [
                {
                  effect: 'none',
                  text: '歡迎來到我的頁面！我正在建設中...',
                  subText: '',
                  icon: 'pin',
                  linkUrl: '',
                },
              ],
            },
          ],
          metadata: {
            createdAt: new Date(),
            lastUpdated: new Date(),
            version: 1,
          },
        };

        await setDoc(doc(db, 'users', user.uid), defaultUserData);

        setUser({
          email: user.email,
          uid: user.uid,
        });

        router.push('/create-site-id');
      } else {
        setUser({
          email: user.email,
          uid: user.uid,
        });

        router.push('/dashboard');
      }
      
    } catch (error) {
      if (error?.message === 'Firebase: Error (auth/popup-closed-by-user).')
        return;
      
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      w="100%"
      py="1.25rem"
      bgColor="white"
      border="1px"
      borderColor="gray.300"
      borderRadius="md"
      leftIcon={<FcGoogle fontSize="1.5rem" />}
      isLoading={isLoading}
      onClick={handleGoogleAuth}
    >
      {children}
    </Button>
  );
}
