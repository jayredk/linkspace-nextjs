'use client'

import { useState } from 'react';

import {
  Avatar,
  Box,
  Heading,
  Icon,
  IconButton,
  Link,
  Text,
  Tooltip,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import { MdCheck, MdIosShare } from 'react-icons/md';

import {
  themeColorsMap,
  textColorMap,
  iconMap,
} from '@/constants/utilityMaps';


export default function UserProfile({ profile, slug, children }) {
  const [isUrlCopy, setIsUrlCopy] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/${slug}`);
      setIsUrlCopy(true);

      setTimeout(() => {
        setIsUrlCopy(false);
      }, 2000);
    } catch (error) {
      alert('複製失敗');
    }
  };


  return (
    <VStack
      position="relative"
      w="100%"
      spacing="1rem"
      p="3rem"
      pb="rem"
    >
      <Tooltip label="分享" borderRadius="1.5rem">
        <IconButton
          position="absolute"
          left="2rem"
          top="1rem"
          color={themeColorsMap[profile.themeColor]}
          bgColor="transparent"
          icon={<Icon fontSize="1.5rem" as={isUrlCopy ? MdCheck : MdIosShare} />}
          onClick={handleCopyUrl}
        />
      </Tooltip>

      <Avatar size="2xl" src={profile.avatar} />
      <Box textAlign="center" color={textColorMap[profile.textColor]}>
        <Heading as="h1" size="md" mb="0.5rem">
          {profile.name}
        </Heading>
        <Text whiteSpace="pre-wrap">{profile.description}</Text>
      </Box>
      <Wrap spacing={6} my="0.5rem">
        {profile.links?.map((link, index) => {
          return (
            <WrapItem key={index}>
              <Tooltip label={link.text} borderRadius="1.5rem">
                <Link
                  href={link.url}
                  target="_blank"
                  color={themeColorsMap[profile.themeColor]}
                  bgColor="transparent"
                  _hover={{
                    transform: 'scale(1.2)',
                  }}
                >
                  <Icon as={iconMap[link.icon]} fontSize="1.5rem" />
                </Link>
              </Tooltip>
            </WrapItem>
          );
        })}
      </Wrap>
      {children}
    </VStack>
  );
}
