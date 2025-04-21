"use client";

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import BackButton from '@/components/BackButton';

export function useBackButton(show: boolean = true) {
  useEffect(() => {
    if (!show) return;

    const container = document.getElementById('back-button-container');
    if (container) {
      const backButton = <BackButton />;
      const portal = createPortal(backButton, container);
      return () => {
        // Clean up the portal when the component unmounts
        container.innerHTML = '';
      };
    }
  }, [show]);
}
