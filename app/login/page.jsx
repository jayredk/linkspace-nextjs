'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { auth } from '@/utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useSetUser } from '@/stores/userStore';

import {
  AbsoluteCenter,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';

import { FcGoogle } from 'react-icons/fc';

import bgIG from '@/assets/images/bg-IU.webp'

export default function Login() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const setUser = useSetUser();

  const onSubmit = async(values) => {
    try {
      const { mail, password } = values;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        mail,
        password
      );

      const { user } = userCredential;
      console.log(user);
      
      setUser({
        email: user.email,
        uid: user.uid,
      });
      

      router.push('/dashboard');
    } catch (err) {
      console.error(err.message);
    }

  };

  return (
    <Flex maxH="100vh" bgColor="white">
      <Container maxW={{ base: 'md', md: '50%' }} minH="100vh">
        <Flex flexDirection="column" justifyContent="center" h="100%">
          <Heading
            size="lg"
            textAlign="center"
            letterSpacing="0.05em"
            mb="4rem"
          >
            Linkspace
          </Heading>

          <Box px={{ base: '1.5rem', xl: '9rem' }}>
            <Heading
              as="h1"
              size="lg"
              mb="2rem"
              letterSpacing="0.05em"
            >
              登入
            </Heading>
            <Button
              w="100%"
              py="1.25rem"
              bgColor="white"
              border="1px"
              borderColor="gray.300"
              borderRadius="md"
              leftIcon={<FcGoogle fontSize="1.5rem" />}
            >
              透過 Google 帳號登入
            </Button>
            <Box position="relative" py="8">
              <Divider />
              <AbsoluteCenter bg="white" color="gray.600" px="4">
                或
              </AbsoluteCenter>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="1.5rem">
                <FormControl isInvalid={errors.mail}>
                  <FormLabel>信箱</FormLabel>
                  <Input
                    borderColor="gray.300"
                    placeholder="輸入信箱"
                    {...register('mail', {
                      required: '信箱欄位為必填',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: '請輸入有效的信箱地址',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.mail && errors.mail.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password}>
                  <FormLabel>密碼</FormLabel>
                  <Input
                    type="password"
                    borderColor="gray.300"
                    placeholder="輸入密碼"
                    {...register('password', {
                      required: '密碼欄位為必填',
                    })}
                  />
                  <FormHelperText>密碼需包含英數至少 8 個字</FormHelperText>
                </FormControl>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  w="100%"
                  py="1.25rem"
                  bgColor="gray.900"
                  color="white"
                  border="1px"
                  borderRadius="md"
                  _hover={{
                    bgColor: 'gray.700',
                  }}
                >
                  登入
                </Button>
              </Stack>
            </form>
            <Text mt="2rem" textAlign="center">
              還沒有帳號嗎？
              <Link href="/signup" ms="0.5rem" textDecoration="underline">
                註冊
              </Link>
            </Text>
          </Box>
        </Flex>
      </Container>
      <Box display={{ base: 'none', md: 'block' }}
        w="100%">
        <Image
          style={{
            height: '100%',
            objectFit:"cover",
            objectPosition:"center"
          }}
          src={bgIG}
          alt='bg-IU'
        ></Image>
      </Box>
    </Flex>
  );
}

