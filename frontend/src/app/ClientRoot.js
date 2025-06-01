"use client";
import { ChakraProvider } from "@chakra-ui/react";

export default function ClientRoot({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
