import React from 'react';
import { FileText } from 'lucide-react';
import './QuestionPanel.scss';

const QuestionPanel = React.memo(({ question }) => {
    return (
        <section className="panel panel--question">
            <h3 className="panel__title"><FileText size={20} /> Question</h3>
            <p className="panel__text">{question}</p>
        </section>
    );
});

QuestionPanel.displayName = 'QuestionPanel';

export default QuestionPanel;
