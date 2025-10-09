    document.addEventListener('DOMContentLoaded', () => {
      // --- Film viewer ---
      const filmMain = document.getElementById('film-main');
      const filmThumbs = document.querySelectorAll('.film-thumbnails img');
      const filmPrev = document.querySelector('.film-prev');
      const filmNext = document.querySelector('.film-next');
      const filmCaption = document.getElementById('film-main-caption');
      let filmIndex = 0;

      function showFilm(index) {
        const thumb = filmThumbs[index];
        filmMain.src = thumb.dataset.src;
        filmCaption.textContent = thumb.dataset.caption || "";
        filmIndex = index;
        filmThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      }

      if (filmThumbs.length > 0) {
        filmPrev.addEventListener('click', () => {
          showFilm((filmIndex - 1 + filmThumbs.length) % filmThumbs.length);
        });
        filmNext.addEventListener('click', () => {
          showFilm((filmIndex + 1) % filmThumbs.length);
        });
        filmThumbs.forEach((thumb, i) => {
          thumb.addEventListener('click', () => showFilm(i));
        });
        showFilm(0); // init
      }

      // --- Image viewer ---
      const imgMain = document.getElementById('image-main');
      const imgThumbs = document.querySelectorAll('.image-thumbnails img');
      const imgPrev = document.querySelector('.img-prev');
      const imgNext = document.querySelector('.img-next');
      const imgCaption = document.getElementById('work-main-caption');

      // Dialog for enlarged image
      const dialog = document.getElementById('imageDialog');
      const dialogImage = document.getElementById('dialog-image');

      let imgIndex = 0;
      let scale = 1; 
      let startDistance = 0; 
      let posX = 0, posY = 0; // current pan
      let startX = 0, startY = 0; // drag start
      

      function showImage(index) {
        const thumb = imgThumbs[index];
        const source = thumb.dataset.src || thumb.src;
        imgMain.src = thumb.dataset.src || thumb.src;
        imgCaption.textContent = thumb.dataset.caption || "";
        imgIndex = index;
        imgThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // sync dialog image
        dialogImage.src = thumb.src;
      }

      function resetTransform() {
        scale = 1;
        posX = 0;
        posY = 0;
        dialogImage.style.transform = "translate(0, 0) scale(1)";
      }

      function updateTransform() {
        dialogImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
      }

      if (imgThumbs.length > 0) {
        imgPrev.addEventListener('click', () => {
          showImage((imgIndex - 1 + imgThumbs.length) % imgThumbs.length);
        });
        imgNext.addEventListener('click', () => {
          showImage((imgIndex + 1) % imgThumbs.length);
        });
        imgThumbs.forEach((thumb, i) => {
          thumb.addEventListener('click', () => showImage(i));
        });

        // enlarge main image
        imgMain.addEventListener('click', () => {
          dialogImage.src = imgMain.src;
          dialog.showModal();
          resetTransform();          
        });

        // click dialog image to close if not zoomed
        dialogImage.addEventListener('dblclick', () => {
          dialog.close();
        });

        // close dialog if clicking outside
        dialog.addEventListener('click', e => {
          if (e.target === dialog) dialog.close();
        });


      // === Zoom with mouse wheel ===
        dialogImage.addEventListener("wheel", (e) => {
          e.preventDefault();
          if (e.deltaY < 0) {
            scale *= 1.1; 
          } else {
            scale /= 1.1; 
          }
          updateTransform();
        });

        // === Zoom with pinch (touch events) ===
        dialogImage.addEventListener("touchstart", (e) => {
          if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            startDistance = Math.sqrt(dx * dx + dy * dy);
          } else if (e.touches.length === 1) {
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
          }
        });

        dialogImage.addEventListener("touchmove", (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDistance = Math.sqrt(dx * dx + dy * dy);

            if (startDistance > 0) {
              const zoomFactor = newDistance / startDistance;
              scale *= zoomFactor;
              updateTransform();
              startDistance = newDistance; 
            }
          } else if (e.touches.length === 1) {
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
            updateTransform();
          }
        });

        dialogImage.addEventListener("touchend", () => {
          if (event.touches.length < 2) startDistance = 0;
        });

        // === Drag to pan (desktop mouse) ===
        let isDragging = false;

        dialogImage.addEventListener("mousedown", (e) => {
          isDragging = true;
          startX = e.clientX - posX;
          startY = e.clientY - posY;
          e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
          if (isDragging) {
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            updateTransform();
          }
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
        });
              


        showImage(0); // init
      }
    });


