# Kalorie Tracker

En strengt modulær full-stack webapp til kalorie-tracking inspireret af MyFitnessPal.

## 🏗️ Arkitektur

### Backend (Flask + SQLite)
- **Entrypoint**: `backend/app.py`
- **Routes**: Modulære route handlers i `/routes`
- **Services**: Forretningslogik i `/services`
- **Models**: Database ORM-modeller i `/db/models`

### Frontend (Vanilla JS + ES6 Modules)
- **UI Components**: Modulære UI-komponenter i `/src/ui`
- **Data Layer**: API og WebSocket services i `/src/data`
- **State Management**: Centraliseret app state i `/src/state`
- **Styles**: Modulære CSS filer i `/styles`

## 🎨 Design

Blackmagic Design Fusion-inspireret dark UI med:
- Glassmorphism-effekter
- Cirkulære gauges for næringsstoffer
- Responsivt grid-layout
- Micro-interactions og smooth transitions

## 📋 Funktionalitet

- **Fødevare-database** med 19 næringsstoffer pr. 100g
- **Dagbog** med automatisk næringsberegning
- **Motion tracking** for kalorieforbrænding
- **Vægt tracking** med progress visualisering
- **Mål tracking** for kalorier og makroer
- **Dashboard** med cirkulære gauges
- **Multi-screen flow** til fødevare-tilføjelse

## 🚀 Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Filstruktur

```
calorie-tracker/
├── backend/
│   ├── app.py                 # Flask entrypoint
│   ├── routes/               # HTTP route handlers
│   ├── services/             # Forretningslogik
│   └── db/                   # Database modeller
├── frontend/
│   ├── index.html            # Main HTML
│   ├── src/
│   │   ├── ui/              # UI komponenter
│   │   ├── data/            # API & WebSocket
│   │   ├── state/           # State management
│   │   └── utils/           # Utility funktioner
│   └── styles/              # CSS moduler
└── README.md
```

## 🔧 Modularitet

- **Single Responsibility**: Hver fil har ét klart ansvar
- **Max 200 linjer**: Split i mindre moduler hvis nødvendigt
- **Ingen inline**: Ingen inline CSS, JS eller HTML-styles
- **ES6 Modules**: Kun import/export i frontend
- **Rene Python imports**: I backend

## 🎯 Implementation Flow

1. **Først**: Foreslå filstruktur + tomme stubfiler
2. **Derefter**: Implementer ét modul ad gangen
3. **Aldrig**: Skriv hele projektet på én gang

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 1024px
- Touch-friendly interfaces
- Keyboard navigation support

## 🎨 UI Komponenter

- **Dashboard**: Cirkulære gauges, progress bars
- **Food Form**: Søgning, valg, næringsvisning
- **Diary**: Fødevare-liste, næringsberegning
- **Exercise**: Motion tracking, kalorieberegning
- **Weight**: Vægt-historie, progress chart
- **Goals**: Mål-indstillinger, progress tracking
