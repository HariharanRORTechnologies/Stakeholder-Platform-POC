/// <reference types="vite/client" />

// CSS Module Declaration
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Image Module Declarations
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
