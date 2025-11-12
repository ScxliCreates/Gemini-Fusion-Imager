import React, { useState, useCallback } from 'react';
import { WorkflowStatus, ImageFile } from './types';
import * as geminiService from './services/geminiService';
import Header from './components/Header';
import UserInput from './components/UserInput';
import WorkflowStep from './components/WorkflowStep';
import ImageDisplay from './components/ImageDisplay';
import { ErrorIcon } from './components/icons';

const App: React.FC = () => {
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(WorkflowStatus.IDLE);
  const [prompt, setPrompt] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<ImageFile | undefined>(undefined);
  const [apiKey, setApiKey] = useState<string>('');
  
  const [quickDraftImage, setQuickDraftImage] = useState<ImageFile | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState<ImageFile | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<ImageFile | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setWorkflowStatus(WorkflowStatus.IDLE);
    setPrompt('');
    setOriginalImage(undefined);
    setQuickDraftImage(null);
    setPlan(null);
    setDraftImage(null);
    setAnalysis(null);
    setFinalImage(null);
    setError(null);
  };

  const handleGenerate = useCallback(async (userPrompt: string, userImage?: ImageFile) => {
    resetState();
    setPrompt(userPrompt);
    setOriginalImage(userImage);
    
    try {
      // Step 1: Quick Draft
      setWorkflowStatus(WorkflowStatus.QUICK_DRAFTING);
      const quickImageBase64 = await geminiService.quickGenerate(userPrompt, apiKey, userImage);
      const quickImageFile = { base64: quickImageBase64, mimeType: 'image/png' };
      setQuickDraftImage(quickImageFile);

      // Step 2: Plan
      setWorkflowStatus(WorkflowStatus.PLANNING);
      const generatedPlan = await geminiService.generatePlan(userPrompt, apiKey, userImage);
      setPlan(generatedPlan);

      // Step 3: Refined Draft
      setWorkflowStatus(WorkflowStatus.DRAFTING);
      const generatedDraftBase64 = await geminiService.generateDraft(generatedPlan, apiKey, userImage);
      const draftImageFile = { base64: generatedDraftBase64, mimeType: 'image/png' };
      setDraftImage(draftImageFile);

      // Step 4: Analysis
      setWorkflowStatus(WorkflowStatus.ANALYZING);
      const generatedAnalysis = await geminiService.generateAnalysis(userPrompt, generatedPlan, draftImageFile, apiKey, userImage);
      setAnalysis(generatedAnalysis);

      // Step 5: Final Image
      setWorkflowStatus(WorkflowStatus.REFINING);
      const finalImageBase64 = await geminiService.generateFinalImage(generatedAnalysis, draftImageFile, apiKey, userImage);
      const finalImageFile = { base64: finalImageBase64, mimeType: 'image/png' };
      setFinalImage(finalImageFile);

      setWorkflowStatus(WorkflowStatus.COMPLETED);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
      setWorkflowStatus(WorkflowStatus.ERROR);
    }
  }, [apiKey]);
  
  const isLoading = workflowStatus > WorkflowStatus.IDLE && workflowStatus < WorkflowStatus.COMPLETED;

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <main className="container mx-auto pb-12 px-4">
        <Header apiKey={apiKey} setApiKey={setApiKey} />
        <UserInput onGenerate={handleGenerate} isLoading={isLoading} />
        
        <div className="mt-8 space-y-6">
            {error && (
                <div className="w-full max-w-5xl mx-auto md:px-6 animate-fade-in">
                    <div className="bg-red-900/30 border border-red-700/50 text-red-300 p-4 rounded-xl flex items-start gap-3">
                        <ErrorIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-200">An Error Occurred</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {workflowStatus >= WorkflowStatus.QUICK_DRAFTING && workflowStatus < WorkflowStatus.ERROR && (
              <WorkflowStep title="1. First Draft" status={workflowStatus > WorkflowStatus.QUICK_DRAFTING ? 'complete' : 'in-progress'}>
                {quickDraftImage && (
                  <div className="max-w-md mx-auto">
                    <ImageDisplay imageBase64={quickDraftImage.base64} />
                  </div>
                )}
              </WorkflowStep>
            )}

            {workflowStatus >= WorkflowStatus.PLANNING && workflowStatus < WorkflowStatus.ERROR && (
              <WorkflowStep title="2. The Plan" status={workflowStatus > WorkflowStatus.PLANNING ? 'complete' : 'in-progress'}>
                {plan && <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{plan}</p>}
              </WorkflowStep>
            )}

            {workflowStatus >= WorkflowStatus.DRAFTING && workflowStatus < WorkflowStatus.ERROR && (
              <WorkflowStep title="3. The Refined Draft" status={workflowStatus > WorkflowStatus.DRAFTING ? 'complete' : 'in-progress'}>
                {draftImage && (
                  <div className="max-w-md mx-auto">
                    <ImageDisplay imageBase64={draftImage.base64} />
                  </div>
                )}
              </WorkflowStep>
            )}

            {workflowStatus >= WorkflowStatus.ANALYZING && workflowStatus < WorkflowStatus.ERROR && (
              <WorkflowStep title="4. The Analysis" status={workflowStatus > WorkflowStatus.ANALYZING ? 'complete' : 'in-progress'}>
                {analysis && <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{analysis}</p>}
              </WorkflowStep>
            )}

            {workflowStatus >= WorkflowStatus.REFINING && workflowStatus < WorkflowStatus.ERROR && (
              <WorkflowStep title="5. The Final Image" status={workflowStatus >= WorkflowStatus.COMPLETED ? 'complete' : 'in-progress'}>
                {finalImage && (
                  <div className="max-w-md mx-auto">
                    <ImageDisplay imageBase64={finalImage.base64} />
                  </div>
                )}
              </WorkflowStep>
            )}
        </div>

      </main>
    </div>
  );
};

export default App;