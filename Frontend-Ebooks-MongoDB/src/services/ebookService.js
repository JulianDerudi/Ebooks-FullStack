import ebooks_data from "../data/ebooksData";

function getEbooks() {
    // Combinar ebooks publicados (datos iniciales) + ebooks guardados en localStorage
    const publishedEbooks = ebooks_data;
    const storedEbooks = localStorage.getItem("ebooks");
    
    if (storedEbooks) {
        const parsedStored = JSON.parse(storedEbooks);
        // Filtrar solo los ebooks que fueron agregados por el usuario (id es timestamp)
        // Los ebooks publicados tienen ids 1, 2, 3, etc.
        const userAddedEbooks = parsedStored.filter(ebook => ebook.id > 1000);
        return [...publishedEbooks, ...userAddedEbooks];
    }
    
    return publishedEbooks;
}

function getEbookById(id) {
    const allEbooks = getEbooks();
    return allEbooks.find(ebook => ebook.id === parseInt(id))
}

function isUserAddedEbook(id) {
    // Los ebooks agregados por el usuario tienen id > 1000 (son timestamps)
    return id > 1000;
}

function deleteEbookById(id) {
    // Solo permite eliminar ebooks agregados por el usuario
    if (!isUserAddedEbook(id)) {
        return false;
    }
    
    const storedEbooks = localStorage.getItem("ebooks");
    if (!storedEbooks) return false;
    
    const parsedStored = JSON.parse(storedEbooks);
    const filtered = parsedStored.filter(ebook => ebook.id !== id);
    localStorage.setItem("ebooks", JSON.stringify(filtered));
    return true;
}

export { getEbooks, getEbookById, isUserAddedEbook, deleteEbookById }