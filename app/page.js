import Image from 'next/image';
import Link from "next/link";

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
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

import AllInOnePlace from '../assets/images/home-1.png';

const testimonials = [
  {
    avatar: 'https://bit.ly/kent-c-dodds',
    content:
      '實際使用下來覺得回不去了，連結多了圖像更加豐富，增加消費者點選欲望、一目了然。',
  },
  {
    avatar: 'https://bit.ly/dan-abramov',
    content:
      '超好用的連結工具！頁面美編自由度很高🧡操作容易，簡單把你的網址變精緻！',
  },
  {
    avatar: 'https://bit.ly/ryan-florence',
    content:
      '如果是個人創作者沒有資源建立官方網頁，這是不錯的選擇，透過更細節的介紹呈現特色商品、傳遞品牌理念。',
  },
];

export default function Home() {
  return (
    <Box minHeight="100vh" bgColor="#151515" color="#FCF6EE">
      <Container maxW="1200px">
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
                  <Link href="/">精選帳號</Link>
                </WrapItem>
                <WrapItem>
                  <Link href="/">關於我們</Link>
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

        <Center as="section" pt="3rem" pb="10rem">
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
                <Avatar
                  borderColor="transparent"
                  name="Ryan Florence"
                  src="https://bit.ly/ryan-florence"
                />
                <Avatar
                  borderColor="transparent"
                  name="Kent Dodds"
                  src="https://bit.ly/kent-c-dodds"
                />
                <Avatar
                  borderColor="transparent"
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                />
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

        <Flex
          as="section"
          justifyContent="center"
          alignItems="center"
          mb="3rem"
        >
          <Box maxW="40%">
            <Heading mb="1rem">一次整合所有連結</Heading>
            <Text>
              整合所有社群連結，連結你的 Instagram、YouTube、Threads 與 Tiktok。
            </Text>
            <Text>建立個人品牌、活動專頁達成導流與銷售等經營目標。</Text>
          </Box>
          <Image
            maxW="50%"
            src={AllInOnePlace}
            boxSize="40%"
            alt="all link in one place"
          />
        </Flex>

        <Flex
          as="section"
          flexDirection="row-reverse"
          justifyContent="center"
          alignItems="center"
          mb="3rem"
        >
          <Box maxW="40%">
            <Heading mb="1rem">一次整合所有連結</Heading>
            <Text>
              整合所有社群連結，連結你的 Instagram、YouTube、Threads 與 Tiktok。
            </Text>
            <Text>建立個人品牌、活動專頁達成導流與銷售等經營目標。</Text>
          </Box>
          <Image
            maxW="50%"
            src={AllInOnePlace}
            boxSize="40%"
            alt="all link in one place"
          />
        </Flex>

        <Center mb="4rem">
          <Heading>使用者心得</Heading>
        </Center>
        <SimpleGrid columns={3} spacing={16}>
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.avatar}
              border="1px solid"
              borderColor="#1f1f1f"
              borderRadius="30px"
              bgGradient="linear(180deg,#1e1e1e 0%,rgb(20,20,20) 100%)"
              color="inherit"
              py="3rem"
            >
              <CardHeader>
                <Center>
                  <Avatar size="xl" name="Dan Abrahmov" src={testimonial.avatar} />
                </Center>
              </CardHeader>
              <CardBody maxW="80%" margin="auto">
                <Text>{testimonial.content}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
      <Container
        as="footer"
        maxW="100%"
        px="5rem"
        py="2rem"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading opacity="0.5" userSelect="none">
            Linkspace
          </Heading>
          <Text display="flex">
            Made with love by&nbsp;
            <Link target="_blank" href="https://github.com/jayredk">
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


