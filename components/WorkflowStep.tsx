import React, { ReactNode, useState } from 'react';
import { LoaderIcon, CheckCircleIcon, ChevronDownIcon } from './icons';

interface WorkflowStepProps {
  title: string;
  status: 'in-progress' | 'complete';
  children: ReactNode;
}

const statusMap = {
    'in-progress': {
        icon: <LoaderIcon className="w-6 h-6 animate-spin text-sky-400" />,
        text: 'In Progress...',
        textColor: 'text-sky-400',
        borderColor: 'border-sky-500/50',
        bgColor: 'bg-sky-900/20'
    },
    'complete': {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        text: 'Complete',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/40',
        bgColor: 'bg-green-900/20'
    }
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ title, status, children }) => {
  const [isOpen, setIsOpen] = useState(status !== 'complete');
  const currentStatus = statusMap[status];
  const contentId = `workflow-content-${title.replace(/\s+/g, '-')}`;

  return (
    <div className="w-full max-w-5xl mx-auto md:px-6 animate-fade-in">
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
      <div className={`bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-lg border ${currentStatus.borderColor} transition-all duration-500`}>
        <button
          className="w-full text-left p-4 flex justify-between items-center cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm font-medium ${currentStatus.textColor} ${currentStatus.bgColor} px-3 py-1 rounded-full`}>
                {currentStatus.icon}
                <span className="hidden sm:inline">{currentStatus.text}</span>
            </div>
            <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <div
          id={contentId}
          className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="p-4 md:p-6 border-t border-slate-800">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStep;