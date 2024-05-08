import { Box, Container, useInterval, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const gridSize = 100; // 100x100 grid for 1m x 1m area
const initialWormPosition = { x: 50, y: 50 }; // Start in the middle of the grid
const experienceInterval = 30000; // 30 seconds

const Index = () => {
  const [worm, setWorm] = useState([initialWormPosition]);
  const [experience, setExperience] = useState(null);
  const toast = useToast();

  // Randomly place experience on the grid
  const placeExperience = () => {
    const newExperience = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    setExperience(newExperience);
  };

  // Check if the worm eats the experience
  const checkExperienceConsumption = () => {
    const head = worm[0];
    if (experience && head.x === experience.x && head.y === experience.y) {
      setWorm([...worm, {}]); // Add new segment to worm
      placeExperience(); // Replace the experience
      toast({
        title: "Experience gained!",
        description: "Your worm has grown!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Handle worm movement
  const moveWorm = (direction) => {
    let newHead = { ...worm[0] };

    switch (direction) {
      case "ArrowUp":
        newHead.y -= 1;
        break;
      case "ArrowDown":
        newHead.y += 1;
        break;
      case "ArrowLeft":
        newHead.x -= 1;
        break;
      case "ArrowRight":
        newHead.x += 1;
        break;
      default:
        return;
    }

    if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
      toast({
        title: "Game Over",
        description: "The worm hit the wall!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setWorm([initialWormPosition]); // Reset worm
    } else {
      setWorm([newHead, ...worm.slice(0, worm.length - 1)]);
      checkExperienceConsumption();
    }
  };

  // Setup keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      moveWorm(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [worm]);

  // Place initial experience
  useEffect(() => {
    placeExperience();
  }, []);

  // Setup interval for placing experience
  useInterval(() => {
    placeExperience();
  }, experienceInterval);

  return (
    <Container maxW="container.md" height="100vh" centerContent>
      <Box width="100vw" height="100vh" bg="gray.200" position="relative">
        {worm.map((segment, index) => (
          <Box key={index} position="absolute" left={`${segment.x}%`} top={`${segment.y}%`} width="1%" height="1%" bg="green.500" />
        ))}
        {experience && <Box position="absolute" left={`${experience.x}%`} top={`${experience.y}%`} width="1%" height="1%" bg="red.500" />}
      </Box>
    </Container>
  );
};

export default Index;
