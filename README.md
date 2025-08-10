
```markdown
# 🎵 Offline Music Player Website

This project is a **self-hostable, offline-capable music player** built with **HTML, CSS, and JavaScript**.  
It allows you to:

- Play local MP3 files with a nice web interface
- Display track **title**, **artist**, and **cover art**
- Load track info from a simple JSON file (`service/music.json`)
- Run **entirely offline** in **Termux** or any local environment
- Host on **GitHub Pages** for easy sharing (then clone in Termux)

---

## 📂 Project Structure


/
├── index.html          # Main HTML page
├── style.css           # Styling for the music player
├── script.js           # All JavaScript logic
├── /music              # MP3 files
├── /cover              # Album cover images (optional)
├── /service
│    └── music.json     # Metadata for your tracks
└── README.md           # This file
````

---

## ⚙️ Setup

### 1️⃣ Clone this repository
If you have **Git**:
```bash
git clone https://github.com/CufoTv/Spotify-0.5.git
cd Spotify-0.5
````

---

### 2️⃣ Add your music

Place `.mp3` files into the `/music` folder.

Example:

```
music/
 ├── song1.mp3
 ├── song2.mp3
 └── my_favorite_song.mp3
```

---

### 3️⃣ Add cover images (optional)

Place `.jpg` or `.png` files into `/cover`.
The **file name must match the MP3 file name** (without extension) or be defined in `music.json`.

Example:

```
cover/
 ├── song1.jpg
 ├── song2.png
 └── my_favorite_song.jpg
```

---

### 4️⃣ Create `music.json`

Inside the `/service` folder, create a file named `music.json`.

**Example `music.json`:**

```json
[
  {
    "file": "song1.mp3",
    "title": "First Song",
    "artist": "Artist One",
    "cover": "cover/song1.jpg"
  },
  {
    "file": "song2.mp3",
    "title": "Second Song",
    "artist": "Artist Two",
    "cover": "cover/song2.png"
  },
  {
    "file": "my_favorite_song.mp3",
    "title": "My Favorite Song",
    "artist": "Unknown"
  }
]
```

> If `cover` is not given, the script will automatically look for `cover/[filename].jpg` and `cover/[filename].png`.

---

## 💻 Running the Website

### **Option 1 — GitHub Pages**

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Deploy from branch**.
3. Select `main` (or your branch) and `/ (root)`.
4. Open the given URL to use your music player.

---

### **Option 2 — Termux (Offline Only)**

This will let you run the player **without internet**:

1. Install Termux from [F-Droid](https://f-droid.org/en/packages/com.termux/).
2. Install `git` and `python`:

   ```bash
   pkg update
   pkg install git python
   ```
3. Clone the repo:

   ```bash
   git clone https://github.com/CufoTv/Spotify-0.5.git
   cd Spotify-0.5
   ```
4. Start a local web server:

   ```bash
   python3 -m http.server 8080
   ```
5. Open your browser and go to:

   ```
   http://localhost:8080
   ```

Now you can use the music player **completely offline**.

---

## 🎯 Features

* ✅ **Offline support** — works without internet once cloned
* ✅ **Dynamic playlist** from `music.json`
* ✅ **Album covers** via `/cover` folder
* ✅ **Shuffle & Repeat** buttons
* ✅ **Progress seek bar** with current/duration time
* ✅ **Local storage** remembers your last played song

---

## 📜 License

You are free to use, modify, and share this project.
Attribution is appreciated but not required.

---

## 📌 Tips

* Keep file names **simple** (no spaces, special characters) for maximum compatibility.
* For better offline experience, download this repo entirely instead of just opening in the browser.
* If songs do not load, check browser console for errors (F12 → Console).

---

**Enjoy your offline music player!** 🎶
