'use client'

import { useEffect } from 'react'

import {
  AspectRatio,
  Box,
  Flex,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';

import {
  themeColorsMap,
  effectMap,
  fontSizeMap,
  fontSizeMapWithSubtitle,
  iconSizeMap,
  iconSizeMapWithSubtitle,
  iconMap,
} from '@/constants/utilityMaps';

import {
  MdImage,
} from 'react-icons/md';

import 'lite-youtube-embed/src/lite-yt-embed.css';

import 'animate.css';
import '../assets/styles/effect.css'


export default function MultiTypeBlock({ section, themeColor, isAnimating }) {

  useEffect(() => {
  import('lite-youtube-embed')
}, [])

  return (
    <Box
      as="section"
      w="100%"
      bgColor="transparent"
      borderRadius="md"
    >
      {section.type === 'text-button' && (
        <VStack
          spacing={4}
          flexGrow="1"
          align="stretch"
          textAlign="center"
        >
          {section.buttons.map((button, index) => {
            return (
              <Link
                style={{ '--animate-duration': '2s' }}
                href={button.linkUrl}
                isExternal
                key={index}
                className={
                  isAnimating &&
                  `animate__animated animate__infinite ${effectMap[button.effect]}`
                }
                display="flex"
                alignItems="center"
                backgroundColor={
                  section.isSolid ? themeColorsMap[themeColor] : 'transparent'
                }
                color={section.isSolid ? '#fff' : themeColorsMap[themeColor]}
                textDecoration="none"
                border="2px"
                borderColor={themeColorsMap[themeColor]}
                borderRadius="10px"
                p="1rem"
                _hover={{
                  transform: 'scale(1.03)',
                  textDecoration: 'none',
                  backgroundColor: section.isSolid
                    ? '#fff'
                    : themeColorsMap[themeColor],
                  color: section.isSolid ? themeColorsMap[themeColor] : '#fff',
                }}
              >
                {section.hasSubtitle && !section.hasImage && (
                  <Icon
                    as={iconMap[button.icon]}
                    fontSize={iconSizeMapWithSubtitle[section.fontSize]}
                  />
                )}
                {!section.hasSubtitle && !section.hasImage && (
                  <Icon
                    as={iconMap[button.icon]}
                    fontSize={iconSizeMap[section.fontSize]}
                  />
                )}

                {section.hasImage && button.imageUrl && (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    bgColor="gray.400"
                    boxShadow="md"
                    rounded="sm"
                  >
                    <AspectRatio maxW="128px" w="4rem" ratio={1}>
                      <Image
                        src={button.imageUrl}
                        alt={button.imageAlt}
                        rounded="sm"
                      />
                    </AspectRatio>
                  </Flex>
                )}

                {section.hasImage && !button.imageUrl && (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    p="1rem"
                    bgColor="gray.400"
                    boxShadow="md"
                    rounded="sm"
                  >
                    <Icon as={MdImage} fontSize="1.5rem" />
                  </Flex>
                )}

                {section.hasSubtitle ? (
                  <Text
                    fontSize={fontSizeMapWithSubtitle[section.fontSize]}
                    fontWeight="bold"
                    mx="auto"
                  >
                    {button.text}
                    <Text
                      as="span"
                      display="block"
                      fontSize="md"
                      fontWeight="medium"
                    >
                      {button.subText}
                    </Text>
                  </Text>
                ) : (
                  <Text
                    fontSize={fontSizeMap[section.fontSize]}
                    fontWeight="bold"
                    mx="auto"
                  >
                    {button.text}
                  </Text>
                )}
              </Link>
            );
          })}
        </VStack>
      )}

      {section.type === 'banner-board' &&
        section.blocks.map((block, index) => (
          <Link
            key={index}
            href={block.linkUrl}
            isExternal
            display="block"
            position="relative"
            borderRadius="lg"
            overflow="hidden"
          >
            <AspectRatio w="100%" ratio={2 / 1}>
              {block.imageUrl ? (
                <Image
                  src={block.imageUrl}
                  alt={block.text}
                  objectFit="cover"
                />
              ) : (
                <Box bgColor="#E2E8F0">
                  <Icon boxSize="50%" as={MdImage} />
                </Box>
              )}
            </AspectRatio>
            {block.text && (
              <Text
                bgImage="linear-gradient(transparent, rgba(0, 0, 0, 0.8) 90%)"
                color="white"
                fontSize="sm"
                textAlign="left"
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                p="1rem"
              >
                {block.text}
              </Text>
            )}
          </Link>
        ))}

      {section.type === 'square-board' &&
        section.blocks.map((block, index) => (
          <Link
            key={index}
            href={block.linkUrl}
            isExternal
            display="block"
            position="relative"
            borderRadius="lg"
            overflow="hidden"
          >
            <AspectRatio w="100%" ratio={1 / 1}>
              {block.imageUrl ? (
                <Image
                  src={block.imageUrl}
                  alt={block.text}
                  objectFit="cover"
                />
              ) : (
                <Box bgColor="#E2E8F0">
                  <Icon boxSize="50%" as={MdImage} />
                </Box>
              )}
            </AspectRatio>
            {block.text && (
              <Text
                bgImage="linear-gradient(transparent, rgba(0, 0, 0, 0.8) 90%)"
                color="white"
                fontSize="sm"
                textAlign="left"
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                p="1rem"
              >
                {block.text}
              </Text>
            )}
          </Link>
        ))}

      {section.type === 'double-square-board' && (
        <SimpleGrid columns={2} spacing={4}>
          {section.blocks.map((block, index) => {
            return (
              <Link
                key={index}
                href={block.linkUrl}
                target="_blank"
                position="relative"
                borderRadius="md"
                overflow="hidden"
                _hover={{
                  transform: 'scale(1.03)',
                  transition: 'transform .3s',
                }}
              >
                <AspectRatio w="100%" ratio={1 / 1} >
                  {block.imageUrl ? (
                    <Image
                      src={block.imageUrl}
                      alt={block.text}
                      objectFit="cover"
                    />
                  ) : (
                    <Box bgColor="#E2E8F0">
                      <Icon boxSize="50%" as={MdImage} />
                    </Box>
                  )}
                </AspectRatio>
                {block.text && (
                  <Text
                    bgImage="linear-gradient(transparent, rgba(0, 0, 0, 0.8) 90%)"
                    color="white"
                    fontSize="sm"
                    textAlign="left"
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    p="1rem"
                  >
                    {block.text}
                  </Text>)}
              </Link>
            );
          })}
        </SimpleGrid>
      )}

      {section.type === 'video-player' && (
        <Box
          sx={{
            '.lty-playbtn': {
              backgroundImage: "url('/images/play-btn.svg')",
              backgroundSize: '1.25rem',
              backgroundRepeat: 'no-repeat',
              bgColor: themeColorsMap[themeColor],
              filter: 'none',
              border: '2px solid white',
              borderRadius: '50%',
              w: '2.5rem',
              h: '2.5rem',
            },
            'lite-youtube': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'md',
            },
          }}
        >
          <lite-youtube
            videoid={getVideoId(section.videoUrl)}
            playlabel={'Play: ' + section.videoDescription}
            style={{
              backgroundImage: `url(https://i.ytimg.com/vi_webp/${getVideoId(section.videoUrl)}/maxresdefault.webp)`,
            }}
          >
            <a href="#" className="lty-playbtn" title="Play Video">
              <span className="lyt-visually-hidden">
                Play Video: {section.videoDescription}
              </span>
            </a>
          </lite-youtube>
        </Box>
      )}
    </Box>
  );
}

function getVideoId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  let videoId = null;
  const match = url.match(regex);

  if (match) {
    videoId = match[1];
  }
  return videoId;
}
