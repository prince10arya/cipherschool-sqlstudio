import React from 'react';
import { CheckCircle } from 'lucide-react';
import './ResultsPanel.scss';

const ResultsPanel = React.memo(({ results }) => {
    if (!results) return null;

    return (
        <section className="panel panel--results">
            <h3 className="panel__title"><CheckCircle size={20} /> Results ({results.rowCount} rows)</h3>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {results.fields.map((field, idx) => (
                                <th key={idx}>{field.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {results.fields.map((field, colIdx) => (
                                    <td key={colIdx}>{JSON.stringify(row[field.name])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
});

ResultsPanel.displayName = 'ResultsPanel';

export default ResultsPanel;
