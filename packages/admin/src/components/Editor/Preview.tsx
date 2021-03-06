import React, { useEffect, useRef } from 'react';
import { makeHtml } from './utils/markdown';
import {
  registerScollListener,
  subjectScrollListener,
  removeScrollListener,
} from './utils/syncScroll';

export const Preview = ({ value }) => {
  const ref = useRef<HTMLDivElement>();
  const HTML = makeHtml(value);

  useEffect(() => {
    const listener = ({ top, left }) => {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.scrollTop = top * scrollHeight;
      ref.current.scrollLeft = left;
    };
    subjectScrollListener('preview', 'editor', listener);
    return () => {
      removeScrollListener('editor', listener);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    const listener = registerScollListener('preview', () => {
      return {
        top: el.scrollTop / (el.scrollHeight - el.offsetHeight),
        left: el.scrollLeft,
      };
    });
    el.addEventListener('scroll', listener, true);
    return () => {
      el.removeEventListener('scroll', listener, true);
    };
  }, []);

  return (
    <div ref={ref} style={{ height: '100%', padding: '10px 2rem 40px', overflow: 'auto' }}>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: HTML }}></div>
    </div>
  );
};
