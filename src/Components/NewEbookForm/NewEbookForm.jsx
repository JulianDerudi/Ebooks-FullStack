import { useState } from "react";
import { useNavigate } from "react-router";
import { ebookService } from "../../services/apiService";
import { Button, FormInput, FormTextarea, FormSelect } from "../shared/FormComponents";

export default function NewEbookForm() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    cover_image: null,
    chapters: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setFormValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setFormValues(prev => ({ ...prev, cover_image: file }));
    } else {
      alert('Please select a valid JPEG or PNG image');
    }
  };

  const sendNewEbookData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('title', formValues.title);
      formData.append('description', formValues.description);
      formData.append('category', formValues.category);
      if (formValues.cover_image) {
        formData.append('cover_image', formValues.cover_image);
      }
      // No agregar capítulos por defecto

      await ebookService.create(formData);
      navigate("/");
    } catch (error) {
      console.error('Error creating ebook:', error);
      setError(error.response?.data?.message || 'Error creating ebook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-xl)', fontSize: 'var(--font-size-2xl)' }}>
        Publish a New Ebook
      </h2>

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

      <form onSubmit={sendNewEbookData} style={{ maxWidth: '600px' }}>
        <FormInput
          label="Title"
          placeholder="Enter ebook title"
          value={formValues.title}
          onChange={handleChange("title")}
          required
        />

        <FormTextarea
          label="Description"
          placeholder="Enter ebook description"
          value={formValues.description}
          onChange={handleChange("description")}
          required
          rows={4}
        />

        <FormSelect
          label="Category"
          value={formValues.category}
          onChange={handleChange("category")}
          required
        >
          <option value="">Select a category</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Romance">Romance</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Mystery">Mystery</option>
          <option value="Biography">Biography</option>
          <option value="Other">Other</option>
        </FormSelect>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontWeight: 600,
            color: 'var(--text-color)'
          }}>
            Cover Image (JPEG or PNG)
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
            {loading ? 'Publishing...' : 'Publish Ebook'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
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
