import Image from 'next/image';
import React from 'react';

type Props = {
  url: string;
  width?: number;
  height?: number;
};

export const Logo = ({ url, width = 40, height = 40 }: Props) => {
  return (
    <div>
      <Image src={url} width={width} height={height} alt='logo' className='lg:scale-125' />
    </div>
  );
};
