/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LimsProvider } from './context/LimsContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SamplesModule } from './pages/SamplesModule';
import { ConcreteModule } from './pages/ConcreteModule';
import { AsphaltModule } from './pages/AsphaltModule';
import { BaseLayerModule } from './pages/BaseLayerModule';
import { ClientsModule } from './pages/ClientsModule';
import { ReportsModule } from './pages/ReportsModule';
import { StandardsModule } from './pages/StandardsModule';

export default function App() {
  return (
    <LimsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="samples" element={<SamplesModule />} />
            <Route path="concrete" element={<ConcreteModule />} />
            <Route path="asphalt" element={<AsphaltModule />} />
            <Route path="base-layer" element={<BaseLayerModule />} />
            <Route path="clients" element={<ClientsModule />} />
            <Route path="reports" element={<ReportsModule />} />
            <Route path="standards" element={<StandardsModule />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LimsProvider>
  );
}

