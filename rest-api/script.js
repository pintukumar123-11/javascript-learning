/**
 * FINAL UPDATED SCRIPT
 * Focus: Image reliability and proxy efficiency
 */

// We request specific fields to keep the data size small for proxies
const targetURL = "https://stg-huntswood-staging.kinsta.cloud/wp-json/wp/v2/white-papers/?_fields=id,title,content,jetpack_featured_media_url";

const grid = document.getElementById('whitepaper-grid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-button');

async function fetchWhitepapers() {
    // Show loading state
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div><p>Loading Content...</p></div>';

    const proxies = [
        url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    ];

    let lastError = null;

    for (const proxy of proxies) {
        try {
            const currentApiURL = proxy(targetURL);
            console.log("Attempting fetch with:", currentApiURL);

            const response = await fetch(currentApiURL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const dataRaw = await response.json();

            // Normalize data from different proxies
            let posts = dataRaw.contents ? JSON.parse(dataRaw.contents) : dataRaw;

            if (Array.isArray(posts)) {
                console.log("Success! Data received.");
                renderTiles(posts);
                return;
            }
        } catch (error) {
            console.warn("Proxy attempt failed, moving to next...", error);
            lastError = error;
        }
    }
    renderErrorState(lastError);
}

function renderTiles(posts) {
    grid.innerHTML = "";

    posts.forEach(post => {
        const tile = document.createElement('div');
        tile.className = 'tile';

        // IMAGE LOGIC: 
        // 1. Try Jetpack URL
        // 2. Fallback to a high-quality placeholder if the API has no image set
        let imageUrl = post.jetpack_featured_media_url;
        const fallbackImage = `https://placehold.co/600x400/2c3e50/ffffff?text=Whitepaper`;

        if (!imageUrl || imageUrl.trim() === "") {
            imageUrl = fallbackImage;
        }

        tile.innerHTML = `
            <div class="tile-image-wrapper">
                <img src="${imageUrl}" 
                     alt="${post.title.rendered}" 
                     loading="lazy"
                     onerror="this.onerror=null;this.src='${fallbackImage}';">
            </div>
            <div class="tile-details">
                <h3>${post.title.rendered}</h3>
                <p class="tile-cta">Click to read whitepaper</p>
            </div>
        `;

        tile.addEventListener('click', () => openModal(post, imageUrl));
        grid.appendChild(tile);
    });
}

function openModal(post, imageUrl) {
    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${imageUrl}" class="modal-hero-image" onerror="this.src='https://placehold.co/600x400?text=No+Image';">
            <h2>${post.title.rendered}</h2>
        </div>
        <div class="modal-text-content">
            <div class="content-body">${post.content.rendered}</div>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Stop background scroll
}

function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Close listeners
closeBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target == modal) closeModal(); };

function renderErrorState(err) {
    grid.innerHTML = `
        <div class="error-box">
            <h3>⚠️ Connection Issue</h3>
            <p>${err ? err.message : 'The API could not be reached.'}</p>
            <button onclick="location.reload()" class="retry-btn">Try Again</button>
        </div>`;
}

// Run the application
fetchWhitepapers();