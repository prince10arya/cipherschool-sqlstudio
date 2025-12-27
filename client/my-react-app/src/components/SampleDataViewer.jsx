import React from 'react';
import { Database } from 'lucide-react';
import './SampleDataViewer.scss';

const SampleDataViewer = React.memo(({ sampleData }) => {
    if (!sampleData) return null;

    return (
        <section className="panel panel--sample-data">
            <h3 className="panel__title"><Database size={20} /> Sample Data</h3>
            <div className="sample-data">
                {Object.entries(sampleData).map(([tableName, tableData]) => (
                    <div key={tableName} className="sample-data__table">
                        <h4 className="sample-data__table-name">{tableName}</h4>

                        {tableData.schema && (
                            <div className="sample-data__schema">
                                <strong>Schema:</strong>
                                <ul>
                                    {tableData.schema.map((col, idx) => (
                                        <li key={idx}>
                                            <code>{col.name}</code>{' '}
                                            <span className="type">{col.type}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {tableData.rows && tableData.rows.length > 0 && (
                            <div className="sample-data__rows">
                                <strong>Sample Rows:</strong>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                {tableData.schema.map((col, idx) => (
                                                    <th key={idx}>{col.name}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.rows.map((row, rowIdx) => (
                                                <tr key={rowIdx}>
                                                    {tableData.schema.map((col, colIdx) => (
                                                        <td key={colIdx}>{row[col.name]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
});

SampleDataViewer.displayName = 'SampleDataViewer';

export default SampleDataViewer;
