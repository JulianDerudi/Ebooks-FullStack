export const Button = ({ 
  onClick, 
  children, 
  type = "button", 
  variant = "primary", 
  size = "default",
  className = "",
  ...props 
}) => {
  const btnClass = `btn btn-${variant} btn-${size} ${className}`.trim();
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={btnClass}
      {...props}
    >
      {children}
    </button>
  );
};

export const FormInput = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder,
  required = false,
  error = null
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
    </div>
  );
};

export const FormTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required = false,
  error = null,
  rows = 6
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
    </div>
  );
};

export const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  children,
  required = false,
  error = null
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        required={required}
      >
        {children}
      </select>
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
    </div>
  );
};

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};
