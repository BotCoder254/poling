import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
  useToast,
  Textarea,
  Switch,
  FormHelperText,
  Box,
  Image,
  SimpleGrid,
  Select,
  useColorModeValue,
  Divider,
  Wrap,
  WrapItem,
  Badge,
  Tooltip,
  Progress,
} from '@chakra-ui/react';
import { FiPlus, FiTrash, FiImage, FiX, FiUpload } from 'react-icons/fi';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const CreatePollModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isExpirable, setIsExpirable] = useState(false);
  const [expiryDays, setExpiryDays] = useState('7');
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [theme, setTheme] = useState('default');
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const [maxVotesPerUser, setMaxVotesPerUser] = useState(1);
  const fileInputRef = useRef();
  const { currentUser } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleMediaSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 5MB`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} must be an image file (JPEG, PNG, or GIF)`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      return true;
    });

    // Limit to maximum 5 images
    if (mediaFiles.length + validFiles.length > 5) {
      toast({
        title: 'Too many images',
        description: 'You can only upload up to 5 images',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newMediaFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handleRemoveMedia = (index) => {
    const newMediaFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(newMediaFiles);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setOptions(['', '']);
    setIsExpirable(false);
    setExpiryDays('7');
    setMediaFiles([]);
    setTheme('default');
    setIsPrivate(false);
    setAllowComments(true);
    setMultipleChoice(false);
    setRequireLogin(false);
    setMaxVotesPerUser(1);
    setUploadProgress(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const uploadImages = async () => {
    const uploadPromises = mediaFiles.map(async (mediaFile) => {
      const fileExtension = mediaFile.file.name.split('.').pop();
      const fileName = `polls/${currentUser.uid}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const fileRef = ref(storage, fileName);

      await uploadBytes(fileRef, mediaFile.file);
      const downloadUrl = await getDownloadURL(fileRef);
      return downloadUrl;
    });

    const totalFiles = mediaFiles.length;
    let completedFiles = 0;

    const urls = await Promise.all(
      uploadPromises.map(promise =>
        promise.then(url => {
          completedFiles++;
          setUploadProgress((completedFiles / totalFiles) * 100);
          return url;
        })
      )
    );

    return urls;
  };

  const handleCreatePoll = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your poll.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (options.some(opt => !opt.trim())) {
      toast({
        title: 'Invalid options',
        description: 'Please fill in all option fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      let mediaUrls = [];
      if (mediaFiles.length > 0) {
        mediaUrls = await uploadImages();
      }

      const pollData = {
        title: title.trim(),
        description: description.trim(),
        options: options.map(opt => ({
          text: opt.trim(),
          votes: 0
        })),
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        status: 'active',
        voters: [],
        theme,
        isPrivate,
        allowComments,
        multipleChoice,
        requireLogin,
        maxVotesPerUser: parseInt(maxVotesPerUser),
        mediaUrls,
        settings: {
          theme,
          isPrivate,
          allowComments,
          multipleChoice,
          requireLogin,
          maxVotesPerUser: parseInt(maxVotesPerUser)
        }
      };

      if (isExpirable) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));
        pollData.expiresAt = serverTimestamp();
      }

      await addDoc(collection(db, 'polls'), pollData);

      toast({
        title: 'Success',
        description: 'Poll created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      handleClose();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to create poll. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Poll</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="What would you like to ask?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Add more details about your poll (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Options</FormLabel>
              <VStack spacing={3} align="stretch">
                {options.map((option, index) => (
                  <HStack key={index}>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    {options.length > 2 && (
                      <IconButton
                        icon={<FiTrash />}
                        onClick={() => handleRemoveOption(index)}
                        aria-label="Remove option"
                        variant="ghost"
                        colorScheme="red"
                      />
                    )}
                  </HStack>
                ))}
                {options.length < 6 && (
                  <Button
                    leftIcon={<FiPlus />}
                    onClick={handleAddOption}
                    size="sm"
                    variant="outline"
                  >
                    Add Option
                  </Button>
                )}
              </VStack>
            </FormControl>

            <Divider />

            <FormControl>
              <FormLabel>Images</FormLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaSelect}
                style={{ display: 'none' }}
                ref={fileInputRef}
                multiple
              />
              
              {mediaFiles.length < 5 && (
                <Button
                  leftIcon={<FiImage />}
                  onClick={() => fileInputRef.current?.click()}
                  width="100%"
                  height="100px"
                  variant="outline"
                  mb={4}
                >
                  Upload Images (Max 5)
                </Button>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress value={uploadProgress} size="sm" colorScheme="blue" mb={4} />
              )}

              {mediaFiles.length > 0 && (
                <SimpleGrid columns={[2, 3]} spacing={4} mb={4}>
                  {mediaFiles.map((media, index) => (
                    <Box key={index} position="relative">
                      <Image
                        src={media.preview}
                        alt={`Preview ${index + 1}`}
                        borderRadius="md"
                        objectFit="cover"
                        w="100%"
                        h="100px"
                      />
                      <IconButton
                        icon={<FiX />}
                        position="absolute"
                        top={1}
                        right={1}
                        size="sm"
                        onClick={() => handleRemoveMedia(index)}
                        aria-label="Remove image"
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </FormControl>

            <Divider />

            <FormControl>
              <FormLabel>Theme</FormLabel>
              <Select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="colorful">Colorful</option>
              </Select>
            </FormControl>

            <SimpleGrid columns={2} spacing={4} width="100%">
              <FormControl>
                <FormLabel>Privacy</FormLabel>
                <Switch
                  isChecked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <FormHelperText>
                  Make poll private (link only)
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Comments</FormLabel>
                <Switch
                  isChecked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                />
                <FormHelperText>
                  Allow comments on poll
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Multiple Choice</FormLabel>
                <Switch
                  isChecked={multipleChoice}
                  onChange={(e) => setMultipleChoice(e.target.checked)}
                />
                <FormHelperText>
                  Allow multiple selections
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Require Login</FormLabel>
                <Switch
                  isChecked={requireLogin}
                  onChange={(e) => setRequireLogin(e.target.checked)}
                />
                <FormHelperText>
                  Only logged-in users can vote
                </FormHelperText>
              </FormControl>
            </SimpleGrid>

            {multipleChoice && (
              <FormControl>
                <FormLabel>Max Votes Per User</FormLabel>
                <Input
                  type="number"
                  value={maxVotesPerUser}
                  onChange={(e) => setMaxVotesPerUser(e.target.value)}
                  min="1"
                  max={options.length}
                  width="100px"
                />
                <FormHelperText>
                  Maximum number of options a user can select
                </FormHelperText>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Poll Expiry</FormLabel>
              <HStack>
                <Switch
                  isChecked={isExpirable}
                  onChange={(e) => setIsExpirable(e.target.checked)}
                />
                <Text>Set expiry date</Text>
              </HStack>
              {isExpirable && (
                <Box mt={2}>
                  <Input
                    type="number"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    min="1"
                    max="30"
                    width="100px"
                  />
                  <FormHelperText>
                    Poll will expire after {expiryDays} days
                  </FormHelperText>
                </Box>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleCreatePoll}
            isLoading={isLoading}
            loadingText="Creating..."
          >
            Create Poll
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePollModal;
