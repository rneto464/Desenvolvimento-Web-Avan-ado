import { useState, useEffect } from 'react';

const STORAGE_KEY = 'readlist';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function useReadlist() {
  const [readlist, setReadlist] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readlist));
  }, [readlist]);

  function add(news) {
    setReadlist(prev =>
      prev.some(n => n.id === news.id) ? prev : [news, ...prev]
    );
  }

  function remove(id) {
    setReadlist(prev => prev.filter(n => n.id !== id));
  }

  function moveUp(index) {
    if (index === 0) return;
    setReadlist(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index) {
    setReadlist(prev => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  function isAdded(id) {
    return readlist.some(n => n.id === id);
  }

  return { readlist, add, remove, moveUp, moveDown, isAdded };
}
