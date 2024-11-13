'use client'

import { useEffect, useState, Fragment } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable'

import MultiTypeBlock from '@/components/MultiTypeBlock';
import UserProfile from '@/components/UserProfile';
import BlockEditorModal from './BlockEditorModal';
import ProfileEditorModal from './ProfileEditorModal';

import { useRouter } from 'next/navigation';
import { useUser, useSetUser } from '@/stores/userStore';
import { getUserInfo, updateUserBlocks } from '@/services/userService';

import {
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
  VStack
} from '@chakra-ui/react';

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

const blockNameMap = {
  'text-button': '文字按鈕',
  'banner-board': '橫幅看板',
  'square-board': '方格看板',
  'double-square-board': '雙方格看板',
  'video-player': '影音播放器',
};

const defaultBlockItems = [
  {
    id: 1,
    type: 'text-button',
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
    videoUrl: 'https://www.youtube.com/watch?v=eDqfg_LexCQ',
    videoDescription: '',
  },
];



function DraggableItemPanel({ blcokNums }) {
  const [blockItems] = useState(defaultBlockItems);

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
      gap="1rem"
    >
      <Text alignSelf="flex-start" ml="0.75rem" mb="1rem">
        區塊數量 {blcokNums} / 8
      </Text>
      <SimpleGrid columns={2} spacing={4}>
        {blockItems.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
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
        label="純文字按鈕，可一次收整多連結"
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
          justifyContent="center"
          alignItems="center"
          w="100px"
          h="100px"
          p="1rem"
        >
          {blockNameMap[item.type]}
        </Flex>
      </Tooltip>
    </Box>
  );
}

function DragOverlayItem({ block, themeColor }) {
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
            aria-label="Sort block"
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
              aria-label="Copy block"
              bgColor="transparent"
              icon={<Icon as={BsCopy} />}
            />
          </Tooltip>
          <Tooltip label="刪除" borderRadius="1.5rem">
            <IconButton
              aria-label="Delete block"
              bgColor="transparent"
              fontSize="1.25rem"
              icon={<Icon as={MdDelete} />}
            />
          </Tooltip>
          <Button rightIcon={<Icon as={MdEdit} />}>編輯</Button>
        </HStack>
      </Flex>

      <MultiTypeBlock block={block} themeColor={themeColor} />
    </Box>
  );
}


function SortableBlock({
  block,
  openEditBlockModal,
  setTempBlockData,
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
    id: block.id,
  });

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

  const handleEditBlock = () => {
    setTempBlockData(block);
    openEditBlockModal();
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      style={style}
      overflow="hidden"
      w="100%"
      opacity={isDragging ? 0.5 : 1}
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
            {...listeners}
            aria-label="Sort block"
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
              aria-label="Copy block"
              bgColor="transparent"
              icon={<Icon as={BsCopy} />}
            />
          </Tooltip>
          <Tooltip label="刪除" borderRadius="1.5rem">
            <IconButton
              aria-label="Delete block"
              bgColor="transparent"
              fontSize="1.25rem"
              icon={<Icon as={MdDelete} />}
            />
          </Tooltip>
          <Button onClick={handleEditBlock} rightIcon={<Icon as={MdEdit} />}>
            編輯
          </Button>
        </HStack>
      </Flex>

      <MultiTypeBlock block={block} themeColor={themeColor} />
    </Box>
  );
}


export default function Dashboard() {
  const [profile, setProfile] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [slug, setSlug] = useState('');

  const user = useUser();
  const setUser = useSetUser();

  const [isUrlCopy, setIsUrlCopy] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profile.siteUrl);
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
    isOpen: isEditBlockModalOpen,
    onOpen: openEditBlockModal,
    onClose: closeEditBlockModal,
  } = useDisclosure();
  const [tempBlockData, setTempBlockData] = useState({});

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
        setBlocks(userData.blocks);
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



  const [activeDragBlockId, setActiveDragBlockId] = useState(null);
  const [hoverBlockIndex, setHoverBlockIndex] = useState(null);
  const [isFromBlockItems, setIsFromBlockItems] = useState(false);

  const handleDragStart = (event) => {
    const isDragFromBlockItems = defaultBlockItems.some(
      (item) => event.active.id === item.id
    );

    setIsFromBlockItems(isDragFromBlockItems);
    setActiveDragBlockId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) {
      setHoverBlockIndex(null);
      setActiveDragBlockId(null);
      return;
    }

    if (isFromBlockItems) {
      const overIndex = blocks.findIndex((item) => item.id === over.id);
      setHoverBlockIndex(overIndex);

      let activeItem = [...defaultBlockItems, ...blocks].find(
        (item) => item.id === active.id
      );
      activeItem = { ...activeItem };
      activeItem.id = crypto.randomUUID();
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveDragBlockId(null);
      setHoverBlockIndex(null);
      return;
    }

    let activeItem = [...defaultBlockItems, ...blocks].find(
      (item) => item.id === active.id
    );
    activeItem = { ...activeItem };
    activeItem.id = crypto.randomUUID();

    if (active.id === over.id) return;

    if (isFromBlockItems) {
      const overIndex = blocks.findIndex((item) => item.id === over.id);
      const newBlocks = [...blocks];
      if (overIndex === -1) {
        return [...blocks, activeItem];
      }
      newBlocks.splice(overIndex, 0, activeItem);

      setBlocks(newBlocks);
      updateUserBlocks(user.uid, newBlocks);
    } else {
      const oldIndex = blocks.findIndex((item) => item.id === active.id);
      const newIndex = blocks.findIndex((item) => item.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);

      setBlocks(newBlocks);
      updateUserBlocks(user.uid, newBlocks);
    }

    setHoverBlockIndex(null);
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
          <Link
            href="/dashboard"
            p="0.75rem"
            fontSize="1.75rem"
            fontWeight="bold"
            textDecoration="none !important"
            letterSpacing="0.05em"
          >
            Linkspace
          </Link>
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
              <DraggableItemPanel blcokNums={blocks.length} />
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
                    <UserProfile profile={profile}>
                      <Button onClick={openEditProfileModal}>
                        編輯個人檔案
                      </Button>
                    </UserProfile>
                  </>
                )}

                <SortableContext
                  items={blocks}
                  strategy={verticalListSortingStrategy}
                >
                  {blocks &&
                    blocks.map((block, index) => {
                      const isShowPlaceholder = hoverBlockIndex === index;

                      return (
                        <Fragment key={block.id}>
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
                          <SortableBlock
                            block={block}
                            openEditBlockModal={openEditBlockModal}
                            setTempBlockData={setTempBlockData}
                            themeColor={profile.themeColor}
                            isTranslate={index >= parseInt(hoverBlockIndex)}
                          />
                        </Fragment>
                      );
                    })}
                </SortableContext>
              </VStack>

              <DragOverlay>
                {!isFromBlockItems ? (
                  <DragOverlayItem
                    block={blocks.find(
                      (block) => block.id === activeDragBlockId
                    )}
                    themeColor={profile.themeColor}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </Flex>
        </Container>
      </Box>
      <BlockEditorModal
        isOpen={isEditBlockModalOpen}
        onClose={closeEditBlockModal}
        setBlocks={setBlocks}
        tempBlockData={tempBlockData}
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
