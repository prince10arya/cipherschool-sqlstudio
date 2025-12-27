import React from 'react';
import { XCircle } from 'lucide-react';
import './ErrorPanel.scss';

const ErrorPanel = React.memo(({ error }) => {
    if (!error) return null;

    return (
        <section className="panel panel--error">
            <h3 className="panel__title"><XCircle size={20} /> Error</h3>
            <p className="panel__text">{error}</p>
        </section>
    );
});

ErrorPanel.displayName = 'ErrorPanel';

export default ErrorPanel;
