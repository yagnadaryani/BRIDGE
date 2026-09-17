'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/shell/Navbar';
import { Sidebar } from '@/components/shell/Sidebar';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page text-textMain flex flex-col">
      <Navbar onOpenAIAssistant={() => setIsAiOpen(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
