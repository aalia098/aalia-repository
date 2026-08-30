/**
 * ==========================================================================
 * INTERACTIVE PROJECT SIMULATION DEMOS
 * Practical interactive mockups for Uncleads.com, Doot, and Mass Email Verifier
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initVerifierDemo();
  initDootDemo();
  initUncleadsDemo();
});

/* --------------------------------------------------------------------------
   1. MASS EMAIL VERIFIER & MX CHECKER DEMO
   -------------------------------------------------------------------------- */
function initVerifierDemo() {
  const verifyBtn = document.getElementById('btn-run-verifier');
  const emailInput = document.getElementById('verifier-email-input');
  const statusSyntax = document.getElementById('status-syntax');
  const statusDomain = document.getElementById('status-domain');
  const statusMx = document.getElementById('status-mx');
  const statusVerdict = document.getElementById('status-verdict');

  if (!verifyBtn || !emailInput) return;

  const mockMxDatabase = {
    'gmail.com': ['gmail-smtp-in.l.google.com (Priority 5)', 'alt1.gmail-smtp-in.l.google.com (Priority 10)'],
    'google.com': ['smtp.google.com (Priority 10)'],
    'outlook.com': ['outlook-com.olc.protection.outlook.com (Priority 10)'],
    'yahoo.com': ['mta5.am0.yahoodns.net (Priority 10)'],
    'college.edu': ['mail.college.edu (Priority 10)'],
    'uncleads.com': ['mx1.uncleads.com (Priority 10)']
  };

  verifyBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email) return;

    // Reset UI to checking state
    statusSyntax.innerHTML = '<span class="status-checking">Checking...</span>';
    statusDomain.innerHTML = '<span class="status-checking">Resolving...</span>';
    statusMx.innerHTML = '<span class="status-checking">Querying MX...</span>';
    statusVerdict.innerHTML = '<span class="status-checking">Evaluating...</span>';

    // Step 1: Syntax Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidSyntax = emailRegex.test(email);

    setTimeout(() => {
      if (isValidSyntax) {
        statusSyntax.innerHTML = '<span class="status-valid">✓ Valid RFC 5322</span>';
        
        // Step 2: Domain extraction
        const domain = email.split('@')[1].toLowerCase();
        statusDomain.innerHTML = `<span class="status-valid">✓ ${domain}</span>`;

        // Step 3: MX Record Checking Simulation
        setTimeout(() => {
          if (mockMxDatabase[domain]) {
            const mxRecords = mockMxDatabase[domain];
            statusMx.innerHTML = `<span class="status-valid">✓ ${mxRecords[0]}</span>`;
            statusVerdict.innerHTML = '<span class="status-valid">✓ Deliverable & Valid Mailbox</span>';
          } else if (domain.includes('invalid') || domain.includes('fake') || domain.includes('testxyz')) {
            statusMx.innerHTML = '<span class="status-invalid">✗ No MX Records Found</span>';
            statusVerdict.innerHTML = '<span class="status-invalid">✗ Undeliverable (Dead Domain)</span>';
          } else {
            statusMx.innerHTML = `<span class="status-valid">✓ mail.${domain} (Priority 10)</span>`;
            statusVerdict.innerHTML = '<span class="status-valid">✓ Deliverable (Active MX)</span>';
          }
        }, 400);

      } else {
        statusSyntax.innerHTML = '<span class="status-invalid">✗ Invalid Syntax</span>';
        statusDomain.innerHTML = '<span class="status-invalid">✗ Parsing Failed</span>';
        statusMx.innerHTML = '<span class="status-muted">—</span>';
        statusVerdict.innerHTML = '<span class="status-invalid">✗ Rejected</span>';
      }
    }, 300);
  });
}

/* --------------------------------------------------------------------------
   2. DOOT (MASS EMAIL SENDER) DEMO
   -------------------------------------------------------------------------- */
function initDootDemo() {
  const launchDootBtn = document.getElementById('btn-doot-send');
  const dootProgress = document.getElementById('doot-send-progress');
  const dootStatus = document.getElementById('doot-send-status');

  if (!launchDootBtn || !dootProgress || !dootStatus) return;

  let isSending = false;

  launchDootBtn.addEventListener('click', () => {
    if (isSending) return;
    isSending = true;
    launchDootBtn.disabled = true;
    launchDootBtn.textContent = 'Sending Batch...';
    dootStatus.textContent = 'Dispatching queue (1,250 recipients)...';

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        dootProgress.style.width = '100%';
        dootStatus.innerHTML = '<span class="status-valid">✓ Batch Complete: 1,250 Dispatched (0 Errors)</span>';
        launchDootBtn.disabled = false;
        launchDootBtn.textContent = 'Trigger Sample Batch';
        isSending = false;
      } else {
        dootProgress.style.width = `${current}%`;
        dootStatus.textContent = `Processing chunk: ${Math.round((current / 100) * 1250)} / 1,250 dispatched...`;
      }
    }, 120);
  });
}

/* --------------------------------------------------------------------------
   3. UNCLEADS.COM RESPONSIVE VIEW SWITCHER DEMO
   -------------------------------------------------------------------------- */
function initUncleadsDemo() {
  const modeButtons = document.querySelectorAll('.uncleads-mode-btn');
  const frameContainer = document.querySelector('.uncleads-preview-frame');

  if (!modeButtons || !frameContainer) return;

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      if (mode === 'mobile') {
        frameContainer.style.maxWidth = '280px';
      } else if (mode === 'tablet') {
        frameContainer.style.maxWidth = '420px';
      } else {
        frameContainer.style.maxWidth = '100%';
      }
    });
  });
}
