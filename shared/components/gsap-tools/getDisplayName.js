const getDisplayName = Component => `WithGsapTools-${(
  Component.displayName ||
  Component.name ||
  (typeof Component === 'string' && Component.length > 0
    ? Component
    : 'Unknown')
)}`;

export default getDisplayName;
