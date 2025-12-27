import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, AlertCircle, Settings } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Home.scss';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${API_URL}/assignments`);
            const data = await response.json();

            if (data.success) {
                setAssignments(data.data);
            } else {
                setError('Failed to load assignments');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyClass = (difficulty) => {
        return `difficulty difficulty--${difficulty.toLowerCase()}`;
    };

    const handleAssignmentClick = (id) => {
        navigate(`/workspace/${id}`);
    };

    if (loading) {
        return (
            <div className="home">
                <div className="home__loading">
                    <div className="spinner"></div>
                    <p>Loading assignments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home">
                <div className="home__error">
                    <h2>⚠️ {error}</h2>
                    <p>Make sure the backend server is running on port 5000</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home">
            <header className="home__header">
                <div className="container">
                    <div className="home__header-content">
                        <div className="home__branding">
                            <h1 className="home__title">
                                <Lock className="home__title-icon" size={48} />
                                CipherSQL Studio
                            </h1>
                            <p className="home__subtitle">Ace SQL through practice and intelligent guidance</p>
                        </div>
                        <div className="home__header-actions">
                            <button onClick={() => navigate('/admin')} className="btn btn--hint">
                                <Settings size={18} /> Admin
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="home__content container">
                <div className="assignments">
                    <h2 className="assignments__title">Available Assignments</h2>

                    {assignments.length === 0 ? (
                        <div className="assignments__empty">
                            <AlertCircle size={48} />
                            <p>No assignments available yet.</p>
                            <p className="text-muted">Contact your administrator to add assignments.</p>
                        </div>
                    ) : (
                        <div className="assignments__grid">
                            {assignments.map((assignment) => (
                                <div
                                    key={assignment._id}
                                    className="assignment-card"
                                    onClick={() => handleAssignmentClick(assignment._id)}
                                >
                                    <div className="assignment-card__header">
                                        <h3 className="assignment-card__title">{assignment.title}</h3>
                                        <span className={getDifficultyClass(assignment.difficulty)}>
                                            {assignment.difficulty}
                                        </span>
                                    </div>
                                    <p className="assignment-card__description">{assignment.description}</p>
                                    <button className="assignment-card__button">
                                        Start Challenge <Zap size={16} style={{ marginLeft: '4px' }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
