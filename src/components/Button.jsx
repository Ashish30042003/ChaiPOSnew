import React from 'react';

const Button = ({ onClick, children, variant = 'primary', className = "", disabled = false, themeColor='orange' }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
  
  // Note: Dynamic class names with string interpolation like `bg-${themeColor}-600`
  // don't work well with Tailwind's JIT compiler in production builds
  // without extra configuration. For this project, we'll rely on the fact
  // that the color names are present elsewhere in the code, so they should be picked up.
  const primaryClass = `bg-${themeColor}-600 text-white hover:bg-${themeColor}-700 disabled:bg-stone-300 disabled:text-stone-500`;
  
  const variants = {
    primary: primaryClass,
    secondary: "bg-stone-100 text-stone-700 hover:bg-stone-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200",
    outline: "border border-stone-300 text-stone-600 hover:bg-stone-50",
    ghost: "hover:bg-stone-100 text-stone-600"
  };
  
  // A style-based fallback for black, as bg-black-600 is not a default tailwind color.
  const style = variant === 'primary' && themeColor === 'black' ? { backgroundColor: '#1c1917' } : {};

  return (
    <button onClick={onClick} disabled={disabled} style={style} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
