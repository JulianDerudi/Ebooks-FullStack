import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ebookService } from "../../services/apiService";
import { EbookContext } from "../../Context/EbookContext";
import { useAuth } from "../../Context/AuthContext";
import { Button, FormInput, FormTextarea } from "../../Components/shared/FormComponents";

export default function EbookDetailScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateEbookById } = useContext(EbookContext);
    const { user, isAuthenticated } = useAuth();
    const [ebook, setEbook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddChapter, setShowAddChapter] = useState(false);
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterContent, setChapterContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEbook = async () => {
            try {
                console.log('Fetching ebook with id:', id);
                const response = await ebookService.getById(id);
                console.log('Ebook response:', response.data);
                setEbook(response.data);
            } catch (error) {
                console.error('Error fetching ebook:', error);
                setError('Ebook not found');
            } finally {
                setLoading(false);
            }
        };

        fetchEbook();
    }, [id]);

    console.log('EbookDetailScreen render - user:', user, 'ebook:', ebook, 'loading:', loading, 'error:', error);
    const isUserBook = user && ebook && String(ebook.author._id) === String(user.id);
    console.log('isUserBook:', isUserBook, 'user.id:', user?.id, 'ebook.author._id:', ebook?.author?._id);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${ebook.title}"?`)) {
            try {
                await ebookService.delete(id);
                navigate("/");
            } catch (error) {
                console.error('Error deleting ebook:', error);
                alert('Error deleting ebook');
            }
        }
    };

    const handleAddChapter = async (e) => {
        e.preventDefault();

        if (!chapterTitle.trim() || !chapterContent.trim()) {
            alert("Please fill in all fields");
            return;
        }

        const newChapter = {
            title: chapterTitle,
            content: chapterContent
        };

        const updatedChapters = [...(ebook.chapters || []), newChapter];

        try {
            const formData = new FormData();
            formData.append('chapters', JSON.stringify(updatedChapters));

            const response = await ebookService.update(id, formData);
            setEbook(response.data);
            updateEbookById(id, response.data);

            setChapterTitle("");
            setChapterContent("");
            setShowAddChapter(false);
            alert("Chapter added successfully!");
        } catch (error) {
            console.error('Error adding chapter:', error);
            alert('Error adding chapter');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    if (error || !ebook) {
        return (
            <div className="chapters-container">
                <p>{error || 'Ebook not found'}</p>
            </div>
        );
    }

    return (
        <div className="ebook-detail">
            <div style={{ padding: '20px', background: 'red', color: 'white' }}>
                DEBUG: Loading: {loading ? 'true' : 'false'}, Error: {error}, User: {user ? user.username : 'null'}, Ebook: {ebook ? ebook.title : 'null'}, isUserBook: {isUserBook ? 'true' : 'false'}
            </div>
            <div className="reader-header">
                <div className="reader-header-info">
                    <h2>{ebook.title}</h2>
                    <p>{ebook.author.username}</p>
                </div>
                <div className="reader-header-actions">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button>← Back</Button>
                    </Link>
                </div>
            </div>

            <div className="chapters-container">
                <div className="ebook-detail-cover">
                    {ebook.cover_image && (
                        <div className="ebook-detail-cover-image">
                            <img
                                src={`data:image/jpeg;base64,${ebook.cover_image}`}
                                alt={ebook.title}
                            />
                        </div>
                    )}
                    <div className="ebook-detail-info">
                        <h1>{ebook.title}</h1>
                        <p className="ebook-detail-author">by {ebook.author.username}</p>
                        {ebook.description && (
                            <p className="ebook-detail-description">
                                {ebook.description}
                            </p>
                        )}
                        <div className="ebook-detail-meta">
                            <div className="ebook-detail-meta-item">
                                <span className="ebook-detail-meta-label">Chapters</span>
                                <span className="ebook-detail-meta-value">{ebook.chapters?.length || 0}</span>
                            </div>
                            <div className="ebook-detail-meta-item">
                                <span className="ebook-detail-meta-label">Likes</span>
                                <span className="ebook-detail-meta-value">{ebook.likes?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="chapters-title">📚 Story Chapters</h3>

                {ebook.chapters && ebook.chapters.length > 0 ? (
                    <div className="grid">
                        {ebook.chapters.map((chapter, index) => (
                            <Link
                                key={index}
                                to={`/ebook/${id}/chapter/${index}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="chapter-item">
                                    <h3>{chapter.title}</h3>
                                    <p className="chapter-preview">{chapter.content.substring(0, 100)}...</p>
                                    <span className="chapter-link">Read Chapter →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-chapters-container">
                        <div className="no-chapters-message">
                            <h4>📖 No chapters yet</h4>
                            <p>This story doesn't have any chapters published yet.</p>
                            {isUserBook ? (
                                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                                    <Button
                                        onClick={() => setShowAddChapter(true)}
                                        style={{ fontSize: 'var(--font-size-lg)', padding: 'var(--spacing-md) var(--spacing-xl)' }}
                                    >
                                        ✍️ Add First Chapter
                                    </Button>
                                </div>
                            ) : (
                                <p>Check back later for updates from the author!</p>
                            )}
                        </div>
                    </div>
                )}

                {isUserBook && ebook.chapters && ebook.chapters.length > 0 && (
                    <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                        <Button
                            onClick={() => setShowAddChapter(!showAddChapter)}
                            className={showAddChapter ? '' : ''}
                        >
                            {showAddChapter ? "Cancel" : "Add Another Chapter"}
                        </Button>
                    </div>
                )}

                {showAddChapter && (
                    <form onSubmit={handleAddChapter} className="add-chapter-form" style={{ marginTop: 'var(--spacing-xl)' }}>
                        <h4>{ebook.chapters && ebook.chapters.length > 0 ? "Add New Chapter" : "Add First Chapter"}</h4>
                        <FormInput
                            label="Chapter Title"
                            value={chapterTitle}
                            onChange={(e) => setChapterTitle(e.target.value)}
                            required
                        />
                        <FormTextarea
                            label="Chapter Content"
                            value={chapterContent}
                            onChange={(e) => setChapterContent(e.target.value)}
                            required
                        />
                        <div className="form-actions">
                            <Button type="submit">Save Chapter</Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowAddChapter(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                {isUserBook && (
                    <Button
                        onClick={handleDelete}
                        variant="danger"
                        style={{ marginTop: 'var(--spacing-2xl)', width: '100%', maxWidth: '300px' }}
                    >
                        Delete / Unpublish
                    </Button>
                )}
            </div>
        </div>
    );
}
                                

/*
<div className="chapter-item">
                                    <h3>{chapter.title}</h3>
                                    <p className="chapter-preview">{chapter.content}</p>
                                    <span className="chapter-link">Read Chapter →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="no-chapters">No chapters available yet</p>
                )}

                {isUserBook && (
                    <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                        <Button 
                            onClick={() => setShowAddChapter(!showAddChapter)}
                            className={showAddChapter ? '' : ''}
                        >
                            {showAddChapter ? "Cancel" : "Add Chapter"}
                        </Button>

                        {showAddChapter && (
                            <form onSubmit={handleAddChapter} className="add-chapter-form">
                                <h4>Add New Chapter</h4>
                                <FormInput 
                                    label="Chapter Title"
                                    value={chapterTitle}
                                    onChange={(e) => setChapterTitle(e.target.value)}
                                    required
                                />
                                <FormTextarea 
                                    label="Chapter Content"
                                    value={chapterContent}
                                    onChange={(e) => setChapterContent(e.target.value)}
                                    required
                                />
                                <div className="form-actions">
                                    <Button type="submit">Save Chapter</Button>
                                    <Button 
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowAddChapter(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {isUserBook && (
                    <Button 
                        onClick={handleDelete} 
                        variant="danger"
                        style={{ marginTop: 'var(--spacing-2xl)', width: '100%', maxWidth: '300px' }}
                    >
                        Delete / Unpublish
                    </Button>
                )}
            </div>
        </div>
    );
}
*/