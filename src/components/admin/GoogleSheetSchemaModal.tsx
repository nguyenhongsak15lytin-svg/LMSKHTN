import React, { useState, useEffect } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { sheetProvider, getScriptUrl, setScriptUrl } from '../../services/sheetProvider';
import { GOOGLE_APPS_SCRIPT_CODE } from '../../services/googleAppsScriptTemplate';
import { GOOGLE_APPS_SCRIPT_WEB_APP_CODE } from '../../services/googleAppsScriptWebApp';
import { Table, Copy, Check, Download, FileSpreadsheet, X, Code, Terminal, Sparkles, RefreshCw, Send, DownloadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

interface GoogleSheetSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetSchemaModal: React.FC<GoogleSheetSchemaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'webapp' | 'setup' | 'schema'>('sync');
  const [scriptUrl, setUrl] = useState(getScriptUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok?: boolean; message?: string; error?: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedWebApp, setCopiedWebApp] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const schema = mockProvider.getGoogleSheetSchema();

  useEffect(() => {
    setUrl(getScriptUrl());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    setScriptUrl(scriptUrl.trim());
    setScriptUrl(scriptUrl.trim());
    setScriptUrl(scriptUrl.trim());
    // Save to localStorage via setScriptUrl
    setScriptUrl(scriptUrl.trim());
    alert('Đã lưu URL Web App thành công!');
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await sheetProvider.testConnection();
    setTesting(false);
    setTestResult(res);
  };

  const handlePush = async () => {
    setSyncing(true);
    setSyncMessage('Đang đẩy dữ liệu lên Google Sheets...');
    const ok = await sheetProvider.pushAllToSheet();
    setSyncing(false);
    setSyncMessage(ok ? 'Đẩy dữ liệu lên Google Sheets thành công!' : 'Có lỗi khi đẩy dữ liệu.');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  const handlePull = async () => {
    setSyncing(true);
    setSyncMessage('Đang tải dữ liệu từ Google Sheets...');
    const ok = await sheetProvider.pullAllFromSheet();
    setSyncing(false);
    setSyncMessage(ok ? 'Tải dữ liệu từ Google Sheets thành công! Đang tải lại trang...' : 'Có lỗi khi tải dữ liệu.');
    if (ok) {
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Đồng Bộ Google Sheets & Web App API
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kết nối trực tiếp ứng dụng với Google Sheets thông qua URL Web App của bạn.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Đồng Bộ Trực Tiếp (`sheetProvider`)
          </button>
          <button
            onClick={() => setActiveTab('webapp')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'webapp'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Web App API (`/exec`)
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'setup'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            Script Setup (`setupDatabase`)
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            Cấu Trúc Các Tab
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                <span className="font-bold block text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Kết nối Google Sheets Web App URL:
                </span>
                <p>URL Web App của bạn đã được cấu hình sẵn. Bạn có thể kiểm tra kết nối, đẩy dữ liệu lên Google Sheet (Push) hoặc tải dữ liệu từ Google Sheet về web (Pull).</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Google Apps Script Web App URL (`/exec`)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scriptUrl}
                    onChange={e => setUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      setScriptUrl(scriptUrl.trim());
                      alert('Đã lưu URL Web App thành công!');
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 rounded-xl hover:bg-slate-800"
                  >
                    Lưu URL
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
                  Kiểm tra kết nối Web App
                </button>

                <button
                  onClick={handlePush}
                  disabled={syncing}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-500/20"
                >
                  <Send className="w-4 h-4" />
                  Đẩy dữ liệu lên Google Sheet (Push)
                </button>

                <button
                  onClick={handlePull}
                  disabled={syncing}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <DownloadCloud className="w-4 h-4" />
                  Tải dữ liệu từ Google Sheet (Pull)
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl text-xs flex items-start gap-2 ${
                  testResult.ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200'
                }`}>
                  {testResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />}
                  <div>
                    <span className="font-bold block">{testResult.ok ? 'Thành công!' : 'Lỗi kết nối:'}</span>
                    <span>{testResult.message || testResult.error}</span>
                  </div>
                </div>
              )}

              {syncMessage && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 text-xs font-semibold">
                  {syncMessage}
                </div>
              )}
            </div>
          )}

          {activeTab === 'webapp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Mã nguồn Google Apps Script Web App (`Code.gs`)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_WEB_APP_CODE);
                      setCopiedWebApp(true);
                      setTimeout(() => setCopiedWebApp(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    {copiedWebApp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedWebApp ? 'Đã sao chép' : 'Sao chép Code Web App'}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-[350px] leading-relaxed">
                  {GOOGLE_APPS_SCRIPT_WEB_APP_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className="relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md z-10"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedScript ? 'Đã sao chép' : 'Sao chép Script Setup'}
                </button>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-[350px] leading-relaxed">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(schema).map(([tableName, columns]) => (
                  <div key={tableName} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        {tableName}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {columns.map(col => (
                        <span key={col} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <span className="text-xs text-slate-500 font-mono truncate max-w-md">
            URL: {scriptUrl}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
