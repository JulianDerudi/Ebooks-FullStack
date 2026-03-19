import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '../../Context/AuthContext';
import { userService } from '../../services/apiService';
import EbookList from '../../Components/EbookList/EbookList';
import { Button } from '../../Components/shared/FormComponents';

export default function ProfileScreen() {
    const { userId } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getProfile(userId);
                setProfile(response.data);
            } catch (error) {
                setError('Error loading profile');
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
    if (!profile) return <div style={{ textAlign: 'center', padding: '2rem' }}>Profile not found</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {profile.user.profilePicture && (
                    <img
                        src={`data:image/jpeg;base64,${profile.user.profilePicture}`}
                        alt="Profile"
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '1rem'
                        }}
                    />
                )}
                <h1>{profile.user.username}</h1>
                <p>{profile.user.email}</p>

                {user && user.id === profile.user.id && (
                    <div style={{ marginTop: '1rem' }}>
                        <Link to="/profile/edit" style={{ textDecoration: 'none' }}>
                            <Button>Edit Profile</Button>
                        </Link>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <h2>Published Books</h2>
                {profile.publishedEbooks.length > 0 ? (
                    <EbookList ebooks={profile.publishedEbooks} />
                ) : (
                    <p>No published books yet.</p>
                )}
            </div>

            <div>
                <h2>Liked Books</h2>
                {profile.likedEbooks.length > 0 ? (
                    <EbookList ebooks={profile.likedEbooks} />
                ) : (
                    <p>No liked books yet.</p>
                )}
            </div>
        </div>
    );
}