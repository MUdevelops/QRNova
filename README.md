<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=gradient&customColorList=6,12,18&text=QRNova&fontSize=72&fontColor=ffffff&fontAlignY=38&animation=twinkling&desc=Create.%20Scan.%20Connect.&descSize=22&descAlignY=60" alt="QRNova banner" width="100%">

<a href="https://qrcode-nova.netlify.app">
  <img src="https://readme-typing-svg.demolab.com?font=Sora&weight=600&size=24&duration=3000&pause=900&color=7B3FF2&center=true&vCenter=true&width=640&lines=Free+QR+code+generator;Link+%E2%86%92+QR+in+one+click;Text+%E2%86%92+QR+instantly;Image+%E2%86%92+QR+with+a+shareable+link;Download+as+PNG+or+SVG" alt="Typing animation">
</a>

<br>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-qrcode--nova.netlify.app-7B3FF2?style=for-the-badge&logo=netlify&logoColor=white)](https://qrcode-nova.netlify.app)
[![Watch Demo](https://img.shields.io/badge/Watch-Video%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/GaBfLg3NSpk)
[![GitHub Stars](https://img.shields.io/github/stars/MUdevelops/QRNova?style=for-the-badge&logo=github&color=FF5CA8)](https://github.com/MUdevelops/QRNova/stargazers)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)

</div>

---

## 🎬 Video Demo

<div align="center">

[![QRNova video demo](https://img.youtube.com/vi/GaBfLg3NSpk/maxresdefault.jpg)](https://youtu.be/GaBfLg3NSpk)

▶️ **Click the thumbnail to watch the full walkthrough**

</div>

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔗 | **Link to QR** | Paste any web address and get a scannable code |
| 📝 | **Text to QR** | Notes, Wi-Fi details, phone numbers, anything |
| 🖼️ | **Image to QR** | Upload a picture; scanning the code opens it |
| 🎨 | **Custom style** | Pick code color, background and dot shape |
| 🛡️ | **Error correction** | Low, Medium, Quartile or High |
| ⬇️ | **Export** | Download high-resolution PNG or vector SVG |
| ⚡ | **Instant preview** | The code updates live as you type |
| 🌗 | **Light and dark** | Follows your device theme, works on phones |
| 🆓 | **Free** | No sign-up, no watermark |

---

## 📸 Screenshots

<div align="center">

### 🏠 Home
<img src="docs/screenshots/home.png" alt="QRNova home screen" width="85%">

<br><br>

### 🔗 Link to QR
<img src="docs/screenshots/link.png" alt="Link to QR" width="85%">

<br><br>

### 🖼️ Image to QR
<img src="docs/screenshots/image.png" alt="Image to QR" width="85%">

<br><br>

### 📱 Mobile view
<img src="docs/screenshots/mobile.png" alt="QRNova on mobile" width="30%">

</div>

> Put your screenshots in `docs/screenshots/` with the file names above.

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/MUdevelops/QRNova.git
cd QRNova

# 2. Install dependencies (needed for the Image tab functions)
npm install

# 3. Run locally with Netlify's dev server
npx netlify-cli dev
```

Open the local address shown in the terminal. Link and Text codes work on any static server. The Image tab needs `netlify dev` or a deployed site.

---

## ☁️ Deploy to Netlify

1. Push the project to your own GitHub repo.
2. In Netlify choose **Add new project → Import an existing project** and pick the repo.
3. Leave the build command empty. `netlify.toml` already sets the publish and functions folders.
4. Click **Deploy**.

---

## ⚙️ How It Works

```mermaid
flowchart LR
    A[Link or Text] --> B[Browser generates QR]
    C[Image] --> D[Browser resizes image]
    D --> E[/api/upload function/]
    E --> F[(Netlify Blobs)]
    F --> G[Short image link]
    G --> B
    B --> H[Download PNG or SVG]
```

- **Link and Text:** generated entirely in your browser. Nothing is sent to a server.
- **Image:** the image is shrunk in the browser, stored with a Netlify Function in Netlify Blobs, and the QR code points to `/i/<id>`.

---

## 📁 Project Structure

```
QRNova/
├── public/
│   ├── index.html        # App markup
│   ├── style.css         # Styling, light and dark themes
│   ├── app.js            # QR generation, export, image upload
│   ├── favicon.svg
│   └── assets/logo.svg
├── netlify/functions/
│   ├── upload.mjs        # POST /api/upload
│   └── image.mjs         # GET /i/:id
├── netlify.toml
└── package.json
```

---

## 🛠️ Built With

- **Frontend:** HTML, CSS, vanilla JavaScript
- **QR engine:** [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)
- **Backend:** Netlify Functions + Netlify Blobs
- **Hosting:** Netlify

---

## 🗺️ Roadmap

- [ ] Logo in the center of the QR code
- [ ] Wi-Fi, vCard and email QR templates
- [ ] Image expiry and rate limiting
- [ ] Scan analytics

---

## 🤝 Contributing

Ideas and pull requests are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-idea`
3. Commit your changes and push
4. Open a pull request

---

## 👤 Author

**MUdevelops**

[![GitHub](https://img.shields.io/badge/GitHub-MUdevelops-181717?style=flat-square&logo=github)](https://github.com/MUdevelops)

<div align="center">

⭐ **If QRNova helped you, give the repo a star!** ⭐

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&color=gradient&customColorList=6,12,18&section=footer" alt="footer wave" width="100%">

</div>
