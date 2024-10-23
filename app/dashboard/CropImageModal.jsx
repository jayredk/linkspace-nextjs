import { useState } from 'react';
import Cropper from 'react-easy-crop';

import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
} from '@chakra-ui/react';

import getCroppedImg from '../../utils/cropImage';



export default function CropImageModal({
  isOpen,
  onOpen,
  onClose,
  tempImageInfo,
  setTempCroppedImage,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  async function handleCropImage() {
    try {
      const croppedImage = await getCroppedImg(
        tempImageInfo.imageUrl,
        croppedAreaPixels,
        rotation
      );

      setTempCroppedImage(croppedImage);

      setRotation(0);
      setZoom(1);
      
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  const labelStyles = {
    mt: '4',
    ml: '-1.5',
    fontSize: 'sm',
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent maxW="600px" rounded="3xl">
        <Flex alignItems="center" px="1.5rem" py="1rem">
          <ModalHeader flex="1" p="0">
            裁切圖片
          </ModalHeader>
          <ModalCloseButton position="static" />
        </Flex>

        <ModalBody
          px="1.5rem"
          py="0"
          sx={{
            '.reactEasyCrop_Container': {
              backdropFilter: 'brightness(0.3)',
            },
            '.reactEasyCrop_CropArea': {
              boxShadow: 'none',
            },
          }}
        >
          <Box position="relative" h="300px" mb="1rem">
            <Cropper
              image={tempImageInfo.imageUrl}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>

          <Flex gap="1.5rem" pb="1rem">
            <Text flexShrink="0">縮放</Text>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(zoom) => setZoom(zoom)}
            >
              <SliderMark value={1} {...labelStyles}>
                1x
              </SliderMark>
              <SliderMark value={2} {...labelStyles}>
                2x
              </SliderMark>
              <SliderMark value={3} {...labelStyles}>
                3x
              </SliderMark>
              <SliderTrack bgColor="gray.400">
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>

          <Flex gap="1.5rem" py="1rem">
            <Text flexShrink="0">旋轉</Text>
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(rotation) => setRotation(rotation)}
            >
              <SliderTrack bgColor="gray.400">
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCropImage}>
            確認裁切
          </Button>
          <Button variant="ghost" onClick={onClose}>
            略過
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
