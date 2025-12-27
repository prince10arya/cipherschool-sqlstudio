import React from 'react';
import Editor from '@monaco-editor/react';
import { Code } from 'lucide-react';
import './SQLEditor.scss';

const SQLEditor = React.memo(({ query, onChange, actions }) => {
    const editorOptions = React.useMemo(
        () => ({
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
        }),
        []
    );

    return (
        <section className="panel panel--editor">
            <h3 className="panel__title"><Code size={20} /> SQL Editor</h3>
            <div className="editor-wrapper">
                <Editor
                    height="300px"
                    defaultLanguage="sql"
                    theme="vs-dark"
                    value={query}
                    onChange={onChange}
                    options={editorOptions}
                />
            </div>
            {actions && (
                <div className="editor-actions">
                    {actions}
                </div>
            )}
        </section>
    );
});

SQLEditor.displayName = 'SQLEditor';

export default SQLEditor;
