import React from 'react';
import '../styles/variables.css';
import '../styles/global.css';
import '../styles/components.css';
import '../styles/layout.css';
import '../styles/reader.css';
import '../styles/ebook-card.css';
import '../styles/ebook-detail.css';
import '../styles/forms.css';

export default function App({ children }) {
  return (
    <div className="main-wrapper">
      {children}
    </div>
  );
}
