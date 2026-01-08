/**
 * Repair Booking App - Main Logic
 */

// --- Data Models ---

const DEVICES = [
    {
        id: 'iphone-16-pro-max',
        brand: 'Apple',
        model: 'iPhone 16 Pro Max',
        category: 'Smartphone',
        image: 'https://placehold.co/100x120/eee/333?text=iPhone+16+PM', // Placeholder
        colors: [
            { id: 'black-titanium', name: 'Black Titanium', hex: '#333333' },
            { id: 'desert-titanium', name: 'Desert Titanium', hex: '#C5A580' },
            { id: 'natural-titanium', name: 'Natural Titanium', hex: '#8C8B88' },
            { id: 'white-titanium', name: 'White Titanium', hex: '#F2F2F2' }
        ]
    },
    // Can add more devices here in the future
];

const REPAIRS = [
    {
        id: 'screen',
        name: 'Skærm',
        durationLabel: '60 MINUTTER',
        fromPrice: 1999,
        fixedPrice: null,
        priceLabel: 'Fra kr1999',
        description: 'Striber i billedet, helt sort skærm, touch virker ikke eller glasset er smadret.',
        icon: 'bi-phone'
    },
    {
        id: 'screen-protection',
        name: 'Skærmbeskyttelse',
        durationLabel: '5 MINUTTER',
        fromPrice: null,
        fixedPrice: 150,
        priceLabel: 'kr150',
        description: 'Montering af beskyttelsesglas.',
        icon: 'bi-shield-check'
    },
    {
        id: 'battery',
        name: 'Batteri',
        durationLabel: '60 MINUTTER',
        fromPrice: 1299,
        fixedPrice: null,
        priceLabel: 'Fra kr1299',
        description: 'Løber hurtigt tør for strøm, slukker ved fx 20% eller vil ikke tænde.',
        icon: 'bi-battery-half'
    },
    {
        id: 'charging-port',
        name: 'Ladestik',
        durationLabel: '60 MINUTTER',
        fromPrice: 1199,
        fixedPrice: null,
        priceLabel: 'Fra kr1199',
        description: 'Lader ikke, lader løst eller kan ikke forbinde til computer.',
        icon: 'bi-lightning-charge'
    },
    {
        id: 'back-glass',
        name: 'Bagside/Bagcover udskiftning',
        durationLabel: '1 DAG',
        fromPrice: 2199,
        fixedPrice: null,
        priceLabel: 'Fra kr2199',
        description: 'Bagglas er revnet eller smadret.',
        icon: 'bi-phone-flip'
    },
    {
        id: 'ear-speaker',
        name: 'Ørehøjtaler',
        durationLabel: '60 MINUTTER',
        fromPrice: null,
        fixedPrice: null,
        priceLabel: 'Pris på forespørgsel',
        description: 'Lav eller ingen lyd ved samtaler.',
        icon: 'bi-volume-up'
    },
    {
        id: 'loud-speaker',
        name: 'Højtaler',
        durationLabel: '60 MINUTTER',
        fromPrice: null,
        fixedPrice: null,
        priceLabel: 'Pris på forespørgsel',
        description: 'Dårlig eller ingen lyd ved afspilning af musik/video.',
        icon: 'bi-speaker'
    },
    {
        id: 'diagnosis',
        name: 'Diagnose',
        durationLabel: '60 MINUTTER',
        fromPrice: null,
        fixedPrice: 295,
        priceLabel: 'kr295',
        description: 'Fejlsøgning hvis du er i tvivl om fejlen.',
        icon: 'bi-search'
    }
];

// --- State Management ---
const state = {
    step: 2, // Start at step 2 as per prompt instructions (focus of task)
    device: DEVICES[0], // Default device
    selectedColor: null, // full color object
    selectedRepairs: new Set(), // Set of repair IDs
    customer: {
        name: '',
        email: '',
        phone: '',
        notes: '',
        date: ''
    }
};

// --- DOM Elements ---
const appContainer = document.getElementById('app');
const stepIndicators = [
    document.getElementById('step-1-indicator'),
    document.getElementById('step-2-indicator'),
    document.getElementById('step-3-indicator')
];

// --- Initialization ---
function init() {
    render();
    
    // Global Event Listener for Modal
    const pdfForm = document.getElementById('pdfForm');
    if(pdfForm) {
        pdfForm.addEventListener('submit', handlePdfSubmit);
    }
}

// --- Render Logic ---
function render() {
    updateStepper();
    
    appContainer.innerHTML = '';
    
    if (state.step === 1) {
        renderStep1();
    } else if (state.step === 2) {
        renderStep2();
    } else if (state.step === 3) {
        renderStep3();
    }
}

function updateStepper() {
    stepIndicators.forEach((el, index) => {
        const stepNum = index + 1;
        el.classList.remove('active', 'completed');
        if (state.step === stepNum) {
            el.classList.add('active');
        } else if (state.step > stepNum) {
            el.classList.add('completed');
            // Change number to checkmark if completed (handled in CSS/HTML structure, but let's ensure icon is check)
            const circle = el.querySelector('.step-circle');
            circle.innerHTML = '<i class="bi bi-check-lg"></i>';
        } else {
             const circle = el.querySelector('.step-circle');
             circle.innerText = stepNum;
        }
    });
}

// --- Step 1: Device Selection (Simplified for now) ---
function renderStep1() {
    appContainer.innerHTML = `
        <div class="text-center py-5">
            <h3>Vælg din enhed</h3>
            <p class="text-muted">Dette trin er allerede gennemført i demoen.</p>
            <button class="btn btn-primary" onclick="setStep(2)">Gå til Step 2</button>
        </div>
    `;
}

// --- Step 2: Repair Selection (Main Task) ---
function renderStep2() {
    const row = document.createElement('div');
    row.className = 'row g-4';
    
    // Left Content Column
    const contentCol = document.createElement('div');
    contentCol.className = 'col-lg-8';
    
    // 1. Header
    contentCol.innerHTML += `
        <a href="#" class="btn-back" onclick="setStep(1); return false;"><i class="bi bi-arrow-left"></i> Tilbage</a>
        <div class="d-flex align-items-center mb-4">
            <img src="${state.device.image}" alt="${state.device.model}" class="device-frame me-4 bg-white shadow-sm p-2 rounded">
            <div>
                <span class="text-uppercase text-muted fw-bold small">${state.device.category}</span>
                <h2 class="mb-1">${state.device.brand} ${state.device.model}</h2>
                <div id="color-selection-area" class="mt-3">
                    <p class="mb-2 text-sm fw-semibold text-muted">VÆLG FARVE</p>
                    <div class="d-flex flex-wrap" id="color-pills-container">
                        ${renderColorPills()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 2. Repair Grid
    contentCol.innerHTML += `
        <h4 class="mb-3">Vælg reparation</h4>
        <div class="repair-grid">
            ${REPAIRS.map(repair => renderRepairCard(repair)).join('')}
        </div>
    `;

    // Right Sidebar Column
    const sidebarCol = document.createElement('div');
    sidebarCol.className = 'col-lg-4';
    
    // 3. Summary Card
    sidebarCol.innerHTML = renderSummaryCard();

    row.appendChild(contentCol);
    row.appendChild(sidebarCol);
    appContainer.appendChild(row);
    
    // Re-attach events for Step 2
    attachStep2Events();
}

function renderColorPills() {
    return state.device.colors.map(color => `
        <div class="color-pill ${state.selectedColor?.id === color.id ? 'selected' : ''}" 
             data-color-id="${color.id}">
            <span class="color-dot" style="background-color: ${color.hex}"></span>
            ${color.name}
            ${state.selectedColor?.id === color.id ? '<i class="bi bi-check-circle-fill ms-1 text-primary"></i>' : ''}
        </div>
    `).join('');
}

function renderRepairCard(repair) {
    const isSelected = state.selectedRepairs.has(repair.id);
    let priceText = repair.priceLabel;
    
    return `
        <div class="card repair-card-wrapper" data-repair-id="${repair.id}">
            <div class="repair-card ${isSelected ? 'selected' : ''}">
                <div class="price-badge">${priceText}</div>
                <div class="repair-icon">
                    <i class="bi ${repair.icon}"></i>
                </div>
                <div>
                    <span class="duration-badge">${repair.durationLabel}</span>
                    <h5 class="card-title fw-bold mb-1" style="font-size: 1rem;">${repair.name}</h5>
                    <p class="card-text text-muted small mb-0">${repair.description}</p>
                </div>
            </div>
        </div>
    `;
}

function renderSummaryCard() {
    const subtotal = calculateSubtotal();
    const vat = subtotal * 0.25;
    const total = subtotal + vat;
    
    const hasRequestPrice = Array.from(state.selectedRepairs).some(id => {
        const r = REPAIRS.find(x => x.id === id);
        return r && r.fixedPrice === null && r.fromPrice === null;
    });

    const displayTotal = hasRequestPrice ? '—' : `kr${Math.round(total).toLocaleString()}`;
    const displaySubtotal = hasRequestPrice ? '—' : `kr${Math.round(subtotal).toLocaleString()}`;
    
    const canProceed = state.selectedColor !== null && state.selectedRepairs.size > 0;

    let itemsHtml = '';
    if (state.selectedRepairs.size === 0) {
        itemsHtml = '<p class="text-muted text-center py-3 small">Ingen reparationer valgt</p>';
    } else {
        itemsHtml = '<ul class="list-unstyled mb-3">';
        state.selectedRepairs.forEach(id => {
            const r = REPAIRS.find(x => x.id === id);
            if(r) {
                itemsHtml += `
                    <li class="summary-item">
                        <span>${r.name}</span>
                        <span class="fw-semibold">${r.priceLabel.replace('Fra ', '')}</span>
                    </li>
                `;
            }
        });
        itemsHtml += '</ul>';
    }

    return `
        <div class="sticky-summary">
            <div class="card summary-card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h5 class="card-title mb-3">Reparationsliste</h5>
                    <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <img src="${state.device.image}" alt="device" style="width: 40px; height: 50px; object-fit: contain;">
                        <div class="ms-3">
                            <h6 class="mb-0 small fw-bold">${state.device.brand} ${state.device.model}</h6>
                            <small class="text-muted">${state.selectedColor ? state.selectedColor.name : 'Vælg farve'}</small>
                        </div>
                    </div>
                    
                    ${itemsHtml}
                    
                    <div class="border-top pt-3 mt-2">
                        <div class="summary-item text-muted">
                            <span>Subtotal</span>
                            <span>${displaySubtotal}</span>
                        </div>
                        <div class="summary-item mb-4">
                            <span class="fs-5 fw-bold">Totalt</span>
                            <div class="text-end">
                                <span class="summary-total text-primary">${displayTotal}</span>
                                <div class="text-xs text-muted">inkl. moms (25%)</div>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                             <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#pdfModal">
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <i class="bi bi-file-earmark-pdf"></i> Send Tilbud PDF
                                </div>
                            </button>
                            <div class="text-center text-xs text-muted mb-1">Direkte i din indbakke</div>
                            
                            <button class="btn btn-primary btn-lg mt-2" onclick="setStep(3)" ${!canProceed ? 'disabled' : ''}>
                                Næste Trin
                            </button>
                            <div class="text-center text-xs text-muted">Du betaler kun efter din reparation.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function calculateSubtotal() {
    let sub = 0;
    state.selectedRepairs.forEach(id => {
        const r = REPAIRS.find(x => x.id === id);
        if (r) {
            // Use fixedPrice if available, otherwise fromPrice. If both null (request), treat as 0 for calc but handle UI separately.
            const price = r.fixedPrice || r.fromPrice || 0;
            sub += price;
        }
    });
    return sub;
}

// --- Step 3: Finish Order ---
function renderStep3() {
    appContainer.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                 <a href="#" class="btn-back" onclick="setStep(2); return false;"><i class="bi bi-arrow-left"></i> Tilbage</a>
                <div class="card p-4 p-md-5 border-0 shadow-sm">
                    <h3 class="mb-4 text-center">Færdiggør din ordre</h3>
                    <div class="alert alert-info border-0 bg-opacity-10 bg-primary text-primary mb-4">
                        <i class="bi bi-info-circle me-2"></i> Du betaler først i butikken efter reparationen er udført.
                    </div>
                    
                    <form id="bookingForm" onsubmit="handleBookingSubmit(event)">
                        <h5 class="mb-3">Kundeoplysninger</h5>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Fulde navn</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Telefon</label>
                                <input type="tel" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-bold">Email</label>
                                <input type="email" class="form-control" required>
                            </div>
                        </div>
                        
                        <h5 class="mb-3">Vælg tidspunkt</h5>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Dato</label>
                                <input type="date" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Tid</label>
                                <select class="form-select" required>
                                    <option value="">Vælg tid</option>
                                    <option>10:00</option>
                                    <option>11:00</option>
                                    <option>12:00</option>
                                    <option>13:00</option>
                                    <option>14:00</option>
                                    <option>15:00</option>
                                    <option>16:00</option>
                                </select>
                            </div>
                             <div class="col-12">
                                <label class="form-label small fw-bold">Bemærkninger (Valgfrit)</label>
                                <textarea class="form-control" rows="3"></textarea>
                            </div>
                        </div>

                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-lg">Bekræft Booking</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// --- Events & Handlers ---
function setStep(newStep) {
    state.step = newStep;
    window.scrollTo(0, 0);
    render();
}

function attachStep2Events() {
    // Color Pills
    document.querySelectorAll('.color-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const colorId = pill.dataset.colorId;
            state.selectedColor = state.device.colors.find(c => c.id === colorId);
            render(); // Re-render to update summary and pills
        });
    });

    // Repair Cards
    document.querySelectorAll('.repair-card-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const repairId = wrapper.dataset.repairId;
            if (state.selectedRepairs.has(repairId)) {
                state.selectedRepairs.delete(repairId);
            } else {
                state.selectedRepairs.add(repairId);
            }
            render(); // Re-render to update summary and card state
        });
    });
}

function handlePdfSubmit(e) {
    e.preventDefault();
    const modalEl = document.getElementById('pdfModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    showToast('Success', 'Tilbud sendt til din email (demo)');
    e.target.reset();
}

function handleBookingSubmit(e) {
    e.preventDefault();
    // Simulate API call
    const btn = e.submitter;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sender...';
    
    setTimeout(() => {
        appContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="mb-4">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                </div>
                <h2 class="mb-3">Tak for din booking!</h2>
                <p class="text-muted mb-4">Vi har sendt en bekræftelse til din email.<br>Vi glæder os til at se dig i butikken.</p>
                <button class="btn btn-outline-primary" onclick="window.location.reload()">Start forfra</button>
            </div>
        `;
        window.scrollTo(0,0);
        
        // Update stepper to all completed
        stepIndicators[2].classList.add('completed', 'active');
        stepIndicators[2].querySelector('.step-circle').innerHTML = '<i class="bi bi-check-lg"></i>';
        
    }, 1500);
}

function showToast(title, message) {
    const toastEl = document.getElementById('statusToast');
    const toastBody = toastEl.querySelector('.toast-body');
    
    toastEl.classList.remove('bg-danger', 'bg-success');
    toastEl.classList.add('bg-success'); // Default to success for now
    
    toastBody.innerText = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Start App
document.addEventListener('DOMContentLoaded', init);
