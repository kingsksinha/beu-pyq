import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarksPage } from './pages/BookmarksPage';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { PaperDetailPage } from './pages/PaperDetailPage';
import { PapersExplorerPage } from './pages/PapersExplorerPage';
import { PracticeModePage } from './pages/PracticeModePage';
import { SemesterDirectoryPage } from './pages/SemesterDirectoryPage';
import { SubjectDirectoryPage } from './pages/SubjectDirectoryPage';
import { YearArchivePage } from './pages/YearArchivePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="papers" element={<PapersExplorerPage />} />
            <Route path="semesters" element={<SemesterDirectoryPage />} />
            <Route path="subjects" element={<SubjectDirectoryPage />} />
            <Route path="years" element={<YearArchivePage />} />
            <Route path="paper/:id" element={<PaperDetailPage />} />
            <Route path="practice/:id" element={<PracticeModePage />} />
            <Route path="bookmarks" element={<BookmarksPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
