insert into public.categories (name, slug, description)
values
  ('Romance', 'romance', 'Relationship and trust-building scams that exploit emotional connection.'),
  ('Crypto', 'crypto', 'Cryptocurrency investment, wallet, exchange, and recovery scams.'),
  ('Banking', 'banking', 'Bank impersonation, account alert, and payment verification scams.'),
  ('Job', 'job', 'Fake recruiter, remote work, task, and employment offer scams.'),
  ('Scholarship', 'scholarship', 'Fake scholarship, admission, and student grant scams.'),
  ('Phishing', 'phishing', 'Credential theft and fake login message scams.'),
  ('Marketplace', 'marketplace', 'Buyer, seller, delivery, escrow, and fake payment scams.'),
  ('Fake Support', 'fake-support', 'Impersonated technical, platform, or customer support scams.')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description;

insert into public.scams (
  title,
  slug,
  category_id,
  description,
  how_it_works,
  warning_signs,
  example_messages,
  prevention_steps,
  recovery_steps,
  emotional_triggers,
  severity,
  platform,
  status
)
values
  (
    'Fake Remote Job Task Scam',
    'fake-remote-job-task-scam',
    (select id from public.categories where slug = 'job'),
    'A fake recruiter offers simple remote work, then asks the victim to pay fees, buy tasks, or deposit money to unlock earnings.',
    'The scam starts with an easy job offer and small apparent rewards. The victim is then pushed to deposit money or pay upgrade fees before withdrawing earnings.',
    array['Unexpected recruiter message', 'High pay for simple tasks', 'Deposit required before withdrawal', 'Pressure to act quickly'],
    array['You have been selected for a remote optimization role.', 'Complete prepaid tasks to unlock your commission.'],
    array['Verify the company through official channels', 'Do not pay to receive wages', 'Avoid sharing identity documents with unverified recruiters'],
    array['Stop sending money', 'Save screenshots and transaction records', 'Report the account and contact your bank if payment was sent'],
    array['Urgency', 'Financial hope', 'Authority'],
    'high',
    'WhatsApp',
    'approved'
  ),
  (
    'Bank Account Alert Phishing',
    'bank-account-alert-phishing',
    (select id from public.categories where slug = 'banking'),
    'A message impersonates a bank and claims the user must verify account activity through a suspicious link.',
    'The victim receives an urgent message about account suspension or suspicious activity. The link leads to a fake login page that captures credentials.',
    array['Urgent account warning', 'Shortened or unfamiliar link', 'Request for login details or OTP', 'Threat of account closure'],
    array['Your account will be suspended today. Verify now.', 'We detected unusual activity. Confirm your identity.'],
    array['Open the banking app directly', 'Call the official number on the bank card', 'Never enter OTPs into links from messages'],
    array['Change banking passwords', 'Contact the bank immediately', 'Enable transaction alerts'],
    array['Fear', 'Urgency', 'Authority'],
    'high',
    'SMS',
    'approved'
  ),
  (
    'Fake Scholarship Processing Fee',
    'fake-scholarship-processing-fee',
    (select id from public.categories where slug = 'scholarship'),
    'A fake scholarship offer asks students to pay an application, processing, or verification fee before receiving funds.',
    'The scammer promises a scholarship or grant and asks for payment, personal documents, or account details to process the award.',
    array['Guaranteed award without application review', 'Processing fee request', 'Unofficial email address', 'Request for sensitive documents too early'],
    array['Congratulations, you have qualified for a student grant.', 'Pay the verification fee to release your scholarship.'],
    array['Confirm scholarships through school or official foundation websites', 'Do not pay upfront release fees', 'Avoid sending IDs to unverified contacts'],
    array['Report to the school or scholarship body', 'Preserve emails and payment records', 'Contact payment provider if money was sent'],
    array['Hope', 'Scarcity', 'Authority'],
    'medium',
    'Email',
    'approved'
  )
on conflict (slug) do update
set
  title = excluded.title,
  category_id = excluded.category_id,
  description = excluded.description,
  how_it_works = excluded.how_it_works,
  warning_signs = excluded.warning_signs,
  example_messages = excluded.example_messages,
  prevention_steps = excluded.prevention_steps,
  recovery_steps = excluded.recovery_steps,
  emotional_triggers = excluded.emotional_triggers,
  severity = excluded.severity,
  platform = excluded.platform,
  status = excluded.status;

