const fs = require('fs');

let content = fs.readFileSync('catalogo.html', 'utf8');

// 1. Eliminar el filtro de ofertas del HTML
content = content.replace(/\s*<select id="offerFilter">[\s\S]*?<\/select>/, '');

// 2. Actualizar el texto del header
content = content.replace('ofertas y orden por precio', 'y orden por precio');

// 3. Eliminar clases CSS relacionadas con ofertas
content = content.replace(/\s*\.badge\s*{[^}]*}\s*/, '');
content = content.replace(/\s*\.old-price\s*{[^}]*}\s*/, '');
content = content.replace(/\s*\.new-price\s*{[^}]*}\s*/, '');

// 4. Eliminar variables JS y event listeners de ofertas
content = content.replace(/\s*const offerFilter = document\.getElementById\('offerFilter'\);/, '');
content = content.replace(/\s*offerFilter\.addEventListener\('change', applyFilters\);/, '');

// 5. Eliminar lógica de ofertas en applyFilters
content = content.replace(/\s*const offer = offerFilter\.value;/, '');
const offerFilterLogicRegex = /\s*if \(offer === 'offer'\) \{\s*filtered = filtered\.filter\(p => p\.offer\);\s*\} else if \(offer === 'normal'\) \{\s*filtered = filtered\.filter\(p => !p\.offer\);\s*\}/;
content = content.replace(offerFilterLogicRegex, '');

// 6. Actualizar renderProducts (quitar badge y lógica de precios)
content = content.replace(/\s*\$\{product\.offer \? '<div class="badge">Oferta<\/div>' : ''\}/, '');
const priceLogicRegex = /\$\{\s*product\.offer && product\.oldPrice\s*\?\s*`<span class="old-price">\$\{formatPrice\(product\.oldPrice\)\}<\/span><span class="new-price">\$\{formatPrice\(product\.price\)\}<\/span>`\s*:\s*`\$\{formatPrice\(product\.price\)\}`\s*\}/;
content = content.replace(priceLogicRegex, '${formatPrice(product.price)}');

// 7. Actualizar el array de productos
content = content.replace(/\{([^}]+)\}/g, (match, inner) => {
    if (match.includes('brand:')) {
        let priceMatch = inner.match(/price:(\d+)/);
        let oldPriceMatch = inner.match(/oldPrice:(\d+)/);
        
        let newInner = inner;
        if (oldPriceMatch && oldPriceMatch[1]) {
            // Si tiene un precio antiguo (precio normal), reemplazamos el precio de oferta por el normal
            newInner = newInner.replace(/price:\d+/, `price:${oldPriceMatch[1]}`);
        }
        
        // Eliminamos las propiedades oldPrice y offer
        newInner = newInner.replace(/,\s*oldPrice:[^,]+/, '');
        newInner = newInner.replace(/,\s*offer:(true|false)/, '');
        
        return `{${newInner}}`;
    }
    return match;
});

fs.writeFileSync('catalogo.html', content);
console.log('Archivo actualizado correctamente.');
