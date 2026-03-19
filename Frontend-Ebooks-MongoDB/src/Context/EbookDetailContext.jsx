import { createContext } from "react";
import { useParams } from "react-router";
import { getEbookById } from "../services/ebookService";



export const EbookDetailContext = createContext(
    {
        ebook_selected: null
    }
)

export default function EbookDetailContextProvider({ children }) {
    const { id } = useParams()
    const ebook_selected = getEbookById(id)

    const providerValue = {
        ebook_selected: ebook_selected
    }

    return (
        <EbookDetailContext.Provider value={providerValue}>
            {children}
        </EbookDetailContext.Provider>
    )
}