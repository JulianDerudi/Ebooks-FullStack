import SearchEbookForm from "../../Components/SearchEbookForm/SearchEbookForm";
import EbookList from "../../Components/EbookList/EbookList";
import { Link } from "react-router";
import { Button } from "../../Components/shared/FormComponents";
import { useAuth } from "../../Context/AuthContext";

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
        <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            padding: 'var(--spacing-3xl) var(--spacing-2xl)',
            marginBottom: 'var(--spacing-2xl)',
            textAlign: 'center',
            color: 'white'
        }}>
            <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 700, marginBottom: 'var(--spacing-lg)' }}>
                My Virtual Library
            </h1>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-2xl)', opacity: 0.9 }}>
                Discover and explore amazing stories
            </p>
            {isAuthenticated && (
                <Link to="/add-ebook" style={{ textDecoration: 'none' }}>
                    <Button style={{
                        fontSize: 'var(--font-size-lg)',
                        padding: 'var(--spacing-lg) var(--spacing-2xl)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid white'
                    }}>
                        ✍️ Start Writing Your Story
                    </Button>
                </Link>
            )}
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-2xl)' }}>
            <SearchEbookForm />

            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <h2 style={{
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 700,
                        color: 'var(--text-color)'
                    }}>
                        📚 All Books
                    </h2>
                    {isAuthenticated && (
                        <Link to="/add-ebook" style={{ textDecoration: 'none' }}>
                            <Button style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                                + Add New
                            </Button>
                        </Link>
                    )}
                </div>
                <EbookList />
            </div>
        </div>
    </div>
  );
}