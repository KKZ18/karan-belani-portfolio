import React from 'react';
import { Components } from 'tinacms/dist/rich-text';
import { Prism } from 'tinacms/dist/rich-text/prism';
import Image from 'next/image';

export const components: Components<Record<string, never>> = {
  code_block: (props) => {
    if (!props) return <></>;
    return <Prism lang={props.lang} value={props.value} />;
  },
  img: (props) => {
    if (!props) return <></>;
    return (
      <span className="flex items-center justify-center">
        <Image src={props.url} alt={props.alt || ''} width={800} height={450} />
      </span>
    );
  },
};
