-- Expand scam categories for Phase 9
INSERT INTO categories (name, slug, description) VALUES
  ('Recovery Scams', 'recovery', 'Fake services claiming they can recover lost money or crypto'),
  ('Investment Scams', 'investment', 'Fake investment opportunities with guaranteed high returns'),
  ('Government/Tax Scams', 'government-tax', 'Impersonation of IRS, tax agencies, or government officials'),
  ('Rental Scams', 'rental', 'Fake rental listings requesting deposits for properties that don''t exist'),
  ('Charity Scams', 'charity', 'Fake charities exploiting disasters or emotional causes'),
  ('Business Invoice Scams', 'business-invoice', 'Fake invoices or supplier changes targeting businesses'),
  ('Loan/Debt Scams', 'loan-debt', 'Advance-fee loans or debt relief requiring upfront payment'),
  ('Prize/Lottery Scams', 'prize-lottery', 'Notifications that you won a prize you never entered'),
  ('Travel/Ticket Scams', 'travel-ticket', 'Fake travel deals, concert tickets, or vacation rentals'),
  ('Social Media Impersonation', 'social-media', 'Impersonation of friends, celebrities, or brands on social platforms'),
  ('Malware Scams', 'malware', 'Fake software, downloads, or links that install malicious software'),
  ('Remote Access Scams', 'remote-access', 'Scammers requesting access to your computer for ''support''')
ON CONFLICT (slug) DO NOTHING;

-- Add sample scam for Recovery Scams
INSERT INTO scams (
  title, slug, category_id, description, how_it_works, 
  warning_signs, example_messages, prevention_steps, recovery_steps, 
  emotional_triggers, severity, platform, status
) VALUES (
  'Fake Crypto Recovery Services',
  'fake-crypto-recovery',
  (SELECT id FROM categories WHERE slug = 'recovery'),
  'Scammers pose as cryptocurrency recovery experts who can retrieve lost or stolen crypto. They charge upfront fees but provide no real service.',
  'These scammers find victims who have already lost money to crypto scams. They contact them via email, social media, or forum comments claiming they have special tools or insider connections to recover lost funds. Victims pay upfront fees ranging from hundreds to thousands of dollars, but the ''recovery experts'' disappear after payment.',
  ARRAY[
    'Guaranteed recovery of lost crypto',
    'Special tools or insider access claims',
    'Upfront fees required before any work',
    'Contact via unsolicited messages',
    'No verifiable company information'
  ],
  ARRAY[
    'I can recover your stolen Bitcoin for a small fee upfront',
    'Our team has special blockchain tools to trace and recover funds',
    'Act now, this recovery window closes soon'
  ],
  ARRAY[
    'Never pay upfront for recovery services',
    'Research any recovery service thoroughly',
    'Check for verifiable business registration',
    'Be skeptical of unsolicited recovery offers',
    'Real recovery services don''t guarantee results'
  ],
  ARRAY[
    'Stop all contact with the fake recovery service',
    'Document all communications and payment proof',
    'Report to the FTC and local authorities',
    'Warn others on crypto forums to prevent more victims',
    'Accept the loss and focus on protecting remaining assets'
  ],
  ARRAY['desperation', 'hope', 'urgency', 'fear of total loss'],
  'high',
  'Email, Social Media',
  'approved'
) ON CONFLICT (slug) DO NOTHING;

-- Add sample scam for Investment Scams
INSERT INTO scams (
  title, slug, category_id, description, how_it_works, 
  warning_signs, example_messages, prevention_steps, recovery_steps, 
  emotional_triggers, severity, platform, status
) VALUES (
  'Ponzi Scheme Investment Scam',
  'ponzi-investment-scam',
  (SELECT id FROM categories WHERE slug = 'investment'),
  'Fraudulent investment opportunities promising high returns with little or no risk. Early investors are paid with money from new investors, not actual profits.',
  'Scammers create fake investment platforms or opportunities, often claiming to use special algorithms or insider knowledge. They promise unrealistic returns like 10% per week. Initially, they may pay out small returns to build trust, then encourage larger investments. Eventually, the scam collapses when new investments stop.',
  ARRAY[
    'Guaranteed high returns with no risk',
    'Pressure to recruit others for bonuses',
    'Unregistered or unlicensed investment platforms',
    'Complex strategies that are hard to understand',
    'Pressure to invest quickly'
  ],
  ARRAY[
    'Earn 15% weekly returns with our proprietary trading algorithm',
    'Invest $1000 today and receive $1500 in just 7 days',
    'Limited time offer - only 50 spots available'
  ],
  ARRAY[
    'Research investment opportunities thoroughly',
    'Verify licenses with financial regulators',
    'Be skeptical of guarantees and high returns',
    'Never invest under pressure',
    'Diversify and only invest what you can afford to lose'
  ],
  ARRAY[
    'Stop investing more money immediately',
    'Gather all transaction records and communications',
    'Report to SEC, FTC, and local authorities',
    'Contact your bank or payment provider',
    'Warn others about the fake investment platform'
  ],
  ARRAY['greed', 'fear of missing out', 'trust', 'urgency'],
  'high',
  'Social Media, Email',
  'approved'
) ON CONFLICT (slug) DO NOTHING;
