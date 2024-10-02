import React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from '../../lib/utils'; // Move up two directories to reach src

const Tabs = RadixTabs.Root;
const TabsList = RadixTabs.List;
const TabsTrigger = RadixTabs.Trigger;
const TabsContent = RadixTabs.Content;

export { Tabs, TabsList, TabsTrigger, TabsContent };
