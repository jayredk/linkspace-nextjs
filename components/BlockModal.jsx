import {
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';


export default function BlockModal({
  isOpen,
  onClose,
  title,
  leftColumn,
  rightColumn,
  handleSave,
  handleClose,
}) {
  return (
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
          alignItems="center"
          position="absolute"
          left="0"
          right="0"
          mb="1.5rem"
        >
          <Heading size="lg">{title}</Heading>
          <ModalCloseButton onClick={handleClose} color="#fff" />
        </ModalHeader>
        <ModalBody maxW="50%" mt="6rem">
          {leftColumn}
        </ModalBody>

        <ModalFooter
          flexDirection="column"
          justifyContent="space-between"
          flexGrow="1"
          maxW="50%"
          mt="6rem"
        >
          <Container>{rightColumn}</Container>

          <Button onClick={handleSave} alignSelf="flex-end" colorScheme="blue">
            儲存
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
