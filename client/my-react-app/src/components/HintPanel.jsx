import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import './HintPanel.scss';

const HintPanel = React.memo(({ hint, modelUsed }) => {
    if (!hint) return null;

    return (
        <section className="panel panel--hint">
            <div className="panel__header">
                <h3 className="panel__title"><Lightbulb size={20} /> Hint</h3>
                {modelUsed && <span className="model-badge"><Sparkles size={14} /> {modelUsed}</span>}
            </div>
            <p className="panel__text">{hint}</p>
        </section>
    );
});

HintPanel.displayName = 'HintPanel';

export default HintPanel;
