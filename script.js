const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('details').forEach((item) => {
  item.addEventListener('toggle', () => {
    const symbol = item.querySelector('summary b');
    if (symbol) symbol.textContent = item.open ? '-' : '+';
  });
});

const heroSlider = document.querySelector('[data-hero-slider]');

if (heroSlider) {
  const slides = Array.from(heroSlider.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(heroSlider.querySelectorAll('[data-hero-dot]'));
  const previousButton = heroSlider.querySelector('.slider-arrow.prev');
  const nextButton = heroSlider.querySelector('.slider-arrow.next');
  let currentSlide = 0;
  let autoPlayTimer;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentSlide;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const stopAutoPlay = () => window.clearInterval(autoPlayTimer);
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = window.setInterval(() => showSlide(currentSlide + 1), 6500);
  };

  previousButton?.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    startAutoPlay();
  });

  nextButton?.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoPlay();
    });
  });

  heroSlider.addEventListener('mouseenter', stopAutoPlay);
  heroSlider.addEventListener('mouseleave', startAutoPlay);
  heroSlider.addEventListener('focusin', stopAutoPlay);
  heroSlider.addEventListener('focusout', startAutoPlay);

  showSlide(0);
  startAutoPlay();
}

document.querySelectorAll('[data-card-link]').forEach((card) => {
  const target = card.dataset.cardLink;
  if (!target) return;

  const openTarget = () => {
    window.location.href = target;
  };

  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    openTarget();
  });

  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target.closest('a, button')) return;
    event.preventDefault();
    openTarget();
  });
});

document.querySelectorAll('.product-media').forEach((gallery) => {
  const mainMedia = gallery.querySelector('[data-product-main-media]');
  const buttons = Array.from(gallery.querySelectorAll('[data-product-media]'));

  if (!mainMedia || !buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.productMedia;
      const src = button.dataset.src;
      const poster = button.dataset.poster;
      const alt = button.dataset.alt || '';

      if (!src) return;

      mainMedia.replaceChildren();

      if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        if (poster) video.poster = poster;
        video.setAttribute('aria-label', alt);
        mainMedia.append(video);
      } else {
        const image = document.createElement('img');
        image.src = src;
        image.alt = alt;
        mainMedia.append(image);
      }

      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
    });
  });
});

const currentPath = window.location.pathname;
let whatsappMessage = 'I am interested in TapLoop products.';

if (currentPath.endsWith('/pvc-nfc-business-card.html')) {
  whatsappMessage = 'I am interested in the TapLoop PVC Digital NFC Card.';
}

if (currentPath.endsWith('/metal-nfc-business-card.html')) {
  whatsappMessage = 'I am interested in the TapLoop Metal NFC Card.';
}

if (currentPath.endsWith('/for-teams.html')) {
  whatsappMessage = 'I am interested in TapLoop NFC cards for my team.';
}

const whatsappUrl = `https://wa.me/526643053834?text=${encodeURIComponent(whatsappMessage)}`;
const supabaseRestUrl = 'https://ejhkjyofrazyxtxkohfo.supabase.co/rest/v1/quote_requests';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqaGtqeW9mcmF6eXh0eGtvaGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Mjg1MjMsImV4cCI6MjA4NzMwNDUyM30.MsYH7bPlJdjJelexsJn_4mLvWu3NMUCTt6mcgn08dZ8';
const emailJsApiUrl = 'https://api.emailjs.com/api/v1.0/email/send';
const emailJsServiceId = 'service_gshjpyg';
const emailJsTemplateId = 'template_y4y0gl8';
const emailJsPublicKey = '5vTFdcXJ0G3y7ZaPs';

const proposalOptions = [
  { value: 'pvc', label: 'PVC Digital NFC Card', icon: 'fa-solid fa-id-card' },
  { value: 'metal', label: 'Metal NFC Card', icon: 'fa-regular fa-gem' },
  { value: 'both', label: 'PVC and Metal Cards', icon: 'fa-solid fa-layer-group' },
  { value: 'team', label: 'NFC Cards for My Team', icon: 'fa-solid fa-users' },
  { value: 'guidance', label: 'I Need Help Choosing', icon: 'fa-solid fa-comments' },
];

const proposalModalState = {
  selectedSolution: 'guidance',
  selectedQuantity: '1',
};

const getPageSolution = () => {
  const path = currentPath;
  if (path.endsWith('/pvc-nfc-business-card.html')) return 'pvc';
  if (path.endsWith('/metal-nfc-business-card.html')) return 'metal';
  if (path.endsWith('/for-teams.html')) return 'team';
  return 'guidance';
};

const getSolutionFromTrigger = (trigger) => {
  const text = `${trigger?.textContent || ''} ${trigger?.getAttribute('aria-label') || ''}`.toLowerCase();
  const card = trigger?.closest('article, .solution-card, .cards-catalog-item');
  const cardText = card?.textContent?.toLowerCase() || '';
  const combined = `${text} ${cardText}`;

  if (combined.includes('metal') || combined.includes('premium')) return 'metal';
  if (combined.includes('pvc')) return 'pvc';
  if (combined.includes('team') || combined.includes('employee') || combined.includes('company')) return 'team';
  return getPageSolution();
};

const getDeviceType = () => {
  if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth <= 900) return 'mobile';
  if (window.innerWidth <= 1024) return 'tablet';
  return 'desktop';
};

const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  const utms = {};

  params.forEach((value, key) => {
    if (key.toLowerCase().startsWith('utm_')) {
      utms[key] = value;
    }
  });

  return utms;
};

const getProposalMetadata = (triggerLabel) => ({
  page: document.title,
  pageUrl: window.location.href,
  sourcePath: window.location.pathname,
  triggerButton: triggerLabel,
  productSelected: proposalOptions.find((option) => option.value === proposalModalState.selectedSolution)?.label || '',
  submittedAt: new Date().toISOString(),
  utm: getUtmParams(),
  referrer: document.referrer || '',
  device: getDeviceType(),
  userAgent: navigator.userAgent,
});

const createProposalModal = () => {
  const modal = document.createElement('div');
  modal.className = 'proposal-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="proposal-modal__overlay" data-proposal-close></div>
    <div class="proposal-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="proposal-modal-title">
      <button class="proposal-modal__close" type="button" data-proposal-close aria-label="Close proposal form">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>

      <div class="proposal-form__loading" data-proposal-loading hidden aria-live="polite" aria-label="Submitting request">
        <span aria-hidden="true"></span>
        <p>Sending your request...</p>
      </div>

      <form class="proposal-form" data-proposal-form>
        <div class="proposal-form__intro">
          <img class="proposal-form__logo" src="assets/images/taploop-logo.png" alt="TapLoop" loading="lazy" decoding="async">
          <h2 id="proposal-modal-title">Request Your Quote</h2>
          <p>Tell us what you need and we will prepare a custom TapLoop recommendation.</p>
        </div>

        <div class="proposal-form__grid">
          <label class="proposal-field">
            <span>Solution type <b aria-hidden="true">*</b></span>
            <select name="solution" required>
              <option value="pvc">PVC Digital NFC Card</option>
              <option value="metal">Metal NFC Card</option>
              <option value="both">PVC and Metal Cards</option>
              <option value="team">Team Rollout</option>
              <option value="guidance">Help Me Choose</option>
            </select>
          </label>

          <label class="proposal-field">
            <span>Approximate quantity <b aria-hidden="true">*</b></span>
            <input type="number" name="quantity" min="1" step="1" inputmode="numeric" required>
          </label>

          <label class="proposal-field">
            <span>Full name <b aria-hidden="true">*</b></span>
            <input type="text" name="fullName" autocomplete="name" required>
          </label>

          <label class="proposal-field">
            <span>Company <small>optional</small></span>
            <input type="text" name="company" autocomplete="organization">
          </label>

          <label class="proposal-field">
            <span>Phone <small>optional</small></span>
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel">
          </label>

          <label class="proposal-field">
            <span>Email <b aria-hidden="true">*</b></span>
            <input type="email" name="email" autocomplete="email" required>
          </label>

          <label class="proposal-field proposal-field--wide">
            <span>Briefly tell us what you have in mind <small>optional</small></span>
            <textarea name="comments" rows="4" placeholder="Example: We need 25 NFC cards for our sales team with one profile per employee."></textarea>
          </label>
        </div>

        <input type="hidden" name="metadata" data-proposal-metadata>

        <div class="proposal-form__actions">
          <button class="btn btn-primary" type="submit">
            <i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Request
          </button>
        </div>
        <p class="proposal-form__error" data-proposal-error hidden>We could not send your request. Please try again.</p>
        <p class="proposal-form__note">We will contact you to confirm details and prepare your quote. No commitment.</p>
      </form>
    </div>
  `;

  document.body.append(modal);
  return modal;
};

const createProposalConfirmationModal = () => {
  const modal = document.createElement('div');
  modal.className = 'proposal-modal proposal-confirmation-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="proposal-modal__overlay" data-confirmation-close></div>
    <div class="proposal-modal__dialog proposal-modal__dialog--confirmation" role="dialog" aria-modal="true" aria-labelledby="proposal-confirmation-title">
      <button class="proposal-modal__close" type="button" data-confirmation-close aria-label="Close confirmation">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>

      <div class="proposal-confirmation">
        <span class="proposal-confirmation__icon"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
        <h2 id="proposal-confirmation-title">We Received Your Request</h2>
        <p>Our team will review your information and contact you to prepare a custom proposal.</p>
        <p>You can also send your logo or visual references through WhatsApp to move faster.</p>
        <div class="proposal-confirmation__actions">
          <a class="btn btn-primary" data-proposal-confirm-whatsapp target="_blank" rel="noopener noreferrer" href="${whatsappUrl}">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Continue on WhatsApp
          </a>
          <button class="btn btn-outline" type="button" data-confirmation-close>Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.append(modal);
  return modal;
};

const proposalModal = createProposalModal();
const proposalConfirmationModal = createProposalConfirmationModal();
const proposalForm = proposalModal.querySelector('[data-proposal-form]');
const proposalSubmitButton = proposalForm.querySelector('button[type="submit"]');
const proposalError = proposalModal.querySelector('[data-proposal-error]');
const proposalLoading = proposalModal.querySelector('[data-proposal-loading]');
const proposalMetadataInput = proposalModal.querySelector('[data-proposal-metadata]');
const proposalWhatsappLinks = proposalConfirmationModal.querySelectorAll('[data-proposal-confirm-whatsapp]');
let lastFocusedElement = null;
let proposalTriggerLabel = '';

const updateProposalSelection = (groupName, value) => {
  const input = proposalModal.querySelector(`[name="${groupName}"]`);
  if (!input) return;
  input.value = value;

  if (groupName === 'solution') proposalModalState.selectedSolution = input.value;
  if (groupName === 'quantity') proposalModalState.selectedQuantity = input.value;
};

const getProposalWhatsappUrl = () => {
  const solution = proposalOptions.find((option) => option.value === proposalModalState.selectedSolution)?.label || 'NFC cards';
  const message = `Hi, I would like a custom TapLoop quote. Solution: ${solution}. Approximate quantity: ${proposalModalState.selectedQuantity}.`;

  return `https://wa.me/526643053834?text=${encodeURIComponent(message)}`;
};

const refreshProposalMetadata = () => {
  const metadata = getProposalMetadata(proposalTriggerLabel);
  proposalMetadataInput.value = JSON.stringify(metadata);
  proposalWhatsappLinks.forEach((link) => {
    link.href = getProposalWhatsappUrl();
  });
};

const getOptionalValue = (formData, key) => {
  const value = String(formData.get(key) || '').trim();
  return value || null;
};

const createQuoteRequestPayload = (formData) => ({
  solution_type: String(formData.get('solution') || '').trim(),
  approximate_quantity: Number.parseInt(String(formData.get('quantity') || ''), 10),
  full_name: String(formData.get('fullName') || '').trim(),
  company: getOptionalValue(formData, 'company'),
  phone: getOptionalValue(formData, 'phone'),
  email: String(formData.get('email') || '').trim(),
  message: getOptionalValue(formData, 'comments'),
});

const createEmailJsParams = (quoteRequest) => {
  const product = proposalOptions.find((option) => option.value === quoteRequest.solution_type)?.label || quoteRequest.solution_type;
  const description = quoteRequest.message || 'No additional description.';
  const company = quoteRequest.company || 'No company';
  const phone = quoteRequest.phone || 'No phone';

  return {
    title: 'New TapLoop quote request',
    name: quoteRequest.full_name,
    nombre: quoteRequest.full_name,
    empresa: company,
    email: quoteRequest.email,
    correo: quoteRequest.email,
    telefono: phone,
    producto: product,
    cantidad: String(quoteRequest.approximate_quantity),
    entrega: 'To be confirmed',
    descripcion: description,
    message: description,
  };
};

const submitQuoteRequest = async (quoteRequest) => {
  const response = await fetch(supabaseRestUrl, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(quoteRequest),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Supabase responded with status ${response.status}`);
  }
};

const sendQuoteRequestEmail = async (quoteRequest) => {
  const response = await fetch(emailJsApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: emailJsServiceId,
      template_id: emailJsTemplateId,
      user_id: emailJsPublicKey,
      template_params: createEmailJsParams(quoteRequest),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `EmailJS responded with status ${response.status}`);
  }
};

const setProposalLoading = (isLoading) => {
  proposalModal.querySelector('.proposal-modal__dialog')?.classList.toggle('is-loading', isLoading);
  proposalSubmitButton.disabled = isLoading;
  proposalSubmitButton.setAttribute('aria-busy', String(isLoading));
  proposalLoading.hidden = !isLoading;
  proposalSubmitButton.innerHTML = isLoading
    ? '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Sending...'
    : '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Request';
};

const openProposalModal = (trigger) => {
  lastFocusedElement = trigger;
  proposalTriggerLabel = trigger?.textContent?.replace(/\s+/g, ' ').trim() || 'Request a Quote';
  proposalForm.reset();
  proposalError.hidden = true;
  setProposalLoading(false);
  updateProposalSelection('solution', getSolutionFromTrigger(trigger));
  updateProposalSelection('quantity', '1');
  refreshProposalMetadata();
  proposalModal.classList.add('is-open');
  proposalModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('proposal-modal-open');
  window.setTimeout(() => proposalModal.querySelector('input[name="fullName"]')?.focus(), 80);
};

const closeProposalModal = () => {
  proposalModal.classList.remove('is-open');
  proposalModal.setAttribute('aria-hidden', 'true');
  if (!proposalConfirmationModal.classList.contains('is-open')) {
    document.body.classList.remove('proposal-modal-open');
  }
  lastFocusedElement?.focus?.();
};

const openProposalConfirmationModal = () => {
  proposalConfirmationModal.classList.add('is-open');
  proposalConfirmationModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('proposal-modal-open');
  proposalConfirmationModal.querySelector('a')?.focus();
};

const closeProposalConfirmationModal = () => {
  proposalConfirmationModal.classList.remove('is-open');
  proposalConfirmationModal.setAttribute('aria-hidden', 'true');
  if (!proposalModal.classList.contains('is-open')) {
    document.body.classList.remove('proposal-modal-open');
  }
  lastFocusedElement?.focus?.();
};

proposalModal.querySelectorAll('[data-proposal-close]').forEach((button) => {
  button.addEventListener('click', closeProposalModal);
});

proposalConfirmationModal.querySelectorAll('[data-confirmation-close]').forEach((button) => {
  button.addEventListener('click', closeProposalConfirmationModal);
});

proposalModal.addEventListener('change', (event) => {
  if (event.target.name === 'solution') updateProposalSelection('solution', event.target.value);
  if (event.target.name === 'quantity') updateProposalSelection('quantity', event.target.value);
  refreshProposalMetadata();
});

proposalModal.addEventListener('input', (event) => {
  if (event.target.name === 'quantity') {
    updateProposalSelection('quantity', event.target.value);
    refreshProposalMetadata();
  }
});

proposalForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!proposalForm.reportValidity()) return;

  const formData = new FormData(proposalForm);
  const quoteRequest = createQuoteRequestPayload(formData);

  proposalError.hidden = true;
  setProposalLoading(true);

  try {
    await Promise.all([
      submitQuoteRequest(quoteRequest),
      sendQuoteRequestEmail(quoteRequest),
    ]);
  } catch (error) {
    console.error('The quote request could not be completed.', error);
    proposalError.hidden = false;
    setProposalLoading(false);
    return;
  }

  const payload = Object.fromEntries(formData.entries());
  payload.metadata = getProposalMetadata(proposalTriggerLabel);
  payload.productSelected = payload.metadata.productSelected;
  payload.quoteRequest = quoteRequest;

  window.taploopProposalRequests = window.taploopProposalRequests || [];
  window.taploopProposalRequests.push(payload);
  window.dataLayer?.push?.({ event: 'proposal_request_submitted', proposal: payload });

  try {
    const savedRequests = JSON.parse(window.localStorage.getItem('taploopProposalRequests') || '[]');
    savedRequests.push(payload);
    window.localStorage.setItem('taploopProposalRequests', JSON.stringify(savedRequests));
  } catch (error) {
    console.warn('The quote request could not be saved locally.', error);
  }

  closeProposalModal();
  openProposalConfirmationModal();
  setProposalLoading(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && proposalModal.classList.contains('is-open')) {
    closeProposalModal();
  }

  if (event.key === 'Escape' && proposalConfirmationModal.classList.contains('is-open')) {
    closeProposalConfirmationModal();
  }
});

document.querySelectorAll('a, button').forEach((trigger) => {
  const label = trigger.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
  const href = trigger.getAttribute('href') || '';
  const isProposalTrigger = (
    (label.includes('request a quote') || label.includes('open quote form') || label.includes('start a project') || label.includes('start my proposal')) &&
    !label.includes('whatsapp') &&
    (href === '#quote' || href.startsWith('mailto:') || trigger.classList.contains('nav-cta') || trigger.classList.contains('btn'))
  );

  if (!isProposalTrigger) return;

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openProposalModal(trigger);
  });
});

const whatsappFloat = document.createElement('div');
whatsappFloat.className = 'whatsapp-float';
whatsappFloat.innerHTML = `
  <div class="whatsapp-float-message">Talk to an agent</div>
  <a class="whatsapp-float-button" href="${whatsappUrl}" target="_blank" rel="noopener" aria-label="Talk to an agent on WhatsApp">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
  </a>
`;
document.body.append(whatsappFloat);
