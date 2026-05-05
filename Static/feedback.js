document.getElementById('feedbackForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  const form = this;
  const formData = new FormData(form);

  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Form submission failed with status: ' + response.status);
      }

      form.style.display = 'none';
      document.body.classList.add('feedback-submitted');
      const thankYou = document.getElementById('thankYou');
      thankYou.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch((error) => {
      console.error('Submission error:', error);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      alert('There was an error submitting your feedback. Please try again.');
    });
});
