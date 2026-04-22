const fs = require('fs');

let content = fs.readFileSync('catalogo.html', 'utf8');

// 1. Añadir CSS extra
const extraCSS = `
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #050505;
    }
    ::-webkit-scrollbar-thumb {
      background: #222;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #d4af37;
    }

    /* Sticky Controls Wrapper */
    .controls-wrapper {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 10, 10, 0.75);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 30px;
      transition: box-shadow 0.3s ease;
    }
    
    .controls {
      margin: 0 auto;
    }

    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }

    /* Card Shine Effect */
    .card {
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 100%);
      transform: skewX(-25deg);
      transition: all 0.7s ease;
      z-index: 1;
      pointer-events: none;
    }
    .card:hover::before {
      left: 200%;
    }

    /* Catalog transition state */
    .catalog {
      transition: opacity 0.3s ease;
    }
    .catalog.updating {
      opacity: 0;
    }

    /* Header Animation */
    header h1 {
      opacity: 0;
      animation: fadeInUp 0.8s ease forwards;
    }
    header p {
      opacity: 0;
      animation: fadeInUp 0.8s ease 0.2s forwards;
    }
`;

content = content.replace('</style>', extraCSS + '\n  </style>');

// 2. Envolver .controls en .controls-wrapper
content = content.replace('<section class="controls">', '<div class="controls-wrapper">\n    <section class="controls">');
content = content.replace('</section>\n\n  <div class="summary"', '</section>\n  </div>\n\n  <div class="summary"');

// 3. Reemplazar la función renderProducts y añadir Intersection Observer
const newJS = `
    // Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    function renderProducts(list) {
      const catalogEl = document.getElementById('catalog');
      
      // Smooth transition out
      catalogEl.classList.add('updating');
      
      setTimeout(() => {
        catalogEl.innerHTML = '';

        if (!list.length) {
          noResults.style.display = 'block';
          noResults.classList.add('fade-in-up');
          noResults.style.animationPlayState = 'running';
          summaryText.textContent = '0 productos encontrados';
          catalogEl.classList.remove('updating');
          return;
        }

        noResults.style.display = 'none';
        summaryText.textContent = \`\${list.length} producto(s) encontrados\`;

        list.forEach((product, index) => {
          const card = document.createElement('article');
          card.className = 'card fade-in-up';
          
          // Stagger animation delay based on index (max 15 to avoid huge delays)
          const delay = Math.min((index % 12) * 0.08, 0.8);
          card.style.animationDelay = \`\${delay}s\`;
          card.style.animationPlayState = 'paused'; // Pause until in view

          card.innerHTML = \`
            <div class="img-wrap">
              <img src="\${product.img}" alt="\${product.name}" onerror="this.src='https://via.placeholder.com/240x220?text=Sin+Imagen';">
            </div>
            <div class="brand">\${product.brand}</div>
            <div class="name">\${product.name}</div>
            <div class="price">
              \${formatPrice(product.price)}
            </div>
          \`;
          catalogEl.appendChild(card);
          observer.observe(card);
        });
        
        // Smooth transition in
        catalogEl.classList.remove('updating');
      }, 300); // Wait for fade out
    }

    // Add sticky header shadow effect on scroll
    window.addEventListener('scroll', () => {
      const controlsWrapper = document.querySelector('.controls-wrapper');
      if (window.scrollY > 50) {
        controlsWrapper.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      } else {
        controlsWrapper.style.boxShadow = 'none';
      }
    });
`;

// Reemplazar la función renderProducts antigua por la nueva
content = content.replace(/function renderProducts\(list\) \{[\s\S]*?catalog\.appendChild\(card\);\n      \}\);\n    \}/, newJS);

fs.writeFileSync('catalogo.html', content);
console.log('Animaciones y dinamismo aplicados correctamente.');
