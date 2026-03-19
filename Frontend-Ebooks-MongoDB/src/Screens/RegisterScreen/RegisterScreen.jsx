import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../Context/AuthContext';
import { Button, FormInput } from '../../Components/shared/FormComponents';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await register(formData);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register</h2>

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
                    value={formData.username}
                    onChange={handleChange('username')}
                    required
                />
                <FormInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                />
                <FormInput
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    required
                />
                <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                    Register
                </Button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}