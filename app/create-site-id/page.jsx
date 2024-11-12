'use client'

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { useUser } from '@/stores/userStore';
import { updateSlug, isSlugAvailable } from '@/services/userService';

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack
} from '@chakra-ui/react';

import bgAlicia from '@/assets/images/bg-alicia.webp';

export default function SiteIdCreator() {
  const router = useRouter();
  const user = useUser();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();


  const onSubmit = async (values) => {
    try {
      const { siteId } = values;

      const isAvailable = await isSlugAvailable(siteId);

      if (isAvailable) {
        await updateSlug(user.uid, siteId);
        alert('設定成功！');
      } else {
        return alert('此 ID 已被使用！');
      }

      router.push('/login');
    } catch (error) {
      console.error(error);
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
              mb="4rem"
              letterSpacing="0.05em"
            >
              設定專屬於你的網站 ID
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="1.5rem">
                <FormControl isInvalid={errors.siteId}>
                  <FormLabel>網站 ID</FormLabel>
                  <Input
                    borderColor="gray.300"
                    placeholder="輸入網站 ID"
                    {...register('siteId', {
                      required: '網站 ID 欄位為必填',
                      minLength: {
                        value: 3,
                        message: '最少需要 3 個字元'
                      },
                      maxLength: {
                        value: 15,
                        message: '最多只能有 15 個字元'
                      },
                      pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message: '網站 ID 格式無效，只能輸入英數或連字符',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.siteId && errors.siteId.message}
                  </FormErrorMessage>
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
                  確認
                </Button>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Container>
      <Box display={{ base: 'none', md: 'block' }}
        w="100%" position="relative">
        <Image
          style={{
            objectFit:"cover",
            objectPosition:"center"
          }}
          src={bgAlicia}
          alt='bg-create-site-id'
          fill
        ></Image>
      </Box>
    </Flex>
  );
}

