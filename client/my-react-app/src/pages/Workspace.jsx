import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Play, Loader2, AlertTriangle } from 'lucide-react';
import useWorkspaceStore from '../store/useWorkspaceStore';
import ThemeToggle from '../components/ThemeToggle';
import QuestionPanel from '../components/QuestionPanel';
import SampleDataViewer from '../components/SampleDataViewer';
import SQLEditor from '../components/SQLEditor';
import ResultsPanel from '../components/ResultsPanel';
import HintPanel from '../components/HintPanel';
import ErrorPanel from '../components/ErrorPanel';
import './Workspace.scss';

const Workspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Get state from Zustand store
    const {
        assignment,
        query,
        results,
        error,
        hint,
        hintModel,
        loading,
        executing,
        gettingHint,
        setQuery,
        fetchAssignment,
        executeQuery,
        getHint,
        resetWorkspace,
    } = useWorkspaceStore();

    useEffect(() => {
        fetchAssignment(id);

        // Cleanup on unmount
        return () => resetWorkspace();
    }, [id, fetchAssignment, resetWorkspace]);

    if (loading) {
        return (
            <div className="workspace">
                <div className="workspace__loading">
                    <div className="spinner"></div>
                    <p>Loading assignment...</p>
                </div>
            </div>
        );
    }

    if (error && !assignment) {
        return (
            <div className="workspace">
                <div className="workspace__error">
                    <h2>⚠️ {error}</h2>
                    <button onClick={() => navigate('/')} className="btn btn--primary">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="workspace">
            <header className="workspace__header">
                <button onClick={() => navigate('/')} className="btn btn--secondary">
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 className="workspace__title">{assignment?.title}</h1>
                <ThemeToggle />
            </header>

            <div className="workspace__content">
                <div className="workspace__left">
                    <QuestionPanel question={assignment?.question} />
                    <SampleDataViewer sampleData={assignment?.sampleData} />
                </div>

                <div className="workspace__right">
                    <SQLEditor
                        query={query}
                        onChange={setQuery}
                        actions={
                            <>
                                <button
                                    onClick={getHint}
                                    disabled={gettingHint}
                                    className="btn btn--secondary"
                                >
                                    {gettingHint ? (
                                        <><Loader2 size={18} className="spinning" /> Thinking...</>
                                    ) : (
                                        <><Lightbulb size={18} /> Get Hint</>
                                    )}
                                </button>
                                <button
                                    onClick={executeQuery}
                                    disabled={executing}
                                    className="btn"
                                >
                                    {executing ? (
                                        <><Loader2 size={18} className="spinning" /> Running...</>
                                    ) : (
                                        <><Play size={18} /> Run Query</>
                                    )}
                                </button>
                            </>
                        }
                    />
                    <HintPanel hint={hint} modelUsed={hintModel} />
                    <ErrorPanel error={error && !results ? error : null} />
                    <ResultsPanel results={results} />
                </div>
            </div>
        </div>
    );
};

export default Workspace;
