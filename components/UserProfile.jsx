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

import { MdIosShare } from 'react-icons/md';

import {
  themeColorsMap,
  textColorMap,
  iconMap,
} from '../constants/utilityMaps';

export default function UserProfile({ profile, children }) {
  // const  = props;
  // console.log(props);
  // retunr
  // // if (!profile) return;
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
          icon={<Icon fontSize="1.5rem" as={MdIosShare} />}
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
