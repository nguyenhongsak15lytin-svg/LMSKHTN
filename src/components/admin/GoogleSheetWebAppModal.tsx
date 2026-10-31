import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_WEB_APP_CODE } from '../../services/googleAppsScriptWebApp';
import { Code, Copy, Check, Terminal, FileSpreadsheet, X, Send, Sparkles } from 'lucide-react';

interface GoogleSheetWebAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetWebAppModal: React.FC<GoogleSheetWebAppModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFetch, setCopiedFetch] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_WEB_APP_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleFetchCode = `// Test đồng bộ dữ liệu với Google Apps Script Web App (/exec)
async function syncToGoogleSheet(webAppUrl, allData) {
  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Tránh CORS preflight với Google Apps Script
      },
      body: JSON.stringify({
        action: 'syncAll',
        payload: allData // { "Quản lí lớp học": [...], "Quản lí học sinh": [...] }
      })
    });
    const result = await response.json();
    console.log('Sync result:', result);
    return result;
  } catch (err) {
    console.error('Sync failed:', err);
  }
}`;

  const handleCopyFetch = () => {
    navigator.clipboard.writeText(sampleFetchCode);
    setCopiedFetch(true);
    setTimeout(() => setCopiedFetch(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Google Apps Script Web App (`/exec`) & Hướng Dẫn Đồng Bộ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nhận POST JSON <code className="font-mono">{`{ action, payload }`}</code>, trả về chuẩn <code className="font-mono">{`{ ok, data, error }`}</code>.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Deployment Guide */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
            <span className="font-bold block text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Hướng Dẫn Deploy Google Apps Script Web App:
            </span>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Mở Google Spreadsheet, chọn <b>Tiện ích mở rộng</b> &gt; <b>Apps Script</b>.</li>
              <li>Dán đoạn code Web App (bên dưới) vào file <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded">Code.gs</code>.</li>
              <li>Nhấn <b>Triển khai (Deploy)</b> &gt; <b>Tên triển khai mới (New deployment)</b>.</li>
              <li>Chọn loại ứng dụng là <b>Ứng dụng web (Web app)</b>.</li>
              <li>Mô tả: <code className="font-mono">EduCore LMS API v1</code>.</li>
              <li>Thực thi dưới dạng: <b>Tôi (Me)</b>.</li>
              <li>Ai có quyền truy cập: <b>Bất kỳ ai (Anyone)</b>.</li>
              <li>Nhấn <b>Triển khai</b> và sao chép URL Web App kết thúc bằng <code className="font-mono">/exec</code>.</li>
            </ol>
          </div>

          {/* Web App Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Mã nguồn Google Apps Script (`Code.gs`)</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Đã sao chép' : 'Sao chép Code Web App'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-[250px] leading-relaxed">
              {GOOGLE_APPS_SCRIPT_WEB_APP_CODE}
            </pre>
          </div>

          {/* Postman / Fetch Testing Guide */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Cách Test bằng Postman hoặc Fetch JavaScript</span>
              <button
                onClick={handleCopyFetch}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                {copiedFetch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFetch ? 'Đã sao chép' : 'Sao chép Fetch Snippet'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-[180px] leading-relaxed">
              {sampleFetchCode}
            </pre>
            <p className="text-[11px] text-slate-500">
              <b>Lưu ý Postman:</b> Gửi yêu cầu <code>POST</code> đến URL <code>/exec</code>, chọn Header <code>Content-Type: text/plain;charset=utf-8</code> (hoặc <code>application/json</code>) và Body dạng JSON:
            </p>
            <pre className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
{`{
  "action": "getAllData"
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <span className="text-xs text-slate-500 font-mono">
            CORS bypass handled via text/plain content-type format.
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
