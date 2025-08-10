# 🍜 Street Food Menu

A simple, lightweight **street food menu website** built with HTML, JavaScript, and JSON.  
Easily display and manage menu items for small food businesses, pop-ups, or personal projects.

---

## 📌 Features

- **Dynamic Menu Rendering**  
  Loads menu items from a JSON file (`menu.json`) and displays them using JavaScript.

- **No Frameworks Required**  
  100% vanilla HTML + JS for fast loading and easy customization.

- **Easy to Update**  
  Add, edit, or remove menu items just by editing a JSON file.

- **Beginner-Friendly**  
  Great for learning DOM manipulation and JSON handling.

---

## 📂 Project Structure

```
Street-Food-Menu/
├── index.html      # Main web page
├── app.js          # JavaScript logic for fetching and rendering menu
└── menu.json       # Menu data (name, description, price, etc.)
```

---

## 🚀 Installation & Usage

You can run this project **locally** without installing anything.

### 1. Clone the repository
```bash
git clone https://github.com/redhottomato/Street-Food-Menu.git
cd Street-Food-Menu
```

### 2. Open the website
Simply open `index.html` in your browser:
```bash
# On macOS/Linux
open index.html

# On Windows
start index.html
```

💡 **Tip:** For best results, run it using a local server (optional but recommended):

```bash
# Using Python
python -m http.server 8000

# Using Node.js with http-server
npm install -g http-server
http-server .
```
Then open `http://localhost:8000` in your browser.

---

## 📝 Customizing the Menu

Edit the `menu.json` file to update your menu items.

Example:
```json
[
  {
    "name": "Tacos",
    "description": "Spicy beef tacos with fresh salsa",
    "price": "$5"
  },
  {
    "name": "Falafel Wrap",
    "description": "Crispy falafel with tahini sauce",
    "price": "$4"
  }
]
```

When you reload the page, the menu will automatically update.

---

## 📸 Screenshots

*(Add screenshots of your menu here to show how it looks.)*

---

## 💡 Ideas for Improvement

- Add **search or filter** functionality (by category, price, etc.)
- Include **images** for each menu item
- Make it **mobile-friendly** with responsive styles
- Add **categories** (e.g., Breakfast, Lunch, Desserts)

---

## 🤝 Contributing

1. Fork this repository
2. Create a new branch (`feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌐 Live Demo

If you host the project (e.g., on GitHub Pages), add the link here:

**[Live Demo](https://your-username.github.io/Street-Food-Menu/)**

---

## 📖 Learn More

- [Vanilla JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JSON Guide](https://www.json.org/json-en.html)
