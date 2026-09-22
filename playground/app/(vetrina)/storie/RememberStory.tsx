'use client';

import { useEffect } from 'react';

import { rememberStory } from './catalogMemory';

/** Scrive quale storia si sta guardando, perché l'indice la mostri accesa al ritorno. Non rende niente. */
export function RememberStory({ name }: { name: string }) {
  useEffect(() => rememberStory(name), [name]);
  return null;
}
