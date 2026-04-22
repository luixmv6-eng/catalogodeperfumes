const fs = require('fs');

let content = fs.readFileSync('catalogo.html', 'utf8');

// 1. Reemplazar el CSS
const newCSS = `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, serif;
      background: #121212;
      color: #e0e0e0;
    }

    header {
      background: #0a0a0a;
      color: white;
      padding: 40px 20px;
      text-align: center;
      border-bottom: 1px solid #222;
    }

    header h1 {
      margin: 0 0 10px;
      font-size: 2.5rem;
      color: #d4af37;
      letter-spacing: 2px;
    }

    header p {
      margin: 0;
      opacity: .8;
      color: #ccc;
    }

    .controls {
      max-width: 1300px;
      margin: 25px auto 10px;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 12px;
    }

    .controls input,
    .controls select {
      padding: 12px 14px;
      border: 1px solid #333;
      border-radius: 10px;
      font-size: 15px;
      background: #1e1e1e;
      color: #e0e0e0;
    }
    
    .controls input::placeholder {
      color: #888;
    }

    .summary {
      max-width: 1300px;
      margin: 0 auto 20px;
      padding: 0 20px;
      font-size: 14px;
      color: #aaa;
    }

    .catalog {
      max-width: 1300px;
      margin: 0 auto 50px;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 22px;
    }

    .card {
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 6px 18px rgba(0,0,0,.5);
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 430px;
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 24px rgba(0,0,0,.8);
      border-color: #d4af37;
    }

    .img-wrap {
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
    }

    .img-wrap img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
      display: block;
    }

    .brand {
      color: #d4af37;
      font-family: Arial, sans-serif;
      font-size: 13px;
      text-transform: uppercase;
      margin-bottom: 8px;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .name {
      font-size: 20px;
      line-height: 1.15;
      min-height: 74px;
      margin-bottom: 10px;
      color: #fff;
    }

    .price {
      margin-top: auto;
      font-size: 18px;
      font-weight: bold;
      font-family: Georgia, serif;
      color: #d4af37;
    }

    .no-results {
      max-width: 1300px;
      margin: 40px auto;
      padding: 0 20px;
      color: #aaa;
      font-size: 18px;
      display: none;
    }

    @media (max-width: 900px) {
      .controls {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 560px) {
      .controls {
        grid-template-columns: 1fr;
      }
      .name {
        min-height: auto;
      }
      .card {
        min-height: auto;
      }
    }`;

content = content.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + newCSS + '\n  </style>');

// 2. Reemplazar el HTML del header y eliminar el footer
const newHTML = `  <header>
    <h1>L'ESSENCE</h1>
    <p>Catálogo digital de productos</p>
  </header>

  <section class="controls">
    <input type="text" id="searchInput" placeholder="Buscar por nombre o marca..." />
    <select id="brandFilter">
      <option value="all">Todas las marcas</option>
    </select>
    <select id="sortFilter">
      <option value="default">Orden por defecto</option>
      <option value="price-asc">Precio: menor a mayor</option>
      <option value="price-desc">Precio: mayor a menor</option>
      <option value="name-asc">Nombre: A-Z</option>
      <option value="name-desc">Nombre: Z-A</option>
    </select>
  </section>

  <div class="summary" id="summaryText"></div>
  <section class="catalog" id="catalog"></section>
  <div class="no-results" id="noResults">No se encontraron productos con esos filtros.</div>`;

content = content.replace(/<header>[\s\S]*?<\/footer>/, newHTML);

fs.writeFileSync('catalogo.html', content);
console.log('Tema oscuro aplicado correctamente.');
