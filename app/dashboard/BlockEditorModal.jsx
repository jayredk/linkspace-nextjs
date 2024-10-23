import { useEffect, useState } from 'react';

import MultiTypeBlock from '../../components/MultiTypeBlock';
import CropImageModal from './CropImageModal';

import { useUser } from '../../stores/userStore';
import { db } from '../../utils/firebase';

import {
  iconArray,
  iconMap
} from '../../constants/utilityMaps';

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

import {
  MdClose,
  MdImage,
  MdOutlineEmojiEmotions,
  MdTitle,
} from 'react-icons/md';

import { BsLink45Deg } from 'react-icons/bs';

import { IoInformation } from 'react-icons/io5';

import { BiTimer } from 'react-icons/bi';


import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';


export default function BlockEditorModal({
  tempBlockData,
  isOpen,
  onClose,
  setBlocks,
  themeColor,
}) {
  const user = useUser();
  const userId = user?.uid;
  
  const [modalState, setModalState] = useState(tempBlockData);

  const {
    isOpen: isCropModalOpen,
    onOpen: onCropModalOpen,
    onClose: onCropModalClose,
  } = useDisclosure();

  const [tempImageInfo, setTempImageInfo] = useState({
    imageUrl: null,
    index: null,
  });

  const [tempCroppedImage, setTempCroppedImage] = useState(null);

  const {
    buttons = [],
    hasImage = false,
    hasSubtitle = false,
    isSolid = false,
    fontSize = 'sm',
  } = modalState;

  function handleModalStateChange(e) {
    const { name } = e.currentTarget;

    switch (name) {
      // text-button
      case 'fontSize':
        setModalState({
          ...modalState,
          [name]: e.currentTarget.value,
        });
        break;

      case 'text':
      case 'subText': {
        const { index } = e.currentTarget.dataset;
        const { value } = e.currentTarget;
        const newButtons = JSON.parse(JSON.stringify(buttons));

        name === 'text'
          ? (newButtons[index].text = value)
          : (newButtons[index].subText = value);

        setModalState({
          ...modalState,
          buttons: newButtons,
        });
        break;
      }

      case 'isSolid':
      case 'hasImage':
      case 'hasSubtitle':
        setModalState({
          ...modalState,
          [name]: e.currentTarget.checked,
        });
        break;

      case 'imageAlt': {
        const { index } = e.currentTarget.dataset;
        const newButtons = JSON.parse(JSON.stringify(buttons));

        newButtons[index].imageAlt = e.currentTarget.value;

        setModalState({
          ...modalState,
          buttons: newButtons,
        });
        break;
      }

      case 'changeIcon': {
        const { index } = e.currentTarget.dataset;
        const newButtons = JSON.parse(JSON.stringify(buttons));

        newButtons[index].icon = e.currentTarget.value;
        setModalState({
          ...modalState,
          buttons: newButtons,
        });
        break;
      }

      case 'url': {
        const url = e.currentTarget.value;
        const { index } = e.currentTarget.dataset;
        const newButtons = JSON.parse(JSON.stringify(buttons));

        newButtons[index].linkUrl = url;
        setModalState({
          ...modalState,
          buttons: newButtons,
        });

        break;
      }

      case 'effect': {
        const { index } = e.currentTarget.dataset;
        const newButtons = JSON.parse(JSON.stringify(buttons));

        newButtons[index].effect = e.currentTarget.value;
        setModalState({
          ...modalState,
          buttons: newButtons,
        });
        break;
      }

      case 'newButton': {
        const newButtons = JSON.parse(JSON.stringify(buttons));

        newButtons.push({
          effect: 'none',
          text: '',
          subText: '',
          icon: '',
          linkUrl: '',
        });

        setModalState({
          ...modalState,
          buttons: newButtons,
        });
        break;
      }

      case 'removeButton': {
        const { index } = e.currentTarget.dataset;
        const newButtons = JSON.parse(JSON.stringify(buttons));

        newButtons.splice(index, 1);

        setModalState({
          ...modalState,
          buttons: newButtons,
        });

        break;
      }

      // square board
      case 'block-text': {
        const { index } = e.currentTarget.dataset;
        const newBlocks = JSON.parse(JSON.stringify(modalState.blocks));

        newBlocks[index].text = e.currentTarget.value;

        setModalState({
          ...modalState,
          blocks: newBlocks,
        });

        break;
      }

      case 'linkUrl': {
        const { index } = e.currentTarget.dataset;
        const newBlocks = JSON.parse(JSON.stringify(modalState.blocks));

        newBlocks[index].linkUrl = e.currentTarget.value;

        setModalState({
          ...modalState,
          blocks: newBlocks,
        });

        break;
      }

      // video-player
      case 'videoUrl': {
        const videoUrl = e.currentTarget.value;

        setModalState({
          ...modalState,
          videoUrl,
        });

        break;
      }

      default:
        break;
    }
  }

  async function handleSave() {
    const docRef = doc(db, 'users', userId);
    let newBlocks = null;

    try {
      const updatedModalState = await handleUploadImage();

      

      setBlocks((prevState) => {
        const index = prevState.findIndex(
          (item) => item.id === updatedModalState.id
        );
        const newItems = [...prevState];
        newItems[index] = { ...updatedModalState };
        newBlocks = newItems;
        return newItems;
      });

      await updateDoc(docRef, {
        blocks: newBlocks,
      });
      setModalState({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  function handleClose() {
    setModalState(tempBlockData);
  }

  function handleImageChange(e) {
    const image = e.currentTarget.files[0];
    const { type, index } = e.currentTarget.dataset;

    const imageUrl = URL.createObjectURL(image);

    let newData = null;

    switch (type) {
      case 'buttons':
        newData = JSON.parse(JSON.stringify(buttons));
        newData[index].imageUrl = imageUrl;
        break;

      case 'blocks':
        newData = JSON.parse(JSON.stringify(modalState.blocks));
        newData[index].imageUrl = imageUrl;
        break;

      default:
        break;
    }
    

    setTempCroppedImage(null);

    setTempImageInfo({
      imageUrl,
      index,
    });

    setModalState({
      ...modalState,
      [type]: newData,
    });

    onCropModalOpen();
  }

  async function handleUploadImage() {
    const uploadImages = [];

    await Promise.all(
      buttons.map(async (button, index) => {
        if (button.imageUrl?.startsWith('blob')) {
          const imageBlob = await fetch(button.imageUrl).then((res) =>
            res.blob()
          );

          uploadImages.push({
            imageBlob,
            index,
          });
        }
      })
    );

    const newButtons = JSON.parse(JSON.stringify(buttons));

    await Promise.all(
      uploadImages.map(async (image) => {
        const metadata = {
          contentType: 'image/webp',
        };

        const storage = getStorage();
        const imageRef = ref(storage, `block-images/${Date.now()}`);

        const snapshot = await uploadBytes(imageRef, image.imageBlob, metadata);

        const imageUrl = await getDownloadURL(snapshot.ref);

        newButtons[image.index].imageUrl = imageUrl;
      })
    );

    return {
      ...modalState,
      buttons: newButtons,
    };
  }

  useEffect(() => {
    setModalState(tempBlockData);
  }, [tempBlockData]);

  useEffect(() => {
    if (tempCroppedImage) {
      setModalState((prevState) => {
        let type = null;
        let newData = null;

        switch (modalState.type) {
          case 'text-button': 
            type = 'buttons';
            newData = JSON.parse(JSON.stringify(prevState.buttons || []));

            newData[tempImageInfo.index].imageUrl = tempCroppedImage;
            break;
          

          case 'square-board':
            type = 'blocks';
            newData = JSON.parse(JSON.stringify(prevState.blocks || []));

            newData[tempImageInfo.index].imageUrl = tempCroppedImage;
            break;

          default:
            break;
        }
        

        return {
          ...prevState,
          [type]: newData,
        };
      });
    }
  }, [tempCroppedImage, tempImageInfo.index, modalState.type]);

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
          backgroundColor="gray.200"
          flexDirection="row"
        >
          <ModalHeader
            borderTopRadius="20px"
            backgroundColor="#000"
            color="#fff"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            left="0"
            right="0"
            py="1.25rem"
          >
            <Heading size="md">編輯區塊</Heading>
            <ModalCloseButton onClick={handleClose} position="static" />
          </ModalHeader>
          <ModalBody maxW="50%" mt="6rem">
            {tempBlockData.type === 'text-button' && (
              <Flex>
                <Box>
                  <Heading as="h3" size="md" mb="1rem">
                    按鈕樣式
                  </Heading>
                  <Wrap spacing="2rem" borderRadius="20px" mb="2rem">
                    <WrapItem
                      backgroundColor="gray.400"
                      borderRadius="20px"
                      p="0.5rem 0.75rem"
                    >
                      <HStack spacing="24px">
                        <Text fontWeight="500">按鈕填滿</Text>
                        <Switch
                          name="isSolid"
                          onChange={handleModalStateChange}
                          isChecked={isSolid}
                        />
                      </HStack>
                    </WrapItem>
                    <WrapItem
                      backgroundColor="gray.400"
                      borderRadius="20px"
                      p="0.5rem 0.75rem"
                    >
                      <HStack spacing="24px">
                        <Text fontWeight="500">按鈕圖片</Text>
                        <Switch
                          name="hasImage"
                          onChange={handleModalStateChange}
                          isChecked={hasImage}
                        />
                      </HStack>
                    </WrapItem>
                    <WrapItem
                      backgroundColor="gray.400"
                      borderRadius="20px"
                      p="0.5rem 0.75rem"
                    >
                      <HStack spacing="24px">
                        <Text fontWeight="500">按鈕副標</Text>
                        <Switch
                          name="hasSubtitle"
                          onChange={handleModalStateChange}
                          isChecked={hasSubtitle}
                        />
                      </HStack>
                    </WrapItem>
                  </Wrap>
                  <Heading as="h3" size="md" mb="1rem">
                    字體大小
                  </Heading>
                  <RadioGroup
                    borderRadius="20px"
                    mb="2rem"
                    name="fontSize"
                    value={fontSize}
                  >
                    <Stack
                      direction="row"
                      backgroundColor="gray.400"
                      borderRadius="20px"
                      p="0.5rem 0.75rem"
                    >
                      <Radio
                        onChange={handleModalStateChange}
                        value="sm"
                        mx="0.5rem"
                      >
                        小
                      </Radio>
                      <Radio
                        onChange={handleModalStateChange}
                        value="md"
                        mx="0.5rem"
                      >
                        中
                      </Radio>
                      <Radio
                        onChange={handleModalStateChange}
                        value="lg"
                        mx="0.5rem"
                      >
                        大
                      </Radio>
                      <Radio
                        onChange={handleModalStateChange}
                        value="xl"
                        mx="0.5rem"
                      >
                        特大
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  {buttons.map((button, index) => {
                    return (
                      <BlockInfoEditor
                        key={index}
                        buttons={buttons}
                        button={button}
                        index={index}
                        hasImage={hasImage}
                        hasSubtitle={hasSubtitle}
                        isSolid={isSolid}
                        fontSize={fontSize}
                        handleModalStateChange={handleModalStateChange}
                        handleImageChange={handleImageChange}
                        onCropModalOpen={onCropModalOpen}
                      />
                    );
                  })}

                  <Button
                    name="newButton"
                    onClick={handleModalStateChange}
                    isDisabled={buttons.length === 5}
                    w="100%"
                    borderRadius="lg"
                    bgColor="gray.700"
                    color="white"
                    _hover={{
                      bgColor: 'gray.600',
                    }}
                  >
                    新增按鈕
                  </Button>
                </Box>
              </Flex>
            )}
            {tempBlockData.type === 'banner-board' &&
              modalState.blocks?.map((block, index) => (
                <Card key={index} borderRadius="20px" mb="1rem">
                  <CardBody>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading as="h3" fontSize="1.25rem">
                        橫幅看板資訊
                      </Heading>
                      <IconButton
                        isDisabled={block.length === 1}
                        name="removeButton"
                        data-index={index}
                        onClick={handleModalStateChange}
                        icon={<Icon as={MdClose} />}
                        bgColor="gray.600"
                        color="white"
                        _hover={{
                          bgColor: 'gray.700',
                        }}
                      ></IconButton>
                    </Flex>
                    <Divider my="0.5rem" />
                    <Flex alignItems="center" mb="1rem">
                      {
                        <>
                          {block.imageUrl ? (
                            <Box position="relative">
                              <Image
                                maxW="80px"
                                mr="1rem"
                                rounded="xl"
                                objectFit="cover"
                                src={block.imageUrl}
                                alt="Dan Abramov"
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
                                data-type="blocks"
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
                                上傳圖片
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
                                isDisabled={!block.imageUrl}
                                flexGrow="1"
                                onClick={onCropModalOpen}
                              >
                                裁切圖片
                              </Button>
                            </Flex>
                          </Box>
                        </>
                      }
                    </Flex>
                    <Flex alignItems="center" mb="1rem">
                      <Icon as={MdTitle} mr="1rem" fontSize="xl" />
                      <Input
                        name="block-text"
                        data-index={index}
                        value={block.text}
                        onChange={handleModalStateChange}
                        backgroundColor="gray.400"
                        placeholder="按鈕文字"
                      />
                    </Flex>
                    <Flex alignItems="center" mb="1rem">
                      <Icon as={BsLink45Deg} mr="1rem" fontSize="xl" />
                      <Input
                        name="linkUrl"
                        data-index={index}
                        value={block.linkUrl}
                        onChange={handleModalStateChange}
                        backgroundColor="gray.400"
                        placeholder="輸入連結"
                      />
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            {tempBlockData.type === 'square-board' &&
              modalState.blocks?.map((block, index) => (
                <Card key={index} borderRadius="20px" mb="1rem">
                  <CardBody>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading as="h3" fontSize="1.25rem">
                        方格看板資訊
                      </Heading>
                      <IconButton
                        isDisabled={block.length === 1}
                        name="removeButton"
                        data-index={index}
                        onClick={handleModalStateChange}
                        icon={<Icon as={MdClose} />}
                        bgColor="gray.600"
                        color="white"
                        _hover={{
                          bgColor: 'gray.700',
                        }}
                      ></IconButton>
                    </Flex>
                    <Divider my="0.5rem" />
                    <Flex alignItems="center" mb="1rem">
                      {
                        <>
                          {block.imageUrl ? (
                            <Box position="relative">
                              <Image
                                maxW="80px"
                                mr="1rem"
                                rounded="xl"
                                objectFit="cover"
                                src={block.imageUrl}
                                alt="Dan Abramov"
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
                                data-type="blocks"
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
                                上傳圖片
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
                                isDisabled={!block.imageUrl}
                                flexGrow="1"
                                onClick={onCropModalOpen}
                              >
                                裁切圖片
                              </Button>
                            </Flex>
                          </Box>
                        </>
                      }
                    </Flex>
                    <Flex alignItems="center" mb="1rem">
                      <Icon as={MdTitle} mr="1rem" fontSize="xl" />
                      <Input
                        name="block-text"
                        data-index={index}
                        value={block.text}
                        onChange={handleModalStateChange}
                        backgroundColor="gray.400"
                        placeholder="按鈕文字"
                      />
                    </Flex>
                    <Flex alignItems="center" mb="1rem">
                      <Icon as={BsLink45Deg} mr="1rem" fontSize="xl" />
                      <Input
                        name="linkUrl"
                        data-index={index}
                        value={block.linkUrl}
                        onChange={handleModalStateChange}
                        backgroundColor="gray.400"
                        placeholder="輸入連結"
                      />
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            {tempBlockData.type === 'double-square-board' && (
              <Flex>
                <Heading>雙方格看板</Heading>
              </Flex>
            )}
            {tempBlockData.type === 'video-player' && (
              <Input
                name="videoUrl"
                value={modalState.videoUrl}
                onChange={handleModalStateChange}
                borderColor="gray"
                placeholder="輸入 youtube 網址"
              />
            )}
          </ModalBody>

          <ModalFooter
            flexDirection="column"
            justifyContent="space-between"
            flexGrow="1"
            maxW="50%"
            mt="6rem"
            pb="3rem"
          >
            <Container overflowY="auto" pb="3rem">
              <VStack
                spacing={4}
                flexGrow="1"
                align="stretch"
                textAlign="center"
              >
                <MultiTypeBlock
                  block={modalState}
                  themeColor={themeColor}
                  isAnimating={true}
                />
              </VStack>
            </Container>

            <Button
              onClick={handleSave}
              position="absolute"
              bottom="1rem"
              right="3rem"
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


function BlockInfoEditor({
  buttons,
  button,
  index,
  hasImage,
  hasSubtitle,
  isSolid,
  fontSize,
  handleModalStateChange,
  handleImageChange,
  onCropModalOpen,
}) {
  return (
    <Card borderRadius="20px" mb="1rem">
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="1.25rem">
            按鈕資訊
          </Heading>
          <IconButton
            isDisabled={buttons.length === 1}
            name="removeButton"
            data-index={index}
            onClick={handleModalStateChange}
            icon={<Icon as={MdClose} />}
            bgColor="gray.600"
            color="white"
            _hover={{
              bgColor: 'gray.700',
            }}
          ></IconButton>
        </Flex>
        <Divider my="0.5rem" />
        <Flex alignItems="center" mb="1rem">
          {hasImage ? (
            <>
              {button.imageUrl ? (
                <Box position="relative">
                  <Image
                    maxW="80px"
                    mr="1rem"
                    rounded="xl"
                    objectFit="cover"
                    src={button.imageUrl}
                    alt="Dan Abramov"
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
                    data-type="buttons"
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
                    上傳圖片
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
                    isDisabled={!button.imageUrl}
                    flexGrow="1"
                    onClick={onCropModalOpen}
                  >
                    裁切圖片
                  </Button>
                </Flex>
                <Input
                  data-index={index}
                  name="imageAlt"
                  onChange={handleModalStateChange}
                  value={button.imageAlt}
                  placeholder="(選填） 照片描述，有助於 SEO"
                />
              </Box>
            </>
          ) : (
            <>
              <Heading as="h5" fontSize="lg" mr={4}>
                選擇 Icon
              </Heading>
              <Popover isLazy>
                {({ isOpen, onClose }) => (
                  <>
                    <PopoverTrigger>
                      <IconButton icon={<Icon as={MdOutlineEmojiEmotions} />} />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        Icon 列表
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        {iconArray.map((icon, iconIndex) => {
                          return (
                            <IconButton
                              key={iconIndex}
                              bgColor="transparent"
                              fontSize="xl"
                              name="changeIcon"
                              data-index={index}
                              value={icon.name}
                              onClick={(e) => {
                                handleModalStateChange(e);
                                onClose();
                              }}
                              icon={<Icon as={iconMap[icon.name]} />}
                            />
                          );
                        })}
                      </PopoverBody>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            </>
          )}
        </Flex>
        <Flex alignItems="center" mb="1rem">
          <Icon as={MdTitle} mr="1rem" fontSize="xl" />
          <Input
            name="text"
            data-index={index}
            value={button.text}
            onChange={handleModalStateChange}
            backgroundColor="gray.400"
            placeholder="按鈕文字"
          />
        </Flex>
        {hasSubtitle && (
          <Flex alignItems="center" mb="1rem">
            <Icon as={IoInformation} fontSize="xl" mr="1rem" />
            <Input
              name="subText"
              data-index={index}
              value={button.subText}
              onChange={handleModalStateChange}
              backgroundColor="gray.400"
              placeholder="副標題：說明文字"
            />
          </Flex>
        )}
        <Flex alignItems="center" mb="1rem">
          <Icon as={BsLink45Deg} fontSize="xl" mr="1rem" />
          <Input
            name="url"
            data-index={index}
            backgroundColor="gray.400"
            placeholder="請輸入網址"
            onChange={handleModalStateChange}
            value={button.linkUrl}
          />
        </Flex>
        <Flex alignItems="center" mb="1rem">
          <Icon as={BiTimer} mr="1rem" fontSize="xl" />
          <Select
            name="effect"
            data-index={index}
            onChange={handleModalStateChange}
            value={button.effect}
            backgroundColor="gray.400"
          >
            <option value="none">無動態效果</option>
            <option value="wobble">搖晃</option>
            <option value="shakeX">震動</option>
            <option value="pulse">跳動</option>
          </Select>
        </Flex>
      </CardBody>
    </Card>
  );
}
