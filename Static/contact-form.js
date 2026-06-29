// Contact form — conditional fields by request type + Web3Forms submission.
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var typeSelect = document.getElementById('cf-type');
  var conditionals = form.querySelectorAll('.cf-conditional');
  var subjectField = document.getElementById('cf-subject');
  var submitBtn = form.querySelector('.cf-submit');
  var errorBox = document.getElementById('cf-error');
  var thanks = document.getElementById('cf-thanks');

  // Human-readable subject prefix per type
  var SUBJECTS = {
    bug: '🐞 Bug Report',
    feature: '💡 Feature Request',
    account: '🙋 Account Support',
    general: '❓ General Question'
  };

  // Show only the block matching the chosen type; toggle `required` so hidden
  // fields never block submission.
  function applyType(type) {
    conditionals.forEach(function (block) {
      var match = block.getAttribute('data-type') === type;
      block.classList.toggle('is-active', match);

      block.querySelectorAll('[data-required]').forEach(function (field) {
        if (match) {
          field.setAttribute('required', '');
        } else {
          field.removeAttribute('required');
        }
      });
    });

    if (subjectField) {
      subjectField.value = SUBJECTS[type]
        ? 'Grace Journal · ' + SUBJECTS[type]
        : 'Grace Journal · Contact';
    }
  }

  typeSelect.addEventListener('change', function () {
    applyType(this.value);
  });

  // Initialise (covers a browser pre-selecting a value on reload)
  applyType(typeSelect.value);

  // Silently capture device/browser context for bug triage.
  var deviceField = document.getElementById('cf-device');
  if (deviceField) {
    deviceField.value = [
      'UA: ' + navigator.userAgent,
      'Viewport: ' + window.innerWidth + 'x' + window.innerHeight,
      'Screen: ' + (window.screen ? window.screen.width + 'x' + window.screen.height : 'n/a'),
      'Language: ' + (navigator.language || 'n/a')
    ].join(' | ');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (errorBox) errorBox.classList.remove('is-active');

    if (!form.reportValidity()) return;

    var original = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Status ' + res.status);
        form.style.display = 'none';
        if (thanks) thanks.classList.add('is-active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(function (err) {
        console.error('Contact submission error:', err);
        submitBtn.textContent = original;
        submitBtn.disabled = false;
        if (errorBox) errorBox.classList.add('is-active');
      });
  });
})();
