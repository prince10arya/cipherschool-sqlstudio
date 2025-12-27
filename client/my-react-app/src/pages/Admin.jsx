import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import ThemeToggle from '../components/ThemeToggle';
import './Admin.scss';

const Admin = () => {
    const navigate = useNavigate();
    const {
        assignments,
        loading,
        error,
        success,
        fetchAssignments,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        clearMessages,
    } = useAdminStore();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        difficulty: 'Easy',
        description: '',
        question: '',
        sampleData: '{}',
    });

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    useEffect(() => {
        if (success) {
            setTimeout(() => clearMessages(), 3000);
        }
    }, [success, clearMessages]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessages();

        // Validate and parse sampleData
        let parsedSampleData;
        try {
            parsedSampleData = JSON.parse(formData.sampleData);
        } catch (err) {
            alert('Invalid JSON in Sample Data');
            return;
        }

        const assignmentData = {
            ...formData,
            sampleData: parsedSampleData,
        };

        let result;
        if (editingId) {
            result = await updateAssignment(editingId, assignmentData);
        } else {
            result = await createAssignment(assignmentData);
        }

        if (result) {
            resetForm();
        }
    };

    const handleEdit = (assignment) => {
        setEditingId(assignment._id);
        setFormData({
            title: assignment.title,
            difficulty: assignment.difficulty,
            description: assignment.description,
            question: assignment.question,
            sampleData: JSON.stringify(assignment.sampleData, null, 2),
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            await deleteAssignment(id);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            difficulty: 'Easy',
            description: '',
            question: '',
            sampleData: '{}',
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="admin">
            <header className="admin__header">
                <div className="container">
                    <div className="admin__header-content">
                        <button onClick={() => navigate('/')} className="btn btn--back">
                            <ArrowLeft size={20} /> Back to Home
                        </button>
                        <h1 className="admin__title">Admin Panel</h1>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="admin__content container">
                {error && <div className="message message--error">{error}</div>}
                {success && <div className="message message--success">{success}</div>}

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn--primary admin__add-btn"
                    >
                        <Plus size={20} /> Create New Assignment
                    </button>
                )}

                {showForm && (
                    <div className="admin__form-wrapper">
                        <div className="admin__form-header">
                            <h2>{editingId ? 'Edit Assignment' : 'Create New Assignment'}</h2>
                            <button onClick={resetForm} className="btn btn--back">
                                <X size={20} /> Cancel
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="admin__form">
                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="difficulty">Difficulty *</label>
                                <select
                                    id="difficulty"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="question">Question *</label>
                                <textarea
                                    id="question"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sampleData">
                                    Sample Data (JSON) *
                                    <span className="form-help">
                                        Format: {`{ "tableName": { "schema": [...], "rows": [...] } }`}
                                    </span>
                                </label>
                                <textarea
                                    id="sampleData"
                                    name="sampleData"
                                    value={formData.sampleData}
                                    onChange={handleInputChange}
                                    rows="12"
                                    className="code-input"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn--primary" disabled={loading}>
                                    <Save size={18} /> {editingId ? 'Update' : 'Create'} Assignment
                                </button>
                                <button type="button" onClick={resetForm} className="btn btn--back">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="admin__list">
                    <h2>All Assignments ({assignments.length})</h2>
                    {loading && <div className="spinner-container"><div className="spinner"></div></div>}

                    {!loading && assignments.length === 0 && (
                        <p className="admin__empty">No assignments yet. Create one to get started!</p>
                    )}

                    {!loading && assignments.length > 0 && (
                        <div className="admin__grid">
                            {assignments.map((assignment) => (
                                <div key={assignment._id} className="admin-card">
                                    <div className="admin-card__header">
                                        <h3>{assignment.title}</h3>
                                        <span className={`difficulty difficulty--${assignment.difficulty.toLowerCase()}`}>
                                            {assignment.difficulty}
                                        </span>
                                    </div>
                                    <p className="admin-card__description">{assignment.description}</p>
                                    <div className="admin-card__actions">
                                        <button
                                            onClick={() => handleEdit(assignment)}
                                            className="btn btn--hint"
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(assignment._id)}
                                            className="btn btn--danger"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
