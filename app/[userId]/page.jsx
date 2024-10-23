'use client'

import { useEffect, useState } from 'react';

import MultiTypeBlock from '../../components/MultiTypeBlock';
import UserProfile from '../../components/UserProfile';


import { fetchUserBlockItems, fetchUserProfile } from '../../api';

import {
  Box,
  Container,
  Heading,
  VStack
} from '@chakra-ui/react';


import 'lite-youtube-embed/src/lite-yt-embed.css';
import 'lite-youtube-embed/src/lite-yt-embed.js';

import {
  bgColorsMap
} from '../../constants/utilityMaps';


export default function User({ params }) {
  const { userId } = params;

  const [profile, setProfile] = useState({});
  const [blockItems, setBlockItems] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      const profileData = await fetchUserProfile(userId);

      if (profileData.profile) {
        setProfile(profileData.profile);
      }

      const blockItemsData = await fetchUserBlockItems(userId);

      if (blockItemsData.blockItems) {
        setBlockItems(blockItemsData.blockItems);
      }
    };

    loadUser();
  }, [userId]);

  return (
    <Box bgColor={bgColorsMap[profile.bgColor]}>
      <Container maxW="lg" py="4rem">
        <VStack spacing={8}>
          {Object.keys(profile).length === 0 && blockItems.length === 0 && (
            <Heading>此頁面不存在</Heading>
          )}
          {Object.keys(profile).length && (
            <UserProfile profile={profile}/>
          )}

          {blockItems.map((item, index) => {
            return (
              <MultiTypeBlock
                key={index}
                blockItem={item}
                themeColor={profile.themeColor}
                isAnimating={true}
              />
            );
          })}
        </VStack>
      </Container>
    </Box>
  );
}
