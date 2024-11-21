'use client'

import { useEffect, useState, useRef, Fragment } from 'react';
import Image from 'next/image';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable'

import MultiTypeBlock from '@/components/MultiTypeBlock';
import UserProfile from '@/components/UserProfile';
import BlockEditorModal from './BlockEditorModal';
import ProfileEditorModal from './ProfileEditorModal';

import { useRouter } from 'next/navigation';
import { useUser, useSetUser } from '@/stores/userStore';
import { getUserInfo, updateUserSections } from '@/services/userService';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { motion, AnimatePresence } from 'framer-motion';

import {
  MdContentCopy,
  MdCheck,
  MdDelete,
  MdDragIndicator,
  MdEdit,
  MdLogout
} from 'react-icons/md';

import { BsCopy } from 'react-icons/bs';

import { FiExternalLink } from 'react-icons/fi';


import { bgColorsMap } from '@/constants/utilityMaps';

import TextButtonIcon from '@/assets/icons/text-button.svg';
import BannerBoardIcon from '@/assets/icons/banner-board.svg';
import SquareBoardIcon from '@/assets/icons/square-board.svg';
import DoubleSquareBoardIcon from '@/assets/icons/double-square-board.svg';
import VideoPlayerIcon from '@/assets/icons/video-player.svg';


const blockMap = {
  'text-button': {
    name: '文字連結',
    description: '純粹的文字連結，也可以搭配 icon 或圖片',
    icon: TextButtonIcon,
  },
  'banner-board': {
    name: '橫幅看板',
    description: '2:1 黃金比例的看板',
    icon: BannerBoardIcon,
  },
  'square-board': {
    name: '方格看板',
    description: '1:1 跟格子一樣方正的看板',
    icon: SquareBoardIcon,
  },
  'double-square-board': {
    name: '雙方格看板',
    description: '一個方格不夠就來兩個',
    icon: DoubleSquareBoardIcon,
  },
  'video-player': {
    name: '影音播放器',
    description: '跟廣告牆有得比的影片播放器',
    icon: VideoPlayerIcon,
  },
};


const defaultSectionItems = [
  {
    id: 1,
    type: 'text-button',
    is_public: true,
    isSolid: false,
    hasSubtitle: false,
    fontSize: 'sm',
    buttons: [
      {
        effect: 'none',
        text: '輸入文字',
        subText: '',
        icon: 'instagram',
        linkUrl: '',
      },
    ],
  },
  {
    id: 2,
    type: 'banner-board',
    is_public: true,
    blocks: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1729710221382-ee37d2305ff1?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        text: '',
        linkUrl: '',
      },
    ],
  },
  {
    id: 3,
    type: 'square-board',
    is_public: true,
    blocks: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1729710221382-ee37d2305ff1?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        text: '',
        linkUrl: '',
      },
    ],
  },
  {
    id: 4,
    type: 'double-square-board',
    is_public: true,
    blocks: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1729710221382-ee37d2305ff1?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        text: '',
        linkUrl: '',
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1729710221382-ee37d2305ff1?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        text: '',
        linkUrl: '',
      },
    ],
  },
  {
    id: 5,
    type: 'video-player',
    is_public: true,
    videoUrl: 'https://www.youtube.com/watch?v=eDqfg_LexCQ',
    videoDescription: '',
  },
];


function DraggableItemPanel({ sectionNums }) {
  const [blockItems] = useState(defaultSectionItems);
  const MAX_SECTION_NUMS = 15;

  return (
    <VStack
      display={{
        base: 'none',
        lg: 'block',
      }}
      position="fixed"
      zIndex="999"
      top="10rem"
      left="5rem"
      bottom="3rem"
      bgColor="white"
      borderRadius="1.5rem"
      boxShadow="rgba(0, 0, 0, 0.04) 0px 5px 5px"
      p="2rem"
      w="300px"
      h="550px"
      gap="1rem"
    >
      <Text ml="0.75rem" mb="1rem">
        區塊數量：{MAX_SECTION_NUMS === sectionNums ? <Text display="inline-block" color="#E35D5D">{sectionNums} / {MAX_SECTION_NUMS}（已達上限）</Text> : `${sectionNums} / ${MAX_SECTION_NUMS}`}
      </Text>
      <SimpleGrid columns={2} spacing={4} position="relative">
        {blockItems.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
        {MAX_SECTION_NUMS === sectionNums && (
          <Box position="absolute" inset="0" bgColor="gray" opacity="0.5" borderRadius="2xl" />
        )}
      </SimpleGrid>
    </VStack>
  );
}

function DraggableItem({ item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Tooltip
        isDisabled={isDragging}
        hasArrow
        label={blockMap[item.type].description}
        placement="top"
        borderRadius="1.5rem"
        p="1rem 2rem"
      >
        <Flex
          bgColor="white"
          borderColor="gray.100"
          borderWidth="1px"
          borderStyle="solid"
          borderRadius="1.5rem"
          boxShadow="rgba(50, 50, 0, 0.05) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          w="100px"
          h="100px"
          p="0.5rem"
          fontSize="sm"
        >
          <Flex justifyContent="center" boxSize="40px">
            <Image src={blockMap[item.type].icon} alt={blockMap[item.type].name} width={40} height={40} />
          </Flex>
          {blockMap[item.type].name}
        </Flex>
      </Tooltip>
    </Box>
  );
}

function DragOverlayItem({ section, themeColor }) {
  return (
    <Box
      overflow="hidden"
      w="100%"
      bgColor="white"
      borderTopRadius="1rem"
      borderBottomRadius="xl"
    >
      <Flex
        bgColor="gray.200"
        borderTopRadius="1rem"
        justifyContent="space-between"
        p="0.5rem 1rem"
      >
        <HStack spacing={2}>
          <IconButton
            aria-label="Sort section"
            bgColor="transparent"
            cursor="grab"
            fontSize="1.25rem"
            icon={<Icon as={MdDragIndicator} />}
          />
          <Switch />
        </HStack>
        <HStack spacing={2}>
          <Tooltip label="複製" borderRadius="1.5rem">
            <IconButton
              aria-label="Copy section"
              bgColor="transparent"
              icon={<Icon as={BsCopy} />}
            />
          </Tooltip>
          <Tooltip label="刪除" borderRadius="1.5rem">
            <IconButton
              aria-label="Delete section"
              bgColor="transparent"
              fontSize="1.25rem"
              icon={<Icon as={MdDelete} />}
            />
          </Tooltip>
          <Button rightIcon={<Icon as={MdEdit} />}>編輯</Button>
        </HStack>
      </Flex>

      <MultiTypeBlock section={section} themeColor={themeColor} />
    </Box>
  );
}


function SortableSection({
  section,
  setSections,
  openEditSectionModal,
  setTempSection,
  themeColor,
  isTranslate,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
  });

  const user = useUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [action, setAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTransformStyle = () => {
    if (isTranslate) return 'translateY(20px)';

    return transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined;
  };

  const style = {
    transform: getTransformStyle(),
    transition: isTranslate ? 'transform .5s' : transition,
  };

  const handleEditSection = () => {
    setTempSection(section);
    openEditSectionModal();
  };

  const toggleSectionPublic = () => {
    let newSections = null;
    const currentSection = section;

    setSections((prevState) => {
      newSections = prevState.map((section) => {
        if (section.id === currentSection.id) {
          return {
            ...section,
            is_public: !section.is_public
          };
        }

        return section;
      });

      return newSections;
      
    });
    updateUserSections(user.uid, newSections);
  };

  const handleCopySection = async () => {
    let newSections = null;
    const currentSection = section;


    setSections((prevState) => {
      const newIndex =
          prevState.findIndex((section) => section.id === currentSection.id) + 1;

      newSections = [...prevState];
      newSections.splice(newIndex, 0, { ...currentSection, id: crypto.randomUUID() });

      return newSections;
    });
    updateUserSections(user.uid, newSections);

  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSection = async () => {
    let newSections = null;
    const currentSection = section;

    setIsDeleting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setSections((prevState) => {
      newSections = prevState.filter(
        (section) => section.id !== currentSection.id
      );

      return newSections;
    });
    updateUserSections(user.uid, newSections);

    setIsDeleting(false);
  };

  const confirmAction = async () => {
    setIsLoading(true);

    switch (action) {
      case 'delete':
        await handleDeleteSection();
        break;

      case 'copy':
        await handleCopySection();
        break;

      default:
        break;
    }

    setIsLoading(false);
    onClose();

  };

  return (
    <>
      <Box
        ref={setNodeRef}
        {...attributes}
        style={style}
        position="relative"
        overflow="hidden"
        w="100%"
        opacity={isDragging ? 0.5 : 1}
        bgColor="transparent"
        borderTopRadius="1rem"
        borderBottomRadius="xl"
      >
        <AnimatePresence>
          {section && !isDeleting && (
            <Box
              key={section.id}
              as={motion.div}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
              bgColor="white"
            >
              <Flex
                position="relative"
                zIndex="1"
                bgColor="gray.200"
                borderTopRadius="1rem"
                justifyContent="space-between"
                p="0.5rem 1rem"
              >
                <HStack spacing={2}>
                  <IconButton
                    {...listeners}
                    aria-label="Sort block"
                    bgColor="transparent"
                    cursor="grab"
                    fontSize="1.25rem"
                    icon={<Icon as={MdDragIndicator} />}
                  />
                  <Switch
                    isChecked={section.is_public}
                    onChange={toggleSectionPublic}
                  />
                </HStack>
                <HStack spacing={2}>
                  <Tooltip label="複製" borderRadius="1.5rem">
                    <IconButton
                      aria-label="Copy block"
                      bgColor="transparent"
                      icon={<Icon as={BsCopy} />}
                      onClick={() => {
                        setAction('copy');
                        onOpen();
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="刪除" borderRadius="1.5rem">
                    <IconButton
                      aria-label="Delete block"
                      bgColor="transparent"
                      fontSize="1.25rem"
                      icon={<Icon as={MdDelete} />}
                      onClick={() => {
                        setAction('delete');
                        onOpen();
                      }}
                    />
                  </Tooltip>
                  <Button
                    boxShadow="0 0 3px #aaa"
                    onClick={handleEditSection}
                    rightIcon={<Icon as={MdEdit} />}
                  >
                    編輯
                  </Button>
                </HStack>
              </Flex>
              <MultiTypeBlock section={section} themeColor={themeColor} />
              <Box
                hidden={section.is_public ? true : false}
                userSelect="none"
                cursor="default"
                position="absolute"
                inset={0}
                backgroundColor="black"
                opacity={0.7}
              ></Box>
            </Box>
          )}
        </AnimatePresence>
      </Box>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            {action === 'delete' ? '確認要刪除區塊嗎?' : '確認要複製區塊嗎?'}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              取消
            </Button>
            <Button
              onClick={confirmAction}
              isLoading={isLoading}
              colorScheme={action === 'delete' ? 'red' : 'blue'}
              ml={3}
            >
              確認
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function Dashboard() {
  const [profile, setProfile] = useState({});
  const [sections, setSections] = useState([]);
  const [slug, setSlug] = useState('');

  const user = useUser();
  const setUser = useSetUser();

  const [isUrlCopy, setIsUrlCopy] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/${slug}`
      );
      setIsUrlCopy(true);

      setTimeout(() => {
        setIsUrlCopy(false);
      }, 2000);
    } catch (error) {
      alert('複製失敗');
    }
  };

  const {
    isOpen: isEditProfileModalOpen,
    onOpen: openEditProfileModal,
    onClose: closeEditProfileModal,
  } = useDisclosure();

  const {
    isOpen: isEditSectionModalOpen,
    onOpen: openEditSectionModal,
    onClose: closeEditSectionModal,
  } = useDisclosure();
  const [tempSection, setTempSection] = useState({});

  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserInfo(user.uid);

        setProfile(userData.profile);
        setSlug(userData.slug);
        setSections(userData.sections);
      } catch (error) {
        alert(error);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          uid: currentUser.uid,
        });
        loadUser();
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [setUser, user.uid, router]);

  const [activeDragSectionId, setActiveDragSectionId] = useState(null);
  const [hoverSectionIndex, setHoverSectionIndex] = useState(null);
  const [isFromSectionItems, setIsFromSectionItems] = useState(false);

  const handleDragStart = (event) => {
    const isDragFromBlockItems = defaultSectionItems.some(
      (item) => event.active.id === item.id
    );

    setIsFromSectionItems(isDragFromBlockItems);
    setActiveDragSectionId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) {
      setHoverSectionIndex(null);
      setActiveDragSectionId(null);
      return;
    }

    if (isFromSectionItems) {
      const overIndex = sections.findIndex((item) => item.id === over.id);
      setHoverSectionIndex(overIndex);

      let activeItem = [...defaultSectionItems, ...sections].find(
        (item) => item.id === active.id
      );
      activeItem = { ...activeItem };
      activeItem.id = crypto.randomUUID();
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveDragSectionId(null);
      setHoverSectionIndex(null);
      return;
    }

    let activeItem = [...defaultSectionItems, ...sections].find(
      (item) => item.id === active.id
    );
    activeItem = { ...activeItem };
    activeItem.id = crypto.randomUUID();

    if (active.id === over.id) return;

    if (isFromSectionItems) {
      const overIndex = sections.findIndex((item) => item.id === over.id);
      const newSections = [...sections];
      if (overIndex === -1) {
        return [...sections, activeItem];
      }
      newSections.splice(overIndex, 0, activeItem);

      setSections(newSections);
      updateUserSections(user.uid, newSections);
    } else {
      const oldIndex = sections.findIndex((item) => item.id === active.id);
      const newIndex = sections.findIndex((item) => item.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);

      setSections(newSections);
      updateUserSections(user.uid, newSections);
    }

    setHoverSectionIndex(null);
  };

  return (
    <Box bgColor={bgColorsMap[profile.bgColor]}>
      <Box
        as="header"
        w="100%"
        position="fixed"
        zIndex="100"
        top="0"
        bgColor="white"
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
      >
        <Flex
          justify="space-between"
          align="center"
          mx={{ base: '0.5rem', md: '4rem' }}
        >
          <Text
            userSelect="none"
            p="0.75rem"
            fontSize="1.75rem"
            fontWeight="bold"
            textDecoration="none !important"
            letterSpacing="0.05em"
          >
            Linkspace
          </Text>
          <Menu isLazy>
            <MenuButton>
              <Avatar
                my="0.75rem"
                borderRadius="0.75rem"
                src={profile.avatar}
              />
            </MenuButton>
            <MenuList p="1rem">
              <Text fontWeight="bold">{profile.name}</Text>
              <Text fontSize="sm" mb="0.75rem">
                {profile.email}
              </Text>
              <Divider />
              <MenuItem borderRadius="0.75rem" mt="0.75rem" p="0">
                <Button
                  bgColor="white"
                  w="100%"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={MdLogout} />}
                  onClick={handleLogout}
                >
                  登出
                </Button>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Box
        ml={{
          base: 0,
          lg: '20rem',
        }}
      >
        <Container maxW="lg" pt="10rem" pb="5rem">
          <Flex justifyContent="space-between">
            <DndContext
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <DraggableItemPanel sectionNums={sections.length} />
              <VStack w="100%" spacing={8}>
                {Object.keys(profile).length && (
                  <>
                    <InputGroup
                      bgColor="white"
                      borderColor="gray.50"
                      borderRadius="1.5rem"
                      focusBorderColor="gray.50"
                      boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                      alignItems="center"
                      p="0.5rem 1rem"
                      w="100%"
                    >
                      <Input
                        isReadOnly
                        border="0"
                        size="lg"
                        value={`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/${slug}`}
                      />
                      <Tooltip label="複製網址" borderRadius="1.5rem">
                        <IconButton
                          aria-label="Copy website URL"
                          colorScheme="teal"
                          variant="outline"
                          onClick={handleCopyUrl}
                          icon={
                            <Icon as={isUrlCopy ? MdCheck : MdContentCopy} />
                          }
                          _hover={{
                            background: 'white',
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="開啟頁面" borderRadius="1.5rem">
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/${slug}`}
                          isExternal
                          aria-label="Go to the website"
                          colorScheme="teal"
                          border="1px"
                          borderRadius="md"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          minW="2.5rem"
                          minH="2.5rem"
                          ml="0.5rem"
                        >
                          <Icon as={FiExternalLink} />
                        </Link>
                      </Tooltip>
                    </InputGroup>
                    <UserProfile profile={profile} slug={slug}>
                      <Button onClick={openEditProfileModal}>
                        編輯個人檔案
                      </Button>
                    </UserProfile>
                  </>
                )}
                <SortableContext
                  items={sections}
                >
                  {sections &&
                    sections.map((section, index) => {
                      const isShowPlaceholder = hoverSectionIndex === index;
                      return (
                        <Fragment key={section.id}>
                          <Box
                            display={isShowPlaceholder ? 'block' : 'none'}
                            overflow="hidden"
                            w="100%"
                            h={'160px'}
                            opacity={isShowPlaceholder ? '1' : '0'}
                            bgColor="gray"
                            borderTopRadius="1rem"
                            borderBottomRadius="xl"
                            transition="opacity .5s"
                          />
                          <SortableSection
                            section={section}
                            setSections={setSections}
                            openEditSectionModal={openEditSectionModal}
                            setTempSection={setTempSection}
                            themeColor={profile.themeColor}
                            isTranslate={index >= parseInt(hoverSectionIndex)}
                          />
                        </Fragment>
                      );
                    })}
                </SortableContext>
              </VStack>
              
              <DragOverlay>
                {!isFromSectionItems && activeDragSectionId ? (
                  <DragOverlayItem
                    section={sections.find(
                      (section) => section.id === activeDragSectionId
                    )}
                    themeColor={profile.themeColor}
                  />) : null}
              </DragOverlay>
            </DndContext>
          </Flex>
        </Container>
      </Box>
      <BlockEditorModal
        isOpen={isEditSectionModalOpen}
        onClose={closeEditSectionModal}
        setSections={setSections}
        tempSection={tempSection}
        themeColor={profile.themeColor}
      />

      <ProfileEditorModal
        isOpen={isEditProfileModalOpen}
        onClose={closeEditProfileModal}
        profile={profile}
        setProfile={setProfile}
        themeColor={profile.themeColor}
      />
    </Box>
  );
}
