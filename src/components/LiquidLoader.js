import React from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const liquidAnimation = keyframes`
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
`;

const waveAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20%);
  }
  100% {
    transform: translateY(0);
  }
`;

const LiquidLoader = ({ size = "100px", color = "blue.500" }) => {
  return (
    <Box
      position="relative"
      width={size}
      height={size}
      margin="auto"
      sx={{
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid #e2e8f0',
          boxSizing: 'border-box',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '50%',
          left: '50%',
          backgroundColor: color,
          borderRadius: '40%',
          animation: `${liquidAnimation} 2s linear infinite`,
        }
      }}
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="80%"
        height="80%"
        borderRadius="50%"
        backgroundColor="white"
        zIndex={1}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="60%"
        height="60%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={2}
      >
        <Box
          width="4px"
          height="40%"
          backgroundColor={color}
          borderRadius="full"
          animation={`${waveAnimation} 1.5s ease-in-out infinite`}
          mx="2px"
        />
        <Box
          width="4px"
          height="40%"
          backgroundColor={color}
          borderRadius="full"
          animation={`${waveAnimation} 1.5s ease-in-out infinite`}
          animationDelay="0.2s"
          mx="2px"
        />
        <Box
          width="4px"
          height="40%"
          backgroundColor={color}
          borderRadius="full"
          animation={`${waveAnimation} 1.5s ease-in-out infinite`}
          animationDelay="0.4s"
          mx="2px"
        />
      </Box>
    </Box>
  );
};

export default LiquidLoader;
