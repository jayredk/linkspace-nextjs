'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';

import MultiTypeBlock from '@/components/MultiTypeBlock';
import UserProfile from '@/components/UserProfile';

import { db } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { Box, Container, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';


import 'lite-youtube-embed/src/lite-yt-embed.css';
import 'lite-youtube-embed/src/lite-yt-embed.js';


import { bgColorsMap } from '@/constants/utilityMaps';


export default function User({ params }) {
  const { siteId } = params;

  const [profile, setProfile] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('slug', '==', siteId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();

          setProfile(userData.profile);
          setBlocks(userData.blocks);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [siteId]);

  if (!isLoading && Object.keys(profile).length === 0) return (
    <Heading>此頁面不存在</Heading>
  );

  return (
    <Box bgColor={bgColorsMap[profile.bgColor]} minH="100vh">
      <Skeleton isLoaded={!isLoading} startColor="#1a1a1a" endColor="#000" fadeDuration={1.5} minH="100vh">
        <Container maxW="lg" py="4rem">
          <VStack spacing={8}>
            {Object.keys(profile).length && <UserProfile profile={profile} />}
            {blocks.map((block, index) => {
              return (
                <MultiTypeBlock
                  key={index}
                  block={block}
                  themeColor={profile.themeColor}
                  isAnimating={true}
                />
              );
            })}
          </VStack>
        </Container>
      </Skeleton>

      <Box
        as="footer"
        bgColor="#111"
        py="2rem"
        textAlign="center"
      >
        <Link href="/">
          <Text
            color="#FCF6EE"
            fontSize="1.5rem"
            fontWeight="bold"
            letterSpacing="0.05em"
            _hover={{
              textDecoration: 'none'
            }}
          >
            Linkspace
          </Text>
        </Link>
      </Box>
    </Box>
  );
}
