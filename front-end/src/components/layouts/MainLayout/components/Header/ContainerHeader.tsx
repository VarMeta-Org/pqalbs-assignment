import type { PropsWithChildren } from 'react';

export const ContainerHeader = ({ children }: PropsWithChildren) => (
  <div className='container mx-auto flex flex-row items-center justify-between gap-8 px-4 py-2 backdrop-blur-sm sm:px-8 lg:h-16 lg:py-2'>
    {children}
  </div>
);
