/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';

import { DocumentsIndex, SearchResults } from '../types/index';
import { getDocumentRank, DocumentRank } from './utils';

export interface SearchRelevanceContextProps {
  documentsIndexes1: DocumentsIndex[];
  setDocumentsIndexes1: React.Dispatch<React.SetStateAction<DocumentsIndex[]>>;
  documentsIndexes2: DocumentsIndex[];
  setDocumentsIndexes2: React.Dispatch<React.SetStateAction<DocumentsIndex[]>>;
  showFlyout: boolean;
  setShowFlyout: React.Dispatch<React.SetStateAction<boolean>>;
  comparedResult1: DocumentRank;
  updateComparedResult1: (result: SearchResults) => void;
  comparedResult2: DocumentRank;
  updateComparedResult2: (result: SearchResults) => void;
  selectedIndex1: string;
  setSelectedIndex1: React.Dispatch<React.SetStateAction<string>>;
  selectedIndex2: string;
  setSelectedIndex2: React.Dispatch<React.SetStateAction<string>>;
  pipelines1: {};
  setPipelines1: React.Dispatch<React.SetStateAction<{}>>;
  pipelines2: {};
  setPipelines2: React.Dispatch<React.SetStateAction<{}>>;
  pipeline1: string;
  setPipeline1: React.Dispatch<React.SetStateAction<string>>;
  pipeline2: string;
  setPipeline2: React.Dispatch<React.SetStateAction<string>>;
  selectedDataSource1: string;
  setSelectedDataSource1: React.Dispatch<React.SetStateAction<string>>;
  selectedDataSource2: string;
  setSelectedDataSource2: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchRelevanceContext = createContext<SearchRelevanceContextProps | null>(null);

export const useSearchRelevanceContext = () => {
  const context = useContext(SearchRelevanceContext);

  if (!context) {
    throw Error('No Search Relevance context');
  }

  return context;
};

export const SearchRelevanceContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [documentsIndexes1, setDocumentsIndexes1] = useState<DocumentsIndex[]>([]);
  const [documentsIndexes2, setDocumentsIndexes2] = useState<DocumentsIndex[]>([]);

  const [showFlyout, setShowFlyout] = useState(false);
  const [comparedResult1, setComparedResult1] = useState<DocumentRank>({});
  const [comparedResult2, setComparedResult2] = useState<DocumentRank>({});
  const [selectedIndex1, setSelectedIndex1] = useState('');
  const [selectedIndex2, setSelectedIndex2] = useState('');
  const [pipelines1, setPipelines1] = useState<{}>({});
  const [pipelines2, setPipelines2] = useState<{}>({});

  const [pipeline1, setPipeline1] = useState('');
  const [pipeline2, setPipeline2] = useState('');
  const [selectedDataSource1, setSelectedDataSource1] = useState('');
  const [selectedDataSource2, setSelectedDataSource2] = useState('');

  const updateComparedResult1 = (result: SearchResults) => {
    setComparedResult1(getDocumentRank(result?.hits?.hits));
  };

  const updateComparedResult2 = (result: SearchResults) => {
    setComparedResult2(getDocumentRank(result?.hits?.hits));
  };

  return (
    <SearchRelevanceContext.Provider
      value={{
        documentsIndexes1,
        setDocumentsIndexes1,
        documentsIndexes2,
        setDocumentsIndexes2,
        showFlyout,
        setShowFlyout,
        comparedResult1,
        updateComparedResult1,
        comparedResult2,
        updateComparedResult2,
        selectedIndex1,
        setSelectedIndex1,
        selectedIndex2,
        setSelectedIndex2,
        pipelines1,
        setPipelines1,
        pipelines2,
        setPipelines2,
        pipeline1,
        setPipeline1,
        pipeline2,
        setPipeline2,
        selectedDataSource1,
        setSelectedDataSource1,
        selectedDataSource2,
        setSelectedDataSource2
      }}
    >
      {children}
    </SearchRelevanceContext.Provider>
  );
};
