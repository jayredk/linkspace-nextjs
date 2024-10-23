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
} from '../constants/utilityMaps';

import {
  MdImage,
} from 'react-icons/md';

export default function MultiTypeBlock({ blockItem, themeColor, isAnimating }) {
  return (
    <Box w="100%" bgColor="transparent" borderRadius="md">
      {blockItem.type === 'text-button' && (
        <VStack
          spacing={4}
          flexGrow="1"
          align="stretch"
          textAlign="center"
        >
          {blockItem.buttons.map((button, index) => {
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
                  blockItem.isSolid ? themeColorsMap[themeColor] : 'transparent'
                }
                color={blockItem.isSolid ? '#fff' : themeColorsMap[themeColor]}
                textDecoration="none"
                border="2px"
                borderColor={themeColorsMap[themeColor]}
                borderRadius="10px"
                p="1rem"
                _hover={{
                  transform: 'scale(1.03)',
                  textDecoration: 'none',
                  backgroundColor: blockItem.isSolid
                    ? '#fff'
                    : themeColorsMap[themeColor],
                  color: blockItem.isSolid
                    ? themeColorsMap[themeColor]
                    : '#fff',
                }}
              >
                {blockItem.hasSubtitle && !blockItem.hasImage && (
                  <Icon
                    as={iconMap[button.icon]}
                    fontSize={iconSizeMapWithSubtitle[blockItem.fontSize]}
                  />
                )}
                {!blockItem.hasSubtitle && !blockItem.hasImage && (
                  <Icon
                    as={iconMap[button.icon]}
                    fontSize={iconSizeMap[blockItem.fontSize]}
                  />
                )}

                {blockItem.hasImage && button.imageUrl && (
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

                {blockItem.hasImage && !button.imageUrl && (
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

                {blockItem.hasSubtitle ? (
                  <Text
                    fontSize={fontSizeMapWithSubtitle[blockItem.fontSize]}
                    mx="auto"
                  >
                    {button.text}
                    <Text as="span" display="block" fontSize="md">
                      {button.subText}
                    </Text>
                  </Text>
                ) : (
                  <Text
                    fontSize={fontSizeMap[blockItem.fontSize]}
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

      {blockItem.type === 'banner-board' &&
        blockItem.blocks.map((block, index) => (
          <Link
            key={index}
            href={block.linkUrl}
            isExternal
            display="block"
            position="relative"
          >
            <AspectRatio w="100%" ratio={2 / 1}>
              <Image src={block.imageUrl} alt="naruto" objectFit="cover" />
            </AspectRatio>
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
          </Link>
        ))}

      {blockItem.type === 'square-board' &&
        blockItem.blocks.map((block, index) => (
          <Link
            key={index}
            href={block.linkUrl}
            isExternal
            display="block"
            position="relative"
          >
            <AspectRatio w="100%" ratio={1 / 1}>
              <Image
                src={block.imageUrl}
                alt="naruto"
                objectFit="cover"
                borderRadius="lg"
              />
            </AspectRatio>
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
          </Link>
        ))}

      {blockItem.type === 'double-square-board' && (
        <SimpleGrid columns={2} spacing={4}>
          {blockItem.blocks.map((block, index) => {
            return (
              <Link
                key={index}
                href={block.linkUrl}
                target="_blank"
                position="relative"
                _hover={{
                  transform: 'scale(1.03)',
                  transition: 'transform .3s',
                }}
              >
                <AspectRatio w="100%" ratio={1 / 1}>
                  <Image
                    src={block.imageUrl}
                    alt="naruto"
                    borderRadius="md"
                    objectFit="cover"
                  />
                </AspectRatio>
                <Text
                  bgImage="linear-gradient(transparent, rgba(0, 0, 0, 0.8) 90%)"
                  borderRadius="md"
                  color="white"
                  fontSize="sm"
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  p="1rem"
                >
                  {block.text}
                </Text>
              </Link>
            );
          })}
        </SimpleGrid>
      )}

      {blockItem.type === 'video-player' && (
        <Box
          sx={{
            '.lty-playbtn': {
              backgroundImage: "url('/play-btn.svg')",
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
            videoid={getVideoId(blockItem.videoUrl)}
            playlabel={'Play: ' + blockItem.videoDescription}
          >
            <a
              href="https://youtube.com/watch?v=DZkbDCSdC1Q"
              className="lty-playbtn"
              title="Play Video"
            >
              <span className="lyt-visually-hidden">
                Play Video: {blockItem.videoDescription}
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
