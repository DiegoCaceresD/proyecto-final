export const cartErrorInfo = (data) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            --> carrito: ${data}
    `;
};