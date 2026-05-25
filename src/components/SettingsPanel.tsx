import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SettingsPanelProps {
  onBack: () => void;
  onClearHistory: () => void;
  historyCount: number;
}

export default function SettingsPanel({ onBack, onClearHistory, historyCount }: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const data = localStorage.getItem('tarot-reading-history');
    if (!data) {
      alert('没有可导出的历史记录');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarot-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    const app = document.getElementById('tarot-app');
    if (!app) return;
    const canvas = await html2canvas(app, {
      backgroundColor: '#0f0220',
      scale: 2,
    });
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarot-screenshot-${Date.now()}.png`;
    a.click();
  };

  const handleExportPDF = async () => {
    const app = document.getElementById('tarot-app');
    if (!app) return;
    const canvas = await html2canvas(app, {
      backgroundColor: '#0f0220',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`tarot-reading-${Date.now()}.pdf`);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (Array.isArray(data)) {
          localStorage.setItem('tarot-reading-history', JSON.stringify(data));
          alert(`成功导入 ${data.length} 条记录！刷新后生效。`);
        } else {
          alert('文件格式不正确');
        }
      } catch {
        alert('文件解析失败，请检查 JSON 格式');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearHistory = () => {
    if (window.confirm(`确定要删除全部 ${historyCount} 条占卜记录吗？此操作不可撤销。`)) {
      onClearHistory();
    }
  };

  interface SettingsItem {
    label: string;
    desc: string;
    onClick: () => void;
    danger?: boolean;
  }

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: '导出',
      items: [
        { label: '导出历史为 JSON', desc: '下载所有记录为 JSON 文件', onClick: handleExportJSON },
        { label: '导出截图为 PNG', desc: '将当前画面保存为高清图片', onClick: handleExportPNG },
        { label: '导出截图为 PDF', desc: '将当前画面保存为 PDF 文档', onClick: handleExportPDF },
      ],
    },
    {
      title: '导入',
      items: [
        { label: '导入 JSON 历史记录', desc: '从之前导出的 JSON 文件恢复记录', onClick: handleImportJSON },
      ],
    },
    {
      title: '数据管理',
      items: [
        {
          label: '清除所有历史记录',
          desc: `当前共 ${historyCount} 条记录 · 不可撤销`,
          onClick: handleClearHistory,
          danger: true,
        },
      ],
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors p-2 -ml-2"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-serif font-semibold text-gradient">设置</h2>
      </div>

      {/* About */}
      <div className="glass-panel p-5 mb-6 text-center">
        <div className="text-4xl mb-2">🌙</div>
        <h3 className="font-serif text-white text-lg">Mystic Tarot</h3>
        <p className="text-xs text-gray-500 mt-1">韦特塔罗 · 78张完整牌库 · 离线可用</p>
      </div>

      {/* Settings sections */}
      {settingsSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            {section.title}
          </h3>
          <div className="space-y-2">
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full glass-panel p-4 text-left transition-all
                           hover:bg-white/8 active:scale-[0.99]
                           ${item.danger ? 'hover:border-red-500/20' : ''}`}
              >
                <div className={`text-sm font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-center text-[10px] text-gray-700 mt-8">
        Build with React + Tailwind + GSAP
      </p>
    </div>
  );
}
