import { useContext } from "react"
import { EbookContext } from "../../Context/EbookContext"
import Ebook from "../Ebook/Ebook"


export default function EbookList({ ebooks: propEbooks }) {
    const { ebooks: contextEbooks, loadingEbooks } = useContext(EbookContext)
    const ebooks = propEbooks || contextEbooks

    if (loadingEbooks || !ebooks) {
        return <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading ebooks...</p>
    }

    if (ebooks.length === 0) {
        return <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>No ebooks found.</p>
    }

    return (
        <div className="ebook-list">
            {ebooks.map(ebook => (
                <Ebook key={ebook._id} ebook={ebook} />
            ))}
        </div>
    )
}
