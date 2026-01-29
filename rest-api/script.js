// Fallback to public proxies for now since PHP is not setup
const targetURL = "https://stg-huntswood-staging.kinsta.cloud/wp-json/wp/v2/white-papers/?_embed";

const grid = document.getElementById('whitepaper-grid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-button');

// STEP 1: Fetch the Data with Public Proxy Fallback
async function fetchWhitepapers() {
    const proxies = [
        url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        url => `https://corsproxy.io/?${encodeURIComponent(url)}`
    ];

    let lastError = null;

    for (const proxy of proxies) {
        try {
            const currentApiURL = proxy(targetURL);
            console.log("Attempting fetch with public proxy:", currentApiURL);

            const response = await fetch(currentApiURL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const dataRaw = await response.json();

            // Handle different proxy response formats
            let posts;
            if (dataRaw.contents) {
                // allOrigins format
                posts = JSON.parse(dataRaw.contents);
            } else {
                // corsproxy.io directly returns the array
                posts = dataRaw;
            }

            console.log("Successfully fetched data via public proxy.");
            renderTiles(posts);
            return;

        } catch (error) {
            console.warn("Public proxy attempt failed, trying next...", error);
            lastError = error;
        }
    }

    console.error("All fetch attempts failed.");
    grid.innerHTML = `
        <div style="color: #666; padding: 40px; text-align: center; background: #fff1f1; border-radius: 12px; border: 1px solid #ffa3a3; max-width: 600px; margin: 0 auto;">
            <h3>⚠️ Connection Blocked</h3>
            <p>We couldn't reach the data. This usually happens if a browser extension or firewall is blocking the proxy.</p>
            <div style="text-align: left; background: #eee; padding: 10px; border-radius: 5px; margin: 15px 0;">
                <code style="font-size: 0.8em;">Error: ${lastError.message}</code>
            </div>
            <p><strong>Quick Fix:</strong> Try opening this in an <b>Incognito/Private Window</b> to bypass extension issues.</p>
            <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer; border-radius: 5px; border: none; background: #333; color: white;">Try Again</button>
        </div>
    `;
}

// STEP 2: Render Tiles
function renderTiles(posts) {
    if (!posts || !Array.isArray(posts)) {
        throw new Error("Invalid data format received");
    }

    grid.innerHTML = ""; // Clear existing content
    posts.forEach(post => {
        const tile = document.createElement('div');
        tile.className = 'tile';

        // Extract image from the embedded data
        let imageUrl = 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=2832&auto=format&fit=crop';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        }

        tile.innerHTML = `
            <div class="tile-image-wrapper">
                <img src="${imageUrl}" alt="${post.title.rendered}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            </div>
            <div class="tile-details">
                <h3>${post.title.rendered}</h3>
                <p>Click to read whitepaper</p>
            </div>
        `;

        tile.addEventListener('click', () => {
            openModal(post, imageUrl);
        });

        grid.appendChild(tile);
    });
}

// STEP 3: Open Modal Logic
function openModal(post, imageUrl) {
    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${imageUrl}" class="modal-hero-image">
            <h2>${post.title.rendered}</h2>
        </div>
        <div class="modal-text-content">
            <div class="content-body">${post.content.rendered}</div>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

// Close Modal logic
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

closeBtn.onclick = closeModal;
window.onclick = (event) => { if (event.target == modal) closeModal(); };

// Start the app
fetchWhitepapers();