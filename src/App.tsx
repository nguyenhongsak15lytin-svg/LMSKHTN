/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { mockProvider } from './services/mockProvider';
import { Header } from './components/Header';
import { AdminLayout } from './components/admin/AdminLayout';
import { StudentLayout } from './components/student/StudentLayout';
import { GoogleSheetSchemaModal } from './components/admin/GoogleSheetSchemaModal';
import { UserRole } from './types/lms';

export default function App() {
  const currentUser = mockProvider.getCurrentUser();
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser.role);
  const [showSheetSchema, setShowSheetSchema] = useState(false);

  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    mockProvider.switchUserRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        onOpenSheetSchema={() => setShowSheetSchema(true)}
      />

      {currentRole === 'admin' ? <AdminLayout /> : <StudentLayout />}

      <GoogleSheetSchemaModal
        isOpen={showSheetSchema}
        onClose={() => setShowSheetSchema(false)}
      />
    </div>
  );
}
