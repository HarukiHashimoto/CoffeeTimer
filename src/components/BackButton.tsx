"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="p-2 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
    >
      <ArrowLeftIcon className="h-5 w-5 text-light-text dark:text-dark-text" />
    </button>
  );
}
