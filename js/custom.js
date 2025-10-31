// Autoplay BGM với fallback cho chính sách chặn của trình duyệt
(function () {
  var audio = document.getElementById('bgmMusic');
  if (audio) {
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');

    function tryPlay() {
      return audio.play().catch(function () {
        audio.muted = true;
        return audio.play().then(function () {
          setTimeout(function () {
            try { audio.muted = false; } catch (e) {}
          }, 800);
        });
      });
    }

    function onFirstInteract() {
      audio.muted = false;
      tryPlay().finally(detachInteracts);
    }

    function attachInteracts() {
      ['click', 'touchstart', 'keydown'].forEach(function (ev) {
        window.addEventListener(ev, onFirstInteract, { once: true, passive: true });
      });
    }

    function detachInteracts() {
      ['click', 'touchstart', 'keydown'].forEach(function (ev) {
        window.removeEventListener(ev, onFirstInteract);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { tryPlay().catch(attachInteracts); });
    } else {
      tryPlay().catch(attachInteracts);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && audio.paused) {
        tryPlay().catch(function(){});
      }
    });
  }

  function bindListenButton() {
    var btn = document.getElementById('listenButton');
    if (!btn) return;
    var url = 'https://docs.google.com/document/d/13auJHxxixMRu0j7xqJ_vDad1FQli6j4QOsUOJTXjmFM/edit?tab=t.0#heading=h.f3jubab8yu2e';
    btn.addEventListener('click', function () {
      var w = window.open(url, '_blank', 'noopener');
      if (w) {
        try { w.opener = null; } catch (e) {}
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindListenButton);
  } else {
    bindListenButton();
  }
})();
