import { useEffect, useState } from 'react';

import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import UserProfile from '@/components/UserProfile';
import CropImageModal from './CropImageModal';

import { useUser } from '@/stores/userStore';

import { db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { generateId } from '@/utils/id';

import {
  bgColorsMap,
  iconMap,
  themeColorsMap
} from '@/constants/utilityMaps';

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure,
  VStack
} from '@chakra-ui/react';

import {
  MdDragHandle,
  MdImage,
  MdOutlineDeleteForever,
  MdTitle
} from 'react-icons/md';



export default function ProfileEditorModal({
  isOpen,
  onClose,
  profile,
  setProfile,
}) {
  const user = useUser();
  const userId = user?.uid;

  const [tempProfile, setTempProfile] = useState({ ...profile });

  useEffect(() => {
    setTempProfile({
      ...profile,
    });
  }, [profile]);

  const {
    isOpen: isCropModalOpen,
    onOpen: onCropModalOpen,
    onClose: onCropModalClose,
  } = useDisclosure();


  const handleTempProfileChange = (e) => {
    // console.log(e.target.name);

    const { name, value } = e.currentTarget;

    switch (name) {
      case 'name': {
        setTempProfile((prevState) => ({
          ...prevState,
          name: value,
        }));
        break;
      }

      case 'description': {
        setTempProfile((prevState) => ({
          ...prevState,
          description: value,
        }));
        break;
      }

      case 'link': {
        const linkId = e.currentTarget.dataset.id
        
        setTempProfile((prevState) => {
          const updatedLinks = prevState.links.map((link) =>
            linkId === link.id
              ? {
                ...link,
                url: value,
              }
              : link
          );

          return {
            ...prevState,
            links: updatedLinks,
          };
        });
        break;
      }

      case 'newLink': {
        const newLink = {
          id: generateId('link'),
          icon: '',
          text: '',
          url: '',
        };

        setTempProfile((prevState) => {
          const updatedLinks = [...prevState.links];
          updatedLinks.push(newLink);

          return {
            ...prevState,
            links: updatedLinks,
          };
        });
        break;
      }

      case 'removeLink': {
        const linkId = e.currentTarget.dataset.id

        setTempProfile((prevState) => {
          const linkIndex = prevState.links.findIndex((link) => link.id === linkId)

          const updatedLinks = [...prevState.links];
          updatedLinks.splice(linkIndex, 1);

          return {
            ...prevState,
            links: updatedLinks,
          };
        });
        break;
      }

      case 'bgColor': {
        setTempProfile((prevState) => {
          return {
            ...prevState,
            bgColor: value,
            textColor: value === 'black' ? 'white' : 'black',
          };
        });
        break;
      }

      case 'color': {
        setTempProfile((prevState) => {
          return {
            ...prevState,
            themeColor: value,
          };
        });
        break;
      }

      default:
        break;
    }
    
  };

  const [tempImageInfo, setTempImageInfo] = useState({
    imageUrl: null,
  });

  const [tempCroppedImage, setTempCroppedImage] = useState(null);


  async function handleSave() {
    let avatar = null;
    if (tempCroppedImage) {
      avatar = await handleUploadImage();
    }

    const docRef = doc(db, 'users', userId);

    const newProfile = {
      ...tempProfile,
      avatar: avatar || tempProfile.avatar,
    };

    await updateDoc(docRef, {
      profile: newProfile,
    });

    setProfile(newProfile);
    setTempProfile({});
    onClose();
  }

  function handleClose() {
    setTempProfile(profile);
  }

  function handleImageChange(e) {
    const image = e.currentTarget.files[0];

    const imageUrl = URL.createObjectURL(image);

    setTempCroppedImage(null);

    setTempImageInfo({
      imageUrl,
    });

    setTempProfile({
      ...tempProfile,
      avatar: imageUrl,
    });

    onCropModalOpen();
  }

  async function handleUploadImage() {
    const imageBlob = await fetch(tempProfile.avatar).then((res) => res.blob());

    const metadata = {
      contentType: 'image/webp',
    };

    const storage = getStorage();
    const imageRef = ref(storage, `avatar-images/${Date.now()}`);

    const snapshot = await uploadBytes(imageRef, imageBlob, metadata);

    const imageUrl = await getDownloadURL(snapshot.ref);

    return imageUrl;
  }

  // useEffect(() => {
  //   setModalState(tempBlockData);
  // }, [tempBlockData]);

  useEffect(() => {
    if (tempCroppedImage) {
      setTempProfile((prevState) => {
        return {
          ...prevState,
          avatar: tempCroppedImage,
        };
      });
    }
  }, [tempCroppedImage]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = tempProfile.links.findIndex((link) => link.id === active.id);
      const newIndex = tempProfile.links.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(tempProfile.links, oldIndex, newIndex);

      setTempProfile((prevState) => ({
        ...prevState,
        links: newLinks
      }))
    }
  }

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={isOpen}
        onClose={onClose}
        w="100%"
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent
          borderTopRadius="20px"
          flexDirection="row"
          overflow="hidden"
        >
          <ModalHeader
            borderBottom="1px"
            borderColor="gray.400"
            borderTopRadius="20px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            left="0"
            right="0"
            py="1.25rem"
          >
            <Heading size="md">編輯個人檔案</Heading>
            <ModalCloseButton onClick={handleClose} position="static" />
          </ModalHeader>
          <ModalBody maxW="50%" mt="5rem">
            <Tabs position="relative" variant="unstyled">
              <TabList>
                <Tab>個人檔案</Tab>
                <Tab>主題設定</Tab>
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
              />
              <TabPanels>
                <TabPanel>
                  <Box>
                    <Flex alignItems="center" mb="1rem">
                      <Icon as={MdTitle} mr="1rem" fontSize="xl" />
                      <Input
                        name="name"
                        border="1px"
                        placeholder="輸入個人暱稱"
                        onChange={handleTempProfileChange}
                        value={tempProfile.name}
                      />
                    </Flex>
                    <Flex alignItems="center" mb="1rem">
                      <Icon as={MdTitle} mr="1rem" fontSize="xl" />
                      <Textarea
                        border="1px"
                        resize="none"
                        name="description"
                        placeholder="輸入個人簡介"
                        onChange={handleTempProfileChange}
                        value={tempProfile.description}
                      />
                    </Flex>
                    <EditAvatar
                      avatar={tempProfile.avatar}
                      name={tempProfile.name}
                      handleImageChange={handleImageChange}
                    />
                    <Divider my="2rem" borderColor="gray.400" />
                    <DndContext onDragEnd={handleDragEnd}>
                      <SortableContext items={tempProfile.links}>
                        <VStack spacing={2}>
                          {tempProfile.links?.length > 0 &&
                            tempProfile.links?.map((link) => (
                              <SortableLink key={link.id} link={link} handleTempProfileChange={handleTempProfileChange} />
                            ))}
                        </VStack>
                      </SortableContext>
                    </DndContext>
                    <Center my="1rem">
                      <Button
                        px="2rem"
                        isDisabled={tempProfile.links?.length >= 8}
                        name="newLink"
                        onClick={handleTempProfileChange}
                      >
                        新增連結
                      </Button>
                    </Center>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mb="1.5rem">
                    <Heading as="h3" fontSize="1.25rem" mb="1rem">
                      背景顏色
                    </Heading>
                    <RadioGroup value={tempProfile.bgColor}>
                      <Stack direction="row">
                        <Radio
                          name="bgColor"
                          onChange={handleTempProfileChange}
                          value="white"
                        >
                          白晝
                        </Radio>
                        <Radio
                          name="bgColor"
                          onChange={handleTempProfileChange}
                          value="black"
                        >
                          黑夜
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <Heading as="h3" fontSize="1.25rem" mb="1rem">
                      主題顏色
                    </Heading>
                    <ButtonGroup>
                      {Object.entries(themeColorsMap).map((color) => {
                        const [colorName, colorValue] = color;
                        return (
                          <Button
                            key={colorName}
                            name="color"
                            bgColor={colorValue}
                            border="1px"
                            borderColor={colorValue}
                            borderRadius="50%"
                            size="sm"
                            _hover={{
                              color: 'inherit',
                            }}
                            _active={{
                              color: 'inherit',
                            }}
                            onClick={handleTempProfileChange}
                            value={colorName}
                          ></Button>
                        );
                      })}
                    </ButtonGroup>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <Divider
            orientation="vertical"
            h="100vh"
            mt="6rem"
            borderColor="gray.400"
          />

          <ModalFooter
            flexDirection="column"
            justifyContent="space-between"
            flexGrow="1"
            maxW="50%"
            mt="6rem"
          >
            <Container
              bgColor={bgColorsMap[tempProfile.bgColor]}
              borderRadius="lg"
            >
              <VStack
                spacing={4}
                flexGrow="1"
                pb="6rem"
                align="stretch"
                textAlign="center"
              >
                <UserProfile profile={tempProfile} />
              </VStack>
            </Container>

            <Button
              onClick={handleSave}
              alignSelf="flex-end"
              colorScheme="blue"
            >
              儲存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CropImageModal
        isOpen={isCropModalOpen}
        onOpen={onCropModalOpen}
        onClose={onCropModalClose}
        tempImageInfo={tempImageInfo}
        setTempCroppedImage={setTempCroppedImage}
      />
    </>
  );
}

function SortableLink({ link, handleTempProfileChange }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'default',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      {...attributes} 
      w="100%"
      alignItems="center"
      gap={4}
      mb="1rem"
    >
      <Icon {...listeners} cursor="grab" as={MdDragHandle} mr="1rem" fontSize="xl" />
      <Icon
        as={iconMap[link.icon]}
        fontSize="1.25rem"
      ></Icon>
      <Input
        name="link"
        data-id={link.id}
        border="1px"
        placeholder="https://www.instagram.com/xxx"
        onChange={handleTempProfileChange}
        value={link.url}
      />
      <IconButton
        name="removeLink"
        data-id={link.id}
        onClick={handleTempProfileChange}
        colorScheme="red"
        fontSize="1.25rem"
        aria-label="delete"
        icon={<MdOutlineDeleteForever color="inherit" />}
      />
    </Flex>
  )
}


function EditAvatar({
  avatar,
  name,
  index,
  handleImageChange,
  onCropModalOpen,
}) {
  return (
    <Flex alignItems="center" mb="1rem">
      {avatar ? (
        <Box position="relative">
          <Image
            maxW="80px"
            mr="1rem"
            rounded="50%"
            objectFit="cover"
            src={avatar}
            alt={name}
          />
          <Input
            data-index={index}
            onChange={handleImageChange}
            id={`uploadBtn${index}`}
            accept="image/apng,image/gif,image/bmp,image/jpeg,image/png,image/webp"
            position="absolute"
            inset="0"
            height="100%"
            opacity="0"
            maxW="80px"
            mr="1rem"
            rounded="xl"
            type="file"
          />
        </Box>
      ) : (
        <label
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '1rem',
            backgroundColor: '#E2E8F0',
            borderRadius: '20px',
          }}
          htmlFor={`uploadBtn${index}`}
        >
          <Icon fontSize="1.5rem" as={MdImage}></Icon>
          <Input
            data-index={index}
            onChange={handleImageChange}
            id={`uploadBtn${index}`}
            accept="image/apng,image/gif,image/bmp,image/jpeg,image/png,image/webp"
            position="absolute"
            inset="0"
            opacity="0"
            maxW="80px"
            mr="1rem"
            rounded="xl"
            type="file"
          />
        </label>
      )}
      <Box flexGrow="1">
        <Flex gap="0.5rem" mb="0.5rem">
          <Button flexGrow="1">
            更換頭貼
            <label
              htmlFor={`uploadBtn${index}`}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                cursor: 'pointer',
              }}
            ></label>
          </Button>
          <Button
            isDisabled={!avatar}
            flexGrow="1"
            onClick={onCropModalOpen}
          >
            裁切圖片
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
