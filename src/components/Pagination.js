import React from 'react';
import {
  HStack,
  Button,
  Text,
  Select,
  useColorModeValue,
  IconButton,
  Tooltip,
  Box,
  Flex,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverColor = useColorModeValue('gray.100', 'gray.700');

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
  };

  return (
    <Box
      w="100%"
      py={4}
      px={6}
      borderRadius="lg"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        gap={4}
      >
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.600">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{' '}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
          </Text>
          <Select
            size="sm"
            value={pageSize}
            onChange={handlePageSizeChange}
            w="auto"
            ml={4}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </Select>
        </HStack>

        <HStack spacing={2}>
          <Tooltip label="First Page">
            <IconButton
              icon={<FiChevronsLeft />}
              onClick={() => onPageChange(1)}
              isDisabled={currentPage === 1}
              variant="ghost"
              size="sm"
              aria-label="First Page"
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              icon={<FiChevronLeft />}
              onClick={() => onPageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              variant="ghost"
              size="sm"
              aria-label="Previous Page"
            />
          </Tooltip>

          <HStack spacing={1}>
            {getPageNumbers().map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === '...' ? (
                  <Text px={2} color="gray.500">
                    ...
                  </Text>
                ) : (
                  <Button
                    size="sm"
                    variant={currentPage === pageNum ? 'solid' : 'ghost'}
                    colorScheme={currentPage === pageNum ? 'blue' : 'gray'}
                    onClick={() => onPageChange(pageNum)}
                    _hover={{
                      bg: currentPage === pageNum ? undefined : hoverColor,
                    }}
                  >
                    {pageNum}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </HStack>

          <Tooltip label="Next Page">
            <IconButton
              icon={<FiChevronRight />}
              onClick={() => onPageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              variant="ghost"
              size="sm"
              aria-label="Next Page"
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              icon={<FiChevronsRight />}
              onClick={() => onPageChange(totalPages)}
              isDisabled={currentPage === totalPages}
              variant="ghost"
              size="sm"
              aria-label="Last Page"
            />
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Pagination;
