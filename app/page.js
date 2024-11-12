'use client'

import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Flex,
  Heading,
  Hide,
  keyframes,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

import Image from 'next/image'

import Link from 'next/link'



import avatar_1 from '../assets/images/home-avatar-1.jpg';
import avatar_2 from '../assets/images/home-avatar-2.jpg';
import avatar_3 from '../assets/images/home-avatar-3.jpg';

import feature_1 from '../assets/images/feature-1.svg';
import feature_2 from '../assets/images/feature-2.webp';
import feature_3 from '../assets/images/feature-3.webp';

const testimonials = [
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731247828117?alt=media&token=fa64034d-f87a-4de5-bde0-0f028ced1319',
    content:
      '使用過後，我發現回不去了。把圖片整合到連結中，讓內容更具視覺吸引力，也提高了點擊率',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731210830729?alt=media&token=1d254545-676b-4849-b4fd-901ead890ff2',
    content:
      '好用的連結工具！自由設計頁面的靈活度高💜 操作容易，只需幾個步驟就能完成一個吸睛的網站！',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731245301246?alt=media&token=e62f0be5-0e09-4cdc-875c-a3eae2177707',
    content:
      '對於沒有資源建立官方網頁的個人創作者，這是個不錯的選擇，透過多種方式呈現商品、導流。',
  },
];

const highlightUsers = [
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1729588953818?alt=media&token=4b100c05-3101-46fc-bfc3-f0166ab3f31f',
    name: '曾博恩',
    link: 'https://linkspace-one.vercel.app/briantseng',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1729589503453?alt=media&token=43e66fcd-40f3-4d4a-a367-0fa9b9096d51',
    name: '阿滴',
    link: 'https://linkspace-one.vercel.app/durayray',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731245301246?alt=media&token=e62f0be5-0e09-4cdc-875c-a3eae2177707',
    name: '末羊子',
    link: 'https://linkspace-one.vercel.app/dontkjoanne',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731245775123?alt=media&token=b832bfdd-7e40-4ae6-b536-effb3801c636',
    name: 'Ahoi/厚子',
    link: 'https://linkspace-one.vercel.app/ahoiii',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731247037021?alt=media&token=902c3c8f-20f6-46de-a6ce-6676b38facfc',
    name: 'Aerysky',
    link: 'https://linkspace-one.vercel.app/aerysky',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731247828117?alt=media&token=fa64034d-f87a-4de5-bde0-0f028ced1319',
    name: '陪沈團',
    link: 'https://linkspace-one.vercel.app/moneyshen',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2F1731210830729?alt=media&token=1d254545-676b-4849-b4fd-901ead890ff2',
    name: 'IU',
    link: 'https://linkspace-one.vercel.app/dlwlrma',
  },
  {
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/linkspace-c64be.appspot.com/o/avatar-images%2Fblockstudio.webp?alt=media&token=10f79308-3888-4d75-aa56-420e16586c1f',
    name: '版塊設計',
    link: 'https://linkspace-one.vercel.app/blockstudio',
  },
];

const marqueeLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 3rem));
  }
`;

const marqueeLeftAnimation = `${marqueeLeft} 20s linear infinite`;


export default function Home() {
  return (
    <Box minHeight="100vh" bgColor="#151515" color="#FCF6EE">
      <Container maxW="1200px" pb="2rem">
        <Box as="header" py="1.5rem">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            gap="2"
            px="0.75rem"
            py="0.5rem"
            bgColor="#232020"
            borderRadius="2xl"
          >
            <Box p="2">
              <Heading as="h1" fontSize="1.75rem" letterSpacing="0.05em">
                <Link href="/">Linkspace</Link>
              </Heading>
            </Box>
            <Hide below="md">
              <Wrap spacing="1.5rem">
                <WrapItem>
                  <ScrollLink to="#feature">功能介紹</ScrollLink>
                </WrapItem>
                <WrapItem>
                  <ScrollLink to="#highlight">精選帳號</ScrollLink>
                </WrapItem>
                <WrapItem>
                  <ScrollLink to="#feedback">用戶心得</ScrollLink>
                </WrapItem>
              </Wrap>
            </Hide>
            <Flex gap="2">
              <Box
                py="0.5rem"
                bgColor="#34312D"
                color="inherit"
                borderRadius="lg"
                _hover={{
                  bg: '#34312D',
                }}
                sx={{
                  '& a': {
                    padding: '1rem',
                  },
                }}
              >
                <Link href="/signup">註冊</Link>
              </Box>
              <Box
                py="0.5rem"
                bgGradient="linear(to-br, #e6d9ca, #efe5dc, #ffffff)"
                color="#151515"
                borderRadius="lg"
                _hover={{
                  bg: '#fff',
                }}
                sx={{
                  '& a': {
                    padding: '1rem',
                  },
                }}
              >
                <Link href="/login">登入</Link>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Center as="section" pt={{ base: '6rem', md: '3rem' }} pb="12rem">
          <Stack spacing="2rem" alignItems="center">
            <Flex
              p="0.5rem"
              border="1px"
              borderColor="#2b2b2b"
              borderRadius="9999px"
              alignItems="center"
              gap="0.5rem"
            >
              <AvatarGroup size="sm" max={5}>
                <Box w="2rem" h="2rem">
                  <Image src={avatar_1} alt="kent" style={{ borderRadius: '50%' }}/>
                </Box>
                <Box w="2rem" h="2rem">
                  <Image src={avatar_2} alt="kent" style={{ borderRadius: '50%' }}/>
                </Box>
                <Box w="2rem" h="2rem">
                  <Image src={avatar_3} alt="kent" style={{ borderRadius: '50%' }}/>
                </Box>
              </AvatarGroup>
              <Text fontSize="sm">35,000+ 人都在使用</Text>
            </Flex>

            <Heading
              fontSize={{
                base: '3rem',
                md: '5rem',
              }}
              textAlign="center"
            >
              打造屬於你的
              <br />
              社群連結任意門
            </Heading>

            <Box textAlign="center">
              <Text>社群連結很多，分享時很麻煩嗎？</Text>
              <Text>
                快來使用 Linkspace
                一頁式網站滿足所有願望，透過拖拉方式即可快速完成
              </Text>
            </Box>

            <Box
              py="1rem"
              bgGradient="linear(to-br, #e6d9ca, #efe5dc, #ffffff)"
              color="#151515"
              borderRadius="2xl"
              boxShadow="0px 3px 10px #e6d9ca"
              fontSize="xl"
              fontWeight="bold"
              _hover={{
                bg: '#fff',
              }}
              sx={{
                '& a': {
                  padding: '2rem',
                },
              }}
            >
              <Link href="/login">立即使用</Link>
            </Box>
          </Stack>
        </Center>

        <Box as="section">
          <Heading
            id="feature"
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            pt="4rem"
            mb="8rem"
          >
            你可以做到...
          </Heading>
          <Flex
            flexDirection={{ base: 'column-reverse', md: 'row' }}
            justifyContent="center"
            alignItems="center"
            mb="8rem"
            gap="6rem"
          >
            <Box maxW={{ base: '90%', md: '40%' }}>
              <Heading as="h3" mb="1rem">
                多元區塊選擇
              </Heading>
              <Text>從文字連結到影音播放器，滿足所有展示需求。</Text>
            </Box>
            <Box maxW={{ base: '80%', md: '40%' }} boxSize={{ base: '80%', md: '40%' }}>
              <Image
                src={feature_1}
                alt="diverse blocks"
              />
            </Box>
          </Flex>
          <Flex
            flexDirection={{ base: 'column-reverse', md: 'row-reverse' }}
            justifyContent="center"
            alignItems="center"
            mb="8rem"
            gap="3rem"
          >
            <Box maxW={{ base: '90%', md: '40%' }}>
              <Heading mb="1rem">輕鬆編輯，自由調整</Heading>
              <Text>簡單拖放、即時預覽，快速打造屬於你的專屬頁面。</Text>
            </Box>
            <Box maxW="80%" boxSize={{ base: '80%', md: '50%' }}>
              <Image
                src={feature_2}
                alt="drag simple, edit easy"
              />
            </Box>
          </Flex>
          <Flex
            flexDirection={{ base: 'column-reverse', md: 'row' }}
            justifyContent="center"
            alignItems="center"
            gap="4rem"
          >
            <Box maxW={{ base: '90%', md: '40%' }}>
              <Heading mb="1rem">一次整合所有社群</Heading>
              <Text>
                將你的所有社群連結集中於一處，連結你的
                Instagram、YouTube、Threads 與 Tiktok。
              </Text>
              <Text>建立個人品牌，方便分享，增加曝光</Text>
            </Box>
            <Box maxW={{ base: '70%', md: '40%' }} boxSize={{ base: '70%', md: '40%' }}>
            <Image
              src={feature_3}
              alt="all link in one place"
            />
            </Box>
          </Flex>
        </Box>
      </Container>

      <Box py="4rem">
        <Center mb="6rem">
          <Heading id="highlight" pt="3rem">
            精選帳號
          </Heading>
        </Center>

        <Flex overflow="hidden" gap="3rem">
          <Flex as="ul" gap="3rem" animation={marqueeLeftAnimation}>
            {highlightUsers.map((user) => (
              <Box key={user.link} as="li" listStyleType="none">
                <Link href={user.link} target="_blank">
                  <Avatar src={user.avatar} ignoreFallback={true} size="2xl" mb="1rem"></Avatar>
                  <Heading as="h4" textAlign="center" fontSize="lg">
                    {user.name}
                  </Heading>
                </Link>
              </Box>
            ))}
          </Flex>

          <Flex as="ul" gap="3rem" animation={marqueeLeftAnimation}>
            {highlightUsers.map((user) => (
              <Box key={user.link} as="li" listStyleType="none">
                <Link href={user.link} target="_blank">
                  <Avatar src={user.avatar} ignoreFallback={true} size="2xl" mb="1rem"></Avatar>
                  <Heading as="h4" textAlign="center" fontSize="lg">
                    {user.name}
                  </Heading>
                </Link>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>

      <Container maxW="1200px" py="4rem">
        <Box as="section">
          <Center mb="4rem">
            <Heading id="feedback" pt="4rem">
              用戶心得
            </Heading>
          </Center>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={16}>
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.avatar}
                border="1px solid"
                borderColor="#222222"
                borderRadius="30px"
                bgGradient="linear(180deg,#1e1e1e 0%,rgb(20,20,20) 100%)"
                color="inherit"
                maxW={{ base: '80%', sm: '70%', md: '100%'}}
                marginX="auto"
                py="3rem"
              >
                <CardHeader>
                  <Center>
                    <Avatar
                      size="xl"
                      name="Dan Abrahmov"
                      src={testimonial.avatar}
                    />
                  </Center>
                </CardHeader>
                <CardBody maxW="80%" margin="auto">
                  <Text>{testimonial.content}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        <Center as="section" flexDirection="column" py="8rem">
          <Heading mb="4rem">心動了嗎？快來使用！</Heading>
          <Box
            py="1rem"
            bgGradient="linear(to-br, #e6d9ca, #efe5dc, #ffffff)"
            color="#151515"
            borderRadius="2xl"
            boxShadow="0px 3px 10px #e6d9ca"
            fontSize="xl"
            fontWeight="bold"
            _hover={{
              bg: '#fff',
            }}
            sx={{
              '& a': {
                padding: '2rem',
              },
            }}
          >
            <Link href="/signup">立即註冊</Link>
          </Box>
        </Center>
      </Container>

      <Container as="footer" maxW="100%" px="5rem">
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap="3rem"
          py="2rem"
          borderTop="1px"
          borderColor="#222222"
        >
          <Heading opacity="0.5" userSelect="none">
            Linkspace
          </Heading>
          <Text color="gray">此為個人實驗網站，無商業用途</Text>
          <Text display="flex">
            Made with love by&nbsp;
            <Link href="https://github.com/jayredk" target="_blank">
              <Text
                as="span"
                opacity="0.5"
                transition="opacity .3s"
                _hover={{
                  opacity: 1,
                }}
              >
                Jay
              </Text>
            </Link>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

function ScrollLink({ to, children }) {
  const handleClick = (e) => {
    e.preventDefault();
    document.querySelector(to).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}