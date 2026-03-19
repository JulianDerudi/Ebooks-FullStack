import { Link } from "react-router";
import NewEbookForm from "../../Components/NewEbookForm/NewEbookForm";
import { Button } from "../../Components/shared/FormComponents";
import { useAuth } from "../../Context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AddEbookScreen() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    return (
        <div>
            <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                padding: 'var(--spacing-2xl)',
                marginBottom: 'var(--spacing-2xl)',
                boxShadow: 'var(--shadow-md)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Link to="/" style={{ textDecoration: 'none', marginBottom: 'var(--spacing-lg)', display: 'inline-block' }}>
                        <Button>← Back</Button>
                    </Link>
                    <h1 style={{
                        color: 'var(--white)',
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: 700,
                        marginTop: 'var(--spacing-lg)'
                    }}>
                        ✍️ Publish Your Story
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginTop: 'var(--spacing-md)',
                        fontSize: 'var(--font-size-base)'
                    }}>
                        Share your creativity with the world
                    </p>
                </div>
            </div>
            <div className="chapters-container">
                <NewEbookForm />
            </div>
        </div>
    );
}
