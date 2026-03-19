import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../Context/AuthContext';
import { userService } from '../../services/apiService';
import { Button, FormInput } from '../../Components/shared/FormComponents';

export default function EditProfileScreen() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        profilePicture: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormValues({
                username: user.username || '',
                email: user.email || '',
                profilePicture: null,
            });
        }
    }, [user]);

    const handleChange = (field) => (e) => {
        setFormValues(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setFormValues(prev => ({ ...prev, profilePicture: file }));
        } else {
            alert('Please select a valid JPEG or PNG image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', formValues.username);
            formData.append('email', formValues.email);
            if (formValues.profilePicture) {
                formData.append('profilePicture', formValues.profilePicture);
            }

            const response = await userService.updateProfile(formData);
            updateUser(response.data.user);
            navigate(`/profile/${response.data.user.id}`);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
            <h2>Edit Profile</h2>

            {error && (
                <div style={{
                    background: 'var(--error-color)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Username"
                    value={formValues.username}
                    onChange={handleChange('username')}
                    required
                />

                <FormInput
                    label="Email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange('email')}
                    required
                />

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: 'var(--spacing-sm)',
                        fontWeight: 600,
                        color: 'var(--text-color)'
                    }}>
                        Profile Picture (JPEG or PNG)
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            fontSize: 'var(--font-size-base)'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                    <Button type="submit" style={{ flex: 1 }} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        style={{ flex: 1 }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
