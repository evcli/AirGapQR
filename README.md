# AirGapQR 🚀

**AirGapQR** is a premium, web-based tool for high-capacity, fully offline file/text transfers between devices. By unifying **Fountain (LT-Codes)** and **Sequential** algorithms into a single high-performance SPA, it provides the most robust and responsive cross-device transmission experience possible over pure visual light.

## 🔗 Try it Now
**[https://evcli.github.io/AirGapQR/](https://evcli.github.io/AirGapQR/)**

---

## ✨ Pro Features

- **SPA Dual-Engine Architecture**: Seamlessly hot-swap between **Fountain Mode** (Drop-loss resilient) and **Classic Mode** (Sequential simplicity) without reloading.
- **Infinite File Streams**: Powered by the Fountain internal engine, handle large files with zero frame-loss anxiety. 
- **Smart UX Feedback**: 
    - **Grid-Collapse**: In the receiver, completed rows automatically hide to reduce visual clutter.
    - **Row-Indexing**: Precise 1-referenced row labels (1, 21, 41...) for tracking progress.
    - **Defensive Preparation**: `Enter` key intelligence only triggers re-calculation when data (size/file/text) actually changes.
- **Full Privacy**: 100% Client-side processing. No server-side storage, no tracking, just local Gzip compression and QR block-gen.

## 🔗 URL Parameters (Deep Linking)

AirGapQR supports URL parameters for quick workflows, allowing you to create bookmarks or standard links:

- **`?mode=text`**: Directly opens the Sender in **Text Mode** and automatically focuses the text area so you can immediately `Ctrl+V` to paste.
- **`?text=YOUR_MESSAGE`**: Automatically switches to **Text Mode** and pre-fills the input box with the provided message.
- **`?mode=file`**: Directly opens the Sender in **File Mode**. *Note: Unlike the `F` keyboard shortcut, accessing via URL parameter will **not** automatically open the system file picker on page load. You will need to manually click the drop zone to select a file.*

## ⌨️ Pro Keyboard Shortcuts (Optimized)

AirGapQR is designed for power users who prefer the keyboard.

-   **`S / R`** : Switch Tab (**S**ender / **R**eceiver)
-   **`F / T`** : Switch Mode (**F**ile Mode / **T**ext Mode) - Automatically triggers file dialog or text focus.
-   **`Enter`** : **Prepare Beam**. Triggers metadata generation and enters the "Manifest View". Only active when configuration changes to prevent accidental restarts.
-   **`Space`** : **Play / Pause**. Toggle active QR transmission.
-   **`Escape`** : **Reset Everything**. Clears file state, UI, and memory for a fresh session.
-   **`Cmd + R`** : (Mac Only) Fully compatible. Modifiers are respected so you can refresh the page normally.

## 🛠 Project Structure

-   `index.html`: The unified UI entry point and state manager.
-   `lib/engine-fountain.js`: Core implementation of LT-Codes and PRNG.
-   `lib/engine-sequential.js`: Classic buffer-slice-index logic.
-   `lib/`: Offline dependencies (Tailwind, Pako, Html5Qrcode, QRious).

## 📊 Transmission Tip: QR Size vs Speed
-   **SPEED (FPS)**: Real-time sensitive. Adjusting the slider or typing a new value applies instantly during live transmission.
-   **QR SIZE (Density)**: Structural. Adjusting this requires a **Manual Re-Prepare** (Press `Enter` or `Prepare`) to re-calculate the segments.

---
*Created with focus on privacy and pixel-perfect UX.*
