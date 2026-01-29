# Whitepaper Gallery - REST API Integration

A premium, responsive web application that fetches whitepapers from a WordPress REST API and displays them in a modern grid layout with interactive details.

## 🚀 Tech Stack & Components

This project utilizes a modern web architecture to handle data fetching and visual presentation:

### 1. **Frontend (HTML5 / CSS3 / Vanilla JS)**
*   **HTML (`New-home.html`)**: Defines the semantic structure of the gallery, the grid container, and the modal dialog.
*   **CSS (`style.css`)**: 
    *   **Grid System**: Uses CSS Grid for a responsive, auto-filling layout.
    *   **Premium Aesthetics**: Includes glassmorphism effects (backdrop-filter), scale-up animations on hover, and smooth transitions.
    *   **Advanced UI**: Custom styling for the modal, hero images, and loading states.
*   **JavaScript (`script.js`)**: 
    *   **Asynchronous Fetching**: Uses `async/await` and the `Fetch API` to communicate with the server.
    *   **Dynamic Rendering**: Iterates through the API response to build DOM elements on the fly.
    *   **State Management**: Controls the opening/closing of the modal and handles the prevention of background scrolling.


### 3. **Data Source (WordPress REST API)**
*   **Endpoint**: `https://stg-huntswood-staging.kinsta.cloud/wp-json/wp/v2/white-papers/?_embed`
*   **Embedded Data**: The `?_embed` parameter is used to retrieve featured images and metadata in a single request, reducing network calls.

---

## 🛠️ How to Run Locally



#### **Option 1: PHP Command Line (Recommended)**
If you have PHP installed:
1. Open your terminal in the `rest-api` folder.
2. Run:
   ```powershell
   php -S localhost:8000
   ```
3. Open `http://localhost:8000/New-home.html` in your browser.

#### **Option 2: XAMPP / WAMP**
1. Copy the `rest-api` folder into your `htdocs` (XAMPP) or `www` (WAMP) folder.
2. Start the **Apache** server.
3. Visit `http://localhost/rest-api/New-home.html`.

---

## ⚠️ Troubleshooting


**Connection Blocked:**
If the gallery shows a "Data Loading Failed" message, check the browser console (F12). Ensure the PHP server is running and you are accessing the page via `http://localhost/...` rather than opening the file directly (file://...).
