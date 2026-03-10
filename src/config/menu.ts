export interface MenuItem {
    route: string;
    name: string;
}

export const menuList: MenuItem[] = [
    { route: "/", name: "Home" },
    { route: "/#services-section", name: "Servicios" },
    { route: "/projects", name: "Proyectos" },
    { route: "/products", name: "Productos" },
    { route: "/contact-page", name: "Contacto" },
];
