# Early Distress Support App

A compassionate, privacy-focused Progressive Web App (PWA) designed to support early-career professionals facing emotional distress. The app provides immediate tools for stress relief, mood tracking, AI-guided support, and crisis resources.

## 🌟 Features

- **Daily Check-In:** Track your mood and stress levels to monitor your well-being over time.
- **Stress Relief Exercises:** guided tools including:
  - Box Breathing
  - Progressive Muscle Relaxation
  - 5-4-3-2-1 Grounding Technique
  - Body Scan Meditation
- **AI Support Chat:** A safe, judgment-free space to vent and explore feelings (simulation).
- **Crisis Support:** One-tap access to major helplines (AASRA, Vandrevala, iCall).
- **PWA Support:** Installable on mobile and desktop for offline access.
- **Privacy First:** All data is stored locally in your browser (`localStorage`). No external servers track your personal data.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 7
- **Styling:** Vanilla CSS (Responsive, Dark Mode support)
- **Routing:** React Router DOM v6+
- **Icons:** React Icons
- **State Management:** React Hooks + LocalStorage

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PR2309/Protoverse.git
    cd Protoverse/protoverse-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
protoverse-app/
├── public/              # Static assets (icons, manifest, sitemap)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── exercises/   # Breathing & grounding exercises
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── utils/           # Helper functions (storage, dates)
│   ├── App.jsx          # Main application & Routing
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   └── InfoPages.jsx    # Static content pages
├── .gitignore
├── package.json
├── vite.config.js       # Vite configuration
└── README.md
```

## 🤝 Contributing

This project was built for the Smart India Hackathon (SIH) to address mental health challenges. Contributions are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.