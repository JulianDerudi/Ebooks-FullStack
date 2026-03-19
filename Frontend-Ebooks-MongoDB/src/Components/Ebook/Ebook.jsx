import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { ebookService } from "../../services/apiService";
import { EbookContext } from "../../Context/EbookContext";
import { useAuth } from "../../Context/AuthContext";
import { Button } from "../shared/FormComponents";

export default function Ebook({ ebook }) {
    const { deleteEbook } = useContext(EbookContext);
    const { user, isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(() => {
        if (!ebook?.likes || !user?.id) return false;
        return ebook.likes.some((like) => like.toString() === user.id);
    });
    const [likeCount, setLikeCount] = useState(ebook.likes?.length || 0);
    const [loading, setLoading] = useState(false);

    // Keep liked state in sync when ebook or user changes
    useEffect(() => {
        if (!ebook?.likes) return;
        setLikeCount(ebook.likes.length);
        setLiked(user?.id ? ebook.likes.some((like) => like.toString() === user.id) : false);
    }, [ebook, user?.id]);

    const isUserBook = user && String(ebook.author._id) === String(user.id);

    const handleDelete = async (e) => {
        e.preventDefault();
        if (window.confirm(`Are you sure you want to delete "${ebook.title}"?`)) {
            try {
                await ebookService.delete(ebook._id);
                deleteEbook(ebook._id);
            } catch (error) {
                console.error('Error deleting ebook:', error);
                alert('Error deleting ebook');
            }
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        setLoading(true);
        try {
            if (liked) {
                await ebookService.unlike(ebook._id);
                setLiked(false);
                setLikeCount(prev => prev - 1);
            } else {
                await ebookService.like(ebook._id);
                setLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ebook-card">
            <div className="ebook-cover-wrapper">
                {ebook.cover_image ? (
                    <img src={`data:image/jpeg;base64,${ebook.cover_image}`} alt={ebook.title} />
                ) : (
                    <div className="ebook-cover-placeholder">
                        {ebook.title.substring(0, 1)}
                    </div>
                )}
            </div>

            <div className="ebook-info">
                <h3 className="ebook-title">{ebook.title}</h3>
                <p className="ebook-author">by {ebook.author.username}</p>

                {ebook.description && (
                    <p className="ebook-description">{ebook.description}</p>
                )}

                <div className="ebook-meta">
                    <div className="ebook-meta-item">
                        <span className="ebook-meta-icon">📖</span>
                        <span>{ebook.chapters?.length || 0} chapters</span>
                    </div>
                    <div className="ebook-meta-item">
                        <span className="ebook-meta-icon">❤️</span>
                        <span>{likeCount} likes</span>
                    </div>
                </div>

                <div className="ebook-actions">
                    <Link to={`/ebook/${ebook._id}`} style={{ textDecoration: "none", display: 'block', marginBottom: '0.5rem' }}>
                        <Button style={{ width: '100%' }}>Read</Button>
                    </Link>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {isUserBook && (
                            <Link to={`/edit-chapters/${ebook._id}`} style={{ textDecoration: "none" }}>
                                <Button variant="secondary">Edit Chapters</Button>
                            </Link>
                        )}
                        {isAuthenticated && (
                            <Button
                                onClick={handleLike}
                                variant={liked ? "secondary" : "primary"}
                                disabled={loading}
                            >
                                {liked ? '💔' : '❤️'}
                            </Button>
                        )}
                        {isUserBook && (
                            <Button
                                onClick={handleDelete}
                                variant="danger"
                                className="btn-small"
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}