'use client';

import React from 'react'

interface IContainerProps {
  children: React.ReactNode
};

const Container: React.FC<IContainerProps> = ({ children }: IContainerProps) => {
  return (
    <div
      className='
        max-w-[2520px]
        mx-auto
        xl:px-20
        md:px-10
        sm:px2
        px-4
        py-6
      '
    >
      {children}
    </div>
  )
}

export default Container