const fs = require('fs');

let content = fs.readFileSync('catalogo.html', 'utf8');

// Reemplazar las rutas locales de imágenes por URLs dinámicas de búsqueda de Bing
content = content.replace(/\{([^}]+)\}/g, (match, inner) => {
    // Verificar que sea un objeto de producto
    if (inner.includes('brand:') && inner.includes('name:')) {
        const nameMatch = inner.match(/name:"([^"]+)"/);
        if (nameMatch) {
            const name = nameMatch[1];
            // Crear la consulta de búsqueda (añadimos "perfume" para mayor precisión)
            const query = encodeURIComponent(name + ' perfume');
            // URL del servicio de miniaturas de Bing
            const newImg = 'https://tse2.mm.bing.net/th?q=' + query + '&w=400&h=400&c=7&rs=1&p=0';
            
            // Reemplazar la propiedad img antigua por la nueva
            let newInner = inner.replace(/img:"[^"]+"/, 'img:"' + newImg + '"');
            return '{' + newInner + '}';
        }
    }
    return match;
});

fs.writeFileSync('catalogo.html', content);
console.log('Imágenes dinámicas configuradas correctamente.');
