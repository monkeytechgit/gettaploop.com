const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const normalizeLabel = (value) => value.replace(/\s+/g, ' ').trim().toLowerCase();

const isQuoteTriggerLabel = (label) => (
  label.includes('request a quote') ||
  label.includes('get a quote') ||
  label.includes('quote') ||
  label.includes('start my proposal') ||
  label.includes('get my proposal') ||
  label.includes('get a proposal') ||
  label.includes('request a proposal') ||
  label.includes('request proposal')
);

const setupPageMotion = () => {
  if (motionQuery.matches) return;

  const revealSelectors = [
    'main > section',
    'main section .section-heading',
    'main section article',
    'main section .final-cta-card',
    'main section .teams-overview-card',
    'main section .product-media',
    'main section .product-accordions details',
    'main section .faq-list details',
    'main section .brand-mockup-card',
    'main section .platform-suite-grid article',
    'main section img',
  ];

  const revealItems = Array.from(document.querySelectorAll(revealSelectors.join(',')))
    .filter((element, index, list) => list.indexOf(element) === index)
    .filter((element) => !element.closest('.site-header, .proposal-modal, .whatsapp-float'));

  revealItems.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 45}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12,
  });

  revealItems.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      element.classList.add('is-visible');
      return;
    }

    observer.observe(element);
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    const label = normalizeLabel(link.textContent || '');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;
    if (isQuoteTriggerLabel(label)) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.hash) return;

    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('is-page-leaving');
      window.setTimeout(() => {
        window.location.href = url.href;
      }, 150);
    });
  });
};

const resetPageTransitionState = () => {
  document.body.classList.remove('is-page-leaving');
};

window.addEventListener('pageshow', resetPageTransitionState);
window.addEventListener('load', resetPageTransitionState);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) resetPageTransitionState();
});

setupPageMotion();

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('details').forEach((item) => {
  item.addEventListener('toggle', () => {
    const symbol = item.querySelector('summary b');
    if (symbol) symbol.textContent = item.open ? '−' : '+';
  });
});

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
let whatsappMessage = "I'm interested in TapLoop's products.";

if (currentPath.endsWith('/pvc-nfc-card.html')) {
  whatsappMessage = "I'm interested in TapLoop's PVC NFC Card.";
}

if (currentPath.endsWith('/metal-nfc-card.html')) {
  whatsappMessage = "I'm interested in TapLoop's Metal NFC Card.";
}

const whatsappUrl = `https://wa.me/526643053834?text=${encodeURIComponent(whatsappMessage)}`;
const supabaseRestUrl = 'https://ejhkjyofrazyxtxkohfo.supabase.co/rest/v1/quote_requests';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqaGtqeW9mcmF6eXh0eGtvaGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Mjg1MjMsImV4cCI6MjA4NzMwNDUyM30.MsYH7bPlJdjJelexsJn_4mLvWu3NMUCTt6mcgn08dZ8';
const emailJsApiUrl = 'https://api.emailjs.com/api/v1.0/email/send';
const emailJsServiceId = 'service_gshjpyg';
const emailJsTemplateId = 'template_y4y0gl8';
const emailJsPublicKey = '5vTFdcXJ0G3y7ZaPs';

const proposalOptions = [
  {
    value: 'pvc',
    label: 'PVC NFC Card',
    icon: 'fa-solid fa-id-card',
  },
  {
    value: 'metal',
    label: 'Metal NFC Card',
    icon: 'fa-regular fa-gem',
  },
  {
    value: 'both',
    label: 'Both',
    icon: 'fa-solid fa-layer-group',
  },
  {
    value: 'team',
    label: 'NFC Cards for My Team',
    icon: 'fa-solid fa-users',
  },
  {
    value: 'consultation',
    label: 'Help Me Choose',
    icon: 'fa-solid fa-comments',
  },
];

const proposalModalState = {
  selectedSolution: 'consultation',
  selectedQuantity: '1',
};

const getPageSolution = () => {
  const path = currentPath;

  if (path.endsWith('/pvc-nfc-card.html')) return 'pvc';
  if (path.endsWith('/metal-nfc-card.html')) return 'metal';
  if (path.endsWith('/for-teams.html')) return 'both';

  return 'consultation';
};

const getSolutionFromTrigger = (trigger) => {
  const text = `${trigger?.textContent || ''} ${trigger?.getAttribute('aria-label') || ''}`.toLowerCase();
  const card = trigger?.closest('article, .solution-card, .cards-product-card, .cards-catalog-item');
  const cardId = card?.id?.toLowerCase() || '';
  const cardText = card?.textContent?.toLowerCase() || '';

  if (text.includes('metal') || text.includes('metallic') || text.includes('premium')) return 'metal';
  if (text.includes('pvc') || text.includes('digital')) return 'pvc';
  if (text.includes('team') || text.includes('teammate') || text.includes('business')) return 'both';

  if (cardId.includes('metal') || cardText.includes('metal') || cardText.includes('metallic') || cardText.includes('premium')) return 'metal';
  if (cardId.includes('pvc') || cardText.includes('pvc')) return 'pvc';
  if (cardText.includes('team') || cardText.includes('teammate') || cardText.includes('business')) return 'both';

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
      <button class="proposal-modal__close" type="button" data-proposal-close aria-label="Close proposal">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>

      <div class="proposal-form__loading" data-proposal-loading hidden aria-live="polite" aria-label="Submitting request">
        <span aria-hidden="true"></span>
        <p>Submitting your request...</p>
      </div>

      <form class="proposal-form" data-proposal-form>
        <div class="proposal-form__intro">
          <img class="proposal-form__logo" src="assets/image/taploop_logo.png" alt="TapLoop" loading="lazy" decoding="async">
          <h2 id="proposal-modal-title">Get a proposal in minutes</h2>
          <p>A TapLoop agent will contact you shortly.</p>
        </div>

        <div class="proposal-form__grid">
          <label class="proposal-field">
            <span>Solution type <b aria-hidden="true">*</b></span>
            <select name="solution" required>
              <option value="consultation" selected>Help Me Choose</option>
              <option value="pvc">PVC NFC Card</option>
              <option value="metal">Metal NFC Card</option>
              <option value="both">Both</option>
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
            <span>Tell us briefly what you have in mind <small>optional</small></span>
            <textarea name="comments" rows="4" placeholder="Example: We need 15 cards for our sales team, customized with our logo and each rep's details."></textarea>
          </label>
        </div>

        <input type="hidden" name="metadata" data-proposal-metadata>

        <div class="proposal-form__actions">
          <button class="btn btn-primary" type="submit">
            <i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Get My Proposal
          </button>
        </div>
        <p class="proposal-form__error" data-proposal-error hidden>We couldn't send your request. Please try again.</p>
        <p class="proposal-form__note">We'll contact you to confirm the details and prepare your quote. No commitment.</p>
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
        <h2 id="proposal-confirmation-title">We received your request!</h2>
        <p>Our team will review the information and get in touch with you to prepare a personalized proposal.</p>
        <p>In the meantime, you can send us your logo or references on WhatsApp to move faster.</p>
        <div class="proposal-confirmation__actions">
          <a class="btn btn-primary" data-proposal-confirm-whatsapp target="_blank" rel="noopener noreferrer" href="${whatsappUrl}">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Continue on WhatsApp
          </a>
          <button class="btn btn-outline" type="button" data-confirmation-close>Cancel</button>
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
const defaultProposalErrorMessage = proposalError.textContent;
let lastFocusedElement = null;
let proposalTriggerLabel = '';

const updateProposalSelection = (groupName, value) => {
  const input = proposalModal.querySelector(`[name="${groupName}"]`);
  if (!input) return;

  if (input.tagName === 'SELECT') {
    input.value = value === 'team' ? 'both' : value;
  } else {
    input.value = value;
  }

  if (groupName === 'solution') proposalModalState.selectedSolution = input.value;
  if (groupName === 'quantity') proposalModalState.selectedQuantity = input.value;
};

const getProposalWhatsappUrl = () => {
  const solution = proposalOptions.find((option) => option.value === proposalModalState.selectedSolution)?.label || 'NFC cards';
  const message = `Hi, I would like a personalized proposal from TapLoop. Solution: ${solution}. Approximate quantity: ${proposalModalState.selectedQuantity}.`;

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
    title: 'New quote request - TapLoop',
    name: quoteRequest.full_name,
    email: quoteRequest.email,
    fullName: quoteRequest.full_name,
    companyName: company,
    emailAddress: quoteRequest.email,
    phoneNumber: phone,
    product: product,
    quantity: String(quoteRequest.approximate_quantity),
    delivery: 'To be confirmed',
    description: description,
    message: description,
    nombre: quoteRequest.full_name,
    empresa: company,
    correo: quoteRequest.email,
    telefono: phone,
    producto: product,
    cantidad: String(quoteRequest.approximate_quantity),
    entrega: 'To be confirmed',
    descripcion: description,
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
    headers: {
      'Content-Type': 'application/json',
    },
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
    : '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Get My Proposal';
};

const openProposalModal = (trigger) => {
  lastFocusedElement = trigger;
  proposalTriggerLabel = trigger?.textContent?.replace(/\s+/g, ' ').trim() || 'Request a Quote';
  proposalForm.reset();
  proposalError.textContent = defaultProposalErrorMessage;
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

const trackGoogleAdsQuoteConversion = () => {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-18177290983/c5TNCJiOhfAcEOf1zdtD',
      });
    }
  } catch (error) {
    console.warn('Could not log the Google Ads conversion.', error);
  }
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

  if (!proposalForm.checkValidity()) {
    const firstInvalid = proposalForm.querySelector(':invalid');
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid?.focus({ preventScroll: true });
    proposalForm.reportValidity();
    proposalError.textContent = 'Please fill in the highlighted required fields before sending.';
    proposalError.hidden = false;
    return;
  }

  const formData = new FormData(proposalForm);
  const quoteRequest = createQuoteRequestPayload(formData);

  proposalError.textContent = defaultProposalErrorMessage;
  proposalError.hidden = true;
  setProposalLoading(true);

  try {
    await Promise.all([
      submitQuoteRequest(quoteRequest),
      sendQuoteRequestEmail(quoteRequest),
    ]);
  } catch (error) {
    console.error('Could not complete the request submission.', error);
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
    console.warn('Could not save the request locally.', error);
  }

  closeProposalModal();
  openProposalConfirmationModal();
  trackGoogleAdsQuoteConversion();
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
  if (trigger.closest('.proposal-modal')) return;

  const label = normalizeLabel(trigger.textContent || '');
  const href = trigger.getAttribute('href') || '';
  const isProposalTrigger = (
    isQuoteTriggerLabel(label) &&
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
  <div class="whatsapp-float-message">Chat with an agent</div>
  <a class="whatsapp-float-button" href="${whatsappUrl}" target="_blank" rel="noopener" aria-label="Chat with an agent on WhatsApp">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
  </a>
`;
document.body.append(whatsappFloat);
