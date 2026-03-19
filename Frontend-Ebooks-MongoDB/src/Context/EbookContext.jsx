import { createContext, useEffect, useState } from "react";
import { ebookService } from "../services/apiService";
import { Outlet } from "react-router";


export const EbookContext = createContext()

export default function EbookContextProvider({ children }) {
    const [ebooks, setEbooks] = useState([])
    const [loadingEbooks, setLoadingEbooks] = useState(false)

    const loadEbooks = async () => {
        setLoadingEbooks(true)
        try {
            const response = await ebookService.getAll()
            setEbooks(response.data)
        } catch (error) {
            console.error('Error loading ebooks:', error)
        } finally {
            setLoadingEbooks(false)
        }
    }

    useEffect(() => {
        loadEbooks()
    }, [])

    function getEbooksById(id) {
        if (loadingEbooks || !ebooks) return null
        return ebooks.find(ebook => ebook._id === id)
    }

    function searchEbooksByTitle(title) {
        if (loadingEbooks || !ebooks) return []
        return ebooks.filter(ebook => ebook.title.toLowerCase().includes(title.toLowerCase()))
    }

    function updateEbookById(ebook_id_update, updatedEbook) {
        if (loadingEbooks || !ebooks) return null
        const ebookIndex = ebooks.findIndex(ebook => ebook._id === ebook_id_update)
        if (ebookIndex === -1) return null
        ebooks[ebookIndex] = updatedEbook
        setEbooks([...ebooks])
        return updatedEbook
    }

    function deleteEbook(id) {
        setEbooks(prev => prev.filter(ebook => ebook._id !== id))
    }

    const value = {
        ebooks,
        setEbooks,
        loadingEbooks,
        loadEbooks,
        getEbooksById,
        searchEbooksByTitle,
        updateEbookById,
        deleteEbook
    }

    return (
        <EbookContext.Provider value={value}>
            {children}
        </EbookContext.Provider>
    )
}