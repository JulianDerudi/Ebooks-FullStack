import { useState } from "react";
import { useNavigate } from "react-router";
import { getEbooks } from "../../services/ebookService";
import { Button } from "../../Components/shared/FormComponents";

export default function SearchEbookForm() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchValue.trim()) return;
    
    const ebooks = getEbooks();
    const ebookById = ebooks.find(ebook => ebook.id === parseInt(searchValue));
    
    if (ebookById) {
      navigate(`/ebook/${ebookById.id}`);
      setSearchValue("");
      return;
    }
    
    const ebookByName = ebooks.find(ebook => 
      ebook.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    if (ebookByName) {
      navigate(`/ebook/${ebookByName.id}`);
      setSearchValue("");
      return;
    }
    
    alert("Ebook not found");
    setSearchValue("");
  };

  return (
    <div className="search-form">
        <form onSubmit={handleSearch}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Search by title or ID..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
        </form>
    </div>
  );
}