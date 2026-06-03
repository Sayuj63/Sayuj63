/* ============================================================
   Almost Always — cross-SKU colour swatches
   Each colour of a product is a separate Shopify product tagged
   with `colour-{slug}`. This script finds siblings by base title
   via the predictive-search API and renders clickable swatches.

   Behaviour:
     - Product page: immediate fetch on DOM ready.
     - Collection cards: lazy-loaded via IntersectionObserver.
     - Click → window.location.href to that sibling's product URL.
   ============================================================ */

(function () {
	'use strict';

	const HEX_MAP = {
		'black': '#1C1C1C',
		'white': '#FFFFFF',
		'navy': '#0A1931',
		'blue': '#2563EB',
		'bluefin': '#4A90C4',
		'blue fin': '#4A90C4',
		'green': '#1A5C2A',
		'gray': '#808080',
		'grey': '#9CA3AF',
		'sage': '#87A878',
		'maroon': '#6B0F1A',
		'charcoal': '#3C3C3C',
		'ice water': '#C5DCE8',
		'hunter green': '#355E3B',
		'brown': '#6B3A2A',
		'red': '#C0392B',
		'beige': '#F0E6D3',
		'pink': '#F4A7B9',
		'dusty pink': '#C9848A',
		'powder blue': '#B0C8D8',
		'egg shell': '#F5F0E0',
		'mocha': '#6F4E37',
		'yellow': '#F5C518',
		'clear': '#E5E7EB',
		'burgundy': '#800020',
		'olive': '#6B6B2A'
	};

	const LIGHT_COLOURS = new Set([
		'white', 'egg shell', 'beige', 'clear', 'ice water', 'powder blue'
	]);

	const CARD_SWATCH_LIMIT = 6;
	const siblingCache = new Map(); // baseName → Promise<siblings[]>

	/* ---------- helpers ---------- */

	function extractBaseName(title) {
		if (!title) return '';
		const idx = title.lastIndexOf(' - ');
		return idx === -1 ? title : title.substring(0, idx);
	}

	function extractColourFromTitle(title) {
		if (!title) return '';
		const idx = title.lastIndexOf(' - ');
		return idx === -1 ? '' : title.substring(idx + 3).trim();
	}

	function normaliseColourKey(name) {
		if (!name) return '';
		return name.toLowerCase().replace(/\s+/g, ' ').replace(/-+\d+$/, '').trim();
	}

	function getColourFromTags(tagsCsv) {
		// Extract colour name from a `colour-{slug}` tag if present.
		if (!tagsCsv) return null;
		const tags = tagsCsv.split(',').map(t => t.trim().toLowerCase());
		const tag = tags.find(t => t.indexOf('colour-') === 0);
		if (!tag) return null;
		// strip "colour-" prefix and trailing "-N" suffix
		let slug = tag.substring(7).replace(/-\d+$/, '');
		// turn kebab into spaced
		return slug.replace(/-/g, ' ');
	}

	function hexFor(colourName) {
		const key = normaliseColourKey(colourName);
		return HEX_MAP[key] || null;
	}

	function isLightColour(colourName) {
		return LIGHT_COLOURS.has(normaliseColourKey(colourName));
	}

	function titleCase(str) {
		return str.replace(/\b\w/g, c => c.toUpperCase());
	}

	function hasColourTag(tagsCsv) {
		if (!tagsCsv) return false;
		return tagsCsv.split(',').some(t => t.trim().toLowerCase().indexOf('colour-') === 0);
	}

	/* ---------- sibling fetch (cached) ---------- */

	function fetchSiblings(baseName) {
		if (siblingCache.has(baseName)) return siblingCache.get(baseName);

		const url = '/search/suggest.json'
			+ '?q=' + encodeURIComponent(baseName)
			+ '&resources[type]=product'
			+ '&resources[limit]=20'
			+ '&resources[options][unavailable_products]=last';

		const promise = fetch(url, { headers: { 'Accept': 'application/json' } })
			.then(r => r.ok ? r.json() : { resources: { results: { products: [] } } })
			.then(data => {
				const all = (data.resources && data.resources.results && data.resources.results.products) || [];
				const lcBase = baseName.toLowerCase();
				return all.filter(p => {
					const t = (p.title || '').toLowerCase();
					return t === lcBase || t.indexOf(lcBase + ' - ') === 0;
				});
			})
			.catch(() => []);

		siblingCache.set(baseName, promise);
		return promise;
	}

	/* ---------- swatch rendering ---------- */

	function buildSwatch(sibling, isActive, opts) {
		// sibling.colour, sibling.handle, sibling.title
		const colour = sibling.colour || '';
		const hex = hexFor(colour);
		if (!hex) return null;

		const btn = document.createElement('a');
		btn.className = 'aa-swatch' + (isActive ? ' aa-swatch--active' : '') + (isLightColour(colour) ? ' aa-swatch--light' : '');
		btn.href = '/products/' + sibling.handle;
		btn.setAttribute('data-tooltip', titleCase(colour));
		btn.setAttribute('aria-label', titleCase(colour));
		if (isActive) {
			btn.setAttribute('aria-current', 'true');
		}

		const dot = document.createElement('span');
		dot.className = 'aa-swatch__dot';
		dot.style.setProperty('--aa-swatch-color', hex);
		btn.appendChild(dot);

		// Allow card swatch clicks to skip the card-wide link bubble.
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			// Let the default <a> navigation happen.
		});

		return btn;
	}

	function renderSwatches(container, siblings, currentHandle, opts) {
		opts = opts || {};
		const colourMap = new Map(); // colour → sibling (first one wins, prefers exact-handle match)
		siblings.forEach(s => {
			const colour = extractColourFromTitle(s.title) || getColourFromTags((s.tags || []).join(','));
			if (!colour) return;
			const key = normaliseColourKey(colour);
			if (!hexFor(colour)) return; // skip unknown colours
			if (!colourMap.has(key)) {
				colourMap.set(key, { colour: colour, handle: s.handle, title: s.title });
			} else if (s.handle === currentHandle) {
				colourMap.set(key, { colour: colour, handle: s.handle, title: s.title });
			}
		});

		// Ensure the current product itself appears even if predictive-search
		// missed it (rare, but safe).
		const currentColour = opts.currentColour;
		if (currentColour && !colourMap.has(normaliseColourKey(currentColour)) && hexFor(currentColour)) {
			colourMap.set(normaliseColourKey(currentColour), {
				colour: currentColour,
				handle: currentHandle,
				title: ''
			});
		}

		if (colourMap.size === 0) {
			container.style.display = 'none';
			return;
		}

		const entries = Array.from(colourMap.values());
		const isCard = container.classList.contains('aa-colour-swatches--card');
		const limit = isCard ? CARD_SWATCH_LIMIT : entries.length;

		const frag = document.createDocumentFragment();
		let rendered = 0;
		for (let i = 0; i < entries.length && rendered < limit; i++) {
			const isActive = entries[i].handle === currentHandle;
			const node = buildSwatch(entries[i], isActive, opts);
			if (node) {
				frag.appendChild(node);
				rendered++;
			}
		}

		if (isCard && entries.length > limit) {
			const extra = document.createElement('span');
			extra.className = 'aa-swatch-more';
			extra.textContent = '+' + (entries.length - limit);
			frag.appendChild(extra);
		}

		container.innerHTML = '';
		container.appendChild(frag);
	}

	/* ---------- product page ---------- */

	function initProductPage() {
		const container = document.getElementById('colour-swatches-container');
		if (!container) return;

		const tagsCsv = container.dataset.productTags || '';
		if (!hasColourTag(tagsCsv)) {
			container.style.display = 'none';
			return;
		}

		const title = container.dataset.productTitle || '';
		const handle = container.dataset.productHandle || '';
		const baseName = extractBaseName(title);
		if (!baseName) {
			container.style.display = 'none';
			return;
		}

		const currentColour = extractColourFromTitle(title) || getColourFromTags(tagsCsv) || '';

		fetchSiblings(baseName).then(siblings => {
			renderSwatches(container, siblings, handle, { currentColour: currentColour });
		});
	}

	/* ---------- collection cards (lazy) ---------- */

	function loadCardSwatches(container) {
		const tagsCsv = container.dataset.productTags || '';
		if (!hasColourTag(tagsCsv)) {
			container.style.display = 'none';
			return;
		}
		const title = container.dataset.productTitle || '';
		const handle = container.dataset.productHandle || '';
		const baseName = extractBaseName(title);
		if (!baseName) {
			container.style.display = 'none';
			return;
		}
		const currentColour = extractColourFromTitle(title) || getColourFromTags(tagsCsv) || '';
		fetchSiblings(baseName).then(siblings => {
			renderSwatches(container, siblings, handle, { currentColour: currentColour });
		});
	}

	function initCardObserver() {
		const cards = document.querySelectorAll('[data-card-swatches]:not([data-card-swatches-init])');
		if (!cards.length) return;

		if (!('IntersectionObserver' in window)) {
			cards.forEach(el => {
				el.setAttribute('data-card-swatches-init', '1');
				loadCardSwatches(el);
			});
			return;
		}

		const observer = new IntersectionObserver(function (entries, obs) {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					obs.unobserve(entry.target);
					entry.target.setAttribute('data-card-swatches-init', '1');
					loadCardSwatches(entry.target);
				}
			});
		}, { rootMargin: '200px' });

		cards.forEach(el => observer.observe(el));
	}

	/* ---------- init ---------- */

	function init() {
		initProductPage();
		initCardObserver();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Re-scan when Shopify injects new sections in the theme editor or via
	// infinite-scroll/load-more pagination.
	document.addEventListener('shopify:section:load', initCardObserver);
	document.addEventListener('aa:cards:added', initCardObserver);
})();
