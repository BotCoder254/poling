import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  IconButton,
  HStack,
  useColorModeValue,
  Text,
  Textarea,
  Switch,
  FormHelperText,
  Select,
  Collapse,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, TimeIcon } from '@chakra-ui/icons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export default function PollCreate() {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [pollType, setPollType] = useState('single'); // single or multiple
  const toast = useToast();
  const { currentUser } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.700');

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    } else {
      toast({
        title: 'Maximum options reached',
        description: 'You can only add up to 10 options',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    if (!question.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a question',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (options.some(option => !option.trim())) {
      toast({
        title: 'Error',
        description: 'Please fill in all options',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (hasDeadline && !deadline) {
      toast({
        title: 'Error',
        description: 'Please set a deadline for the poll',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'polls'), {
        question,
        description,
        options: options.map(option => ({ text: option, votes: 0 })),
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        pollType,
        deadline: hasDeadline ? new Date(deadline).toISOString() : null,
        totalVotes: 0,
        isActive: true,
      });

      toast({
        title: 'Success',
        description: 'Poll created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setQuestion('');
      setDescription('');
      setOptions(['', '']);
      setHasDeadline(false);
      setDeadline('');
      setPollType('single');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create poll: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Box
      p={8}
      maxWidth="800px"
      mx="auto"
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Question</FormLabel>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
              size="lg"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context to your question (optional)"
              size="md"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Poll Type</FormLabel>
            <Select
              value={pollType}
              onChange={(e) => setPollType(e.target.value)}
            >
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
            </Select>
            <FormHelperText>
              Choose whether voters can select one or multiple options
            </FormHelperText>
          </FormControl>

          <FormControl>
            <HStack justify="space-between">
              <FormLabel mb="0">Set Deadline</FormLabel>
              <Switch
                isChecked={hasDeadline}
                onChange={(e) => setHasDeadline(e.target.checked)}
              />
            </HStack>
          </FormControl>

          <Collapse in={hasDeadline} animateOpacity>
            <FormControl isRequired={hasDeadline}>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <FormHelperText>
                <TimeIcon mr={2} />
                Poll will automatically close at this time
              </FormHelperText>
            </FormControl>
          </Collapse>

          <Box width="100%">
            <Text mb={4} fontWeight="bold">
              Options
            </Text>
            <VStack spacing={3} align="stretch">
              {options.map((option, index) => (
                <FormControl key={index} isRequired>
                  <HStack>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => handleRemoveOption(index)}
                        colorScheme="red"
                        variant="ghost"
                      />
                    )}
                  </HStack>
                </FormControl>
              ))}
            </VStack>
          </Box>

          <Button
            leftIcon={<AddIcon />}
            onClick={handleAddOption}
            variant="ghost"
            w="full"
            isDisabled={options.length >= 10}
          >
            Add Option
          </Button>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            You can add up to 10 options for your poll
          </Alert>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            isLoading={isSubmitting}
          >
            Create Poll
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
