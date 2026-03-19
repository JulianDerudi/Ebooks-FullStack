import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ebookService } from '../../services/apiService';
import { useAuth } from '../../Context/AuthContext';
import { Button, FormInput, FormTextarea } from '../../Components/shared/FormComponents';

export default function EditChaptersScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ebook, setEbook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [newChapter, setNewChapter] = useState({ title: '', content: '' });
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        const fetchEbook = async () => {
            try {
                const response = await ebookService.getById(id);
                setEbook(response.data);
                setChapters(response.data.chapters || []);
            } catch (error) {
                setError('Error loading ebook');
                console.error('Error fetching ebook:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEbook();
    }, [id]);

    useEffect(() => {
        if (ebook && user && String(ebook.author._id) !== String(user.id)) {
            setError('Not authorized to edit this ebook');
        }
    }, [ebook, user]);

    const handleAddChapter = () => {
        if (newChapter.title.trim() && newChapter.content.trim()) {
            setChapters(prev => [...prev, { ...newChapter }]);
            setNewChapter({ title: '', content: '' });
        }
    };

    const handleEditChapter = (index) => {
        setEditingIndex(index);
        setNewChapter({ ...chapters[index] });
    };

    const handleUpdateChapter = () => {
        if (editingIndex !== null && newChapter.title.trim() && newChapter.content.trim()) {
            setChapters(prev => prev.map((ch, i) => i === editingIndex ? { ...newChapter } : ch));
            setEditingIndex(null);
            setNewChapter({ title: '', content: '' });
        }
    };

    const handleDeleteChapter = (index) => {
        if (window.confirm('Are you sure you want to delete this chapter?')) {
            setChapters(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        console.log('Token in localStorage:', localStorage.getItem('token'));
        console.log('User:', user);
        console.log('Ebook author:', ebook?.author);

        try {
            const formData = new FormData();
            formData.append('chapters', JSON.stringify(chapters));

            await ebookService.update(id, formData);
            navigate(`/ebook/${id}`);
        } catch (error) {
            const message = error.response?.data?.message || 'Error saving chapters';
            setError(message);
            console.error('Error updating ebook:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
    if (!ebook) return <div style={{ textAlign: 'center', padding: '2rem' }}>Ebook not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to={`/profile/${user?.id}`} style={{ textDecoration: 'none' }}>
                    <Button>← Back to Profile</Button>
                </Link>
                <h1 style={{ marginTop: '1rem' }}>Edit Chapters: {ebook.title}</h1>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Add New Chapter</h2>
                <FormInput
                    label="Chapter Title"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter chapter title"
                />
                <FormTextarea
                    label="Chapter Content"
                    value={newChapter.content}
                    onChange={(e) => setNewChapter(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter chapter content"
                    rows={10}
                />
                {editingIndex === null ? (
                    <Button onClick={handleAddChapter} style={{ marginTop: '1rem' }}>Add Chapter</Button>
                ) : (
                    <Button onClick={handleUpdateChapter} style={{ marginTop: '1rem' }}>Update Chapter</Button>
                )}
            </div>

            <div>
                <h2>Existing Chapters</h2>
                {chapters.length === 0 ? (
                    <p>No chapters yet.</p>
                ) : (
                    chapters.map((chapter, index) => (
                        <div key={index} style={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <h3>{chapter.title}</h3>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{chapter.content.substring(0, 200)}...</p>
                            <div style={{ marginTop: '1rem' }}>
                                <Button onClick={() => handleEditChapter(index)} style={{ marginRight: '1rem' }}>Edit</Button>
                                <Button onClick={() => handleDeleteChapter(index)} variant="danger">Delete</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Button onClick={handleSave} disabled={saving} style={{ marginRight: '1rem' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={() => navigate(`/ebook/${id}`)} variant="secondary">Cancel</Button>
            </div>
        </div>
    );
}