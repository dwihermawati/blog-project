'use client';

import React, { lazy, Suspense } from 'react';
import { BeatLoader } from 'react-spinners';

const Editor = lazy(() => import('./Editor'));

export default function LazyEditor(props: React.ComponentProps<typeof Editor>) {
  return (
    <Suspense fallback={<BeatLoader size={20} color='#0093DD' />}>
      <Editor {...props} />
    </Suspense>
  );
}
