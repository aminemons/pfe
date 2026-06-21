/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PresentationEngine } from './components/PresentationEngine';

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#15324F] selection:bg-[#5CA9E6]/30">
      <PresentationEngine />
    </div>
  );
}

