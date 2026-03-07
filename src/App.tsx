import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { MockTest } from './pages/MockTest';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { useStore } from './store/useStore';

export default function App() {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="practice" element={<Practice />} />
          <Route path="mock-test" element={<MockTest />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
