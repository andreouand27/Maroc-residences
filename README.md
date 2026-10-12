# Maroc Residences

A one-screen presentation for **Alba Residences by Maroc**: eight one and two-bedroom apartments in Archangelos, Nicosia, Cyprus.

Open `index.html` through any static web server (for example `python3 -m http.server`) and move through the seven slides:

| Action | Keys | Touch |
| --- | --- | --- |
| Next slide | Space, Enter, → | Tap, or swipe left/up |
| Previous slide | Backspace, Shift+Space, ← | Tap the left edge, or swipe right/down |
| First / last slide | Home / End | |

Transitions are drawn with WebGL: a camera push-through with zoom motion blur, lens warp, a bloom flash and a light leak, plus film grain and a slow drift on every photo. Going back plays the same move in reverse. If WebGL is unavailable (or the file is opened straight from disk), a CSS version of the same camera move is used. Visitors who ask their system for reduced motion get plain cross-fades.

All images in `images/` are architectural renders.
