import { Link } from 'react-router';
import { useAuth } from '../../Context/AuthContext';
import { Button } from '../shared/FormComponents';

export default function Header() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <header style={{
            background: 'var(--primary-color)',
            color: 'white',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)'
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>My Virtual Library</h1>
            </Link>

            <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        <Link to={`/profile/${user.id}`} style={{ color: 'white', textDecoration: 'none' }}>
                            Profile
                        </Link>
                        <Link to="/add-ebook" style={{ textDecoration: 'none' }}>
                            <Button style={{ background: 'var(--secondary-color)' }}>Add Book</Button>
                        </Link>
                        <Button onClick={logout} variant="secondary">Logout</Button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                            Login
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Button style={{ background: 'var(--secondary-color)' }}>Register</Button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}