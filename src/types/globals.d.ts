/// <reference types="react" />
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Declaraciones para módulos CSS
declare module "*.css" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.scss" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.sass" {
    const content: { [className: string]: string };
    export default content;
}

// Declaraciones para módulos de imágenes
declare module "*.svg" {
    const content: any;
    export default content;
}

declare module "*.png" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

declare module "*.jpeg" {
    const content: string;
    export default content;
}

declare module "*.gif" {
    const content: string;
    export default content;
}

declare module "*.webp" {
    const content: string;
    export default content;
}

// Declaraciones para librerías externas sin tipos
declare module "wowjs" {
    export class WOW {
        constructor(config?: { live?: boolean });
        init(): void;
    }
}

// Extensión de Window para propiedades custom
interface Window {
    wow?: any;
}
