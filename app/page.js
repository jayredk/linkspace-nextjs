import Link from "next/link";

import {
  Box,
  Container,
  Flex,
  Heading,
  Hide,
  Stack,
  AvatarGroup,
  Avatar,
  Text,
  Center,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Box minHeight="100vh" bgColor="#151515" color="#FCF6EE">
      <Container maxW="1200px">
        <Box py="1.5rem" mb="3rem">
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

        <Center>
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
      </Container>
    </Box>
  );
}

