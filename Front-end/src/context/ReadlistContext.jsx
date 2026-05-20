import { createContext, useContext } from 'react';
import { useReadlist } from '../hooks/useReadlist';

const ReadlistContext = createContext(null);

export function ReadlistProvider({ children }) {
  const readlist = useReadlist();
  return (
    <ReadlistContext.Provider value={readlist}>
      {children}
    </ReadlistContext.Provider>
  );
}

export function useReadlistContext() {
  return useContext(ReadlistContext);
}
