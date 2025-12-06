-- First, alter the engagement_30d column to support larger numbers
ALTER TABLE public.jobsea_voices
ALTER COLUMN engagement_30d TYPE numeric(10,2);

-- Add bio fields to jobsea_voices table
ALTER TABLE public.jobsea_voices
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS notable_achievements TEXT,
ADD COLUMN IF NOT EXISTS content_focus TEXT;

-- Insert 25+ influential finance voices with detailed information
INSERT INTO public.jobsea_voices (
  linkedin_id, name, title, company, followers, engagement_30d, avatar_url,
  bio, notable_achievements, content_focus
) VALUES 
-- Investment Banking Leaders
(
  'jamie-dimon',
  'Jamie Dimon',
  'Chairman & CEO',
  'JPMorgan Chase',
  2500000,
  125000.00,
  'https://logo.clearbit.com/jpmorganchase.com',
  'Veteran banker who has led JPMorgan Chase for over 15 years, navigating multiple financial crises and transforming the bank into the largest in the United States.',
  'Led JPMorgan through 2008 financial crisis; Built $4 trillion balance sheet; Named world''s best bank by Euromoney multiple times',
  'Banking strategy, market trends, economic outlook, financial regulation'
),
(
  'david-solomon',
  'David Solomon',
  'Chairman & CEO',
  'Goldman Sachs',
  1800000,
  95000.00,
  'https://logo.clearbit.com/goldmansachs.com',
  'Investment banking veteran and electronic music DJ who leads one of Wall Street''s most prestigious firms while advocating for workplace culture reform.',
  'Transformed Goldman''s retail banking division; Launched Marcus consumer platform; Pioneered flexible work policies on Wall Street',
  'Investment banking, M&A deals, workplace culture, digital banking transformation'
),
(
  'james-gorman',
  'James Gorman',
  'Executive Chairman',
  'Morgan Stanley',
  1200000,
  78000.00,
  'https://logo.clearbit.com/morganstanley.com',
  'Australian-born banker who rebuilt Morgan Stanley''s wealth management business and guided the firm through post-crisis transformation.',
  'Doubled Morgan Stanley''s market cap; Acquired E-Trade and Eaton Vance; Built world''s largest wealth management franchise',
  'Wealth management strategy, financial advice, market analysis, leadership succession'
),
(
  'ray-dalio',
  'Ray Dalio',
  'Founder',
  'Bridgewater Associates',
  3500000,
  185000.00,
  'https://logo.clearbit.com/bridgewater.com',
  'Legendary investor and author of "Principles" who built the world''s largest hedge fund using systematic, principles-based decision making.',
  'Founded $150B+ hedge fund; Developed All Weather portfolio strategy; Bestselling author on economics and management',
  'Economic cycles, debt crises, principles-based thinking, global macro trends, meditation'
),
(
  'ken-griffin',
  'Ken Griffin',
  'Founder & CEO',
  'Citadel',
  980000,
  62000.00,
  'https://logo.clearbit.com/citadel.com',
  'Self-made billionaire who started trading from his Harvard dorm room and built one of the world''s most successful hedge funds.',
  'Built $50B+ multi-strategy hedge fund; Founded Citadel Securities (handles 40% of US retail equity volume); Major philanthropist',
  'Quantitative trading, market microstructure, financial technology, risk management'
),
(
  'stephen-schwarzman',
  'Stephen Schwarzman',
  'Chairman & CEO',
  'Blackstone',
  1400000,
  89000.00,
  'https://logo.clearbit.com/blackstone.com',
  'Co-founder of the world''s largest alternative asset manager, known for large-scale LBOs and real estate investments.',
  'Built $1 trillion AUM platform; Pioneered mega buyouts; Major education philanthropist ($400M+ to universities)',
  'Private equity deals, real estate investing, entrepreneurship, economic policy'
),
(
  'bill-ackman',
  'Bill Ackman',
  'Founder & CEO',
  'Pershing Square Capital',
  2100000,
  145000.00,
  'https://logo.clearbit.com/pershingsquareholdings.com',
  'Activist investor known for high-profile campaigns and transparent communication about his investment theses on social media.',
  'Generated 26% annualized returns over 20 years; Famous short on subprime crisis; Active voice on corporate governance',
  'Activist investing, corporate governance, market opportunities, public company analysis'
),
(
  'larry-fink',
  'Larry Fink',
  'Chairman & CEO',
  'BlackRock',
  1900000,
  98000.00,
  'https://logo.clearbit.com/blackrock.com',
  'Builder of the world''s largest asset manager ($10T+ AUM) and influential voice on ESG investing and stakeholder capitalism.',
  'Built $10 trillion asset management empire; Pioneered ESG integration; Annual CEO letters shape corporate behavior',
  'ESG investing, stakeholder capitalism, asset allocation, climate risk, geopolitics'
),
(
  'abigail-johnson',
  'Abigail Johnson',
  'Chairman & CEO',
  'Fidelity Investments',
  850000,
  52000.00,
  'https://logo.clearbit.com/fidelity.com',
  'Third-generation leader of Fidelity who has pushed the traditional asset manager into cryptocurrency and digital innovation.',
  'Manages $4.5 trillion in assets; Led Fidelity into crypto custody; Launched zero-fee index funds',
  'Index investing, cryptocurrency adoption, retirement planning, financial technology'
),
(
  'brian-armstrong',
  'Brian Armstrong',
  'Co-founder & CEO',
  'Coinbase',
  2800000,
  156000.00,
  'https://logo.clearbit.com/coinbase.com',
  'Software engineer who built Coinbase into the largest US crypto exchange and took it public via direct listing.',
  'Built $70B+ crypto exchange; Led Coinbase to public markets; Advocates for crypto-friendly regulation',
  'Cryptocurrency, blockchain technology, financial inclusion, regulatory policy, Web3'
),
(
  'patrick-collison',
  'Patrick Collison',
  'Co-founder & CEO',
  'Stripe',
  1600000,
  98000.00,
  'https://logo.clearbit.com/stripe.com',
  'Irish entrepreneur who co-founded Stripe at age 19 and built the internet''s payment infrastructure powering millions of businesses.',
  'Built $95B payment processing platform; Powers commerce for Amazon, Google, Shopify; Advocates for progress studies',
  'Payment infrastructure, internet economics, startup building, progress studies, economic growth'
),
(
  'vlad-tenev',
  'Vlad Tenev',
  'Co-founder & CEO',
  'Robinhood',
  1300000,
  89000.00,
  'https://logo.clearbit.com/robinhood.com',
  'Stanford-educated entrepreneur who democratized stock trading with commission-free trading app used by millions.',
  'Pioneered zero-commission trading; Built 23M+ user platform; Navigated GameStop trading controversy',
  'Retail investing democratization, market access, fintech regulation, user experience'
),
(
  'marc-andreessen',
  'Marc Andreessen',
  'Co-founder',
  'Andreessen Horowitz',
  1900000,
  125000.00,
  'https://logo.clearbit.com/a16z.com',
  'Inventor of the first web browser (Netscape) turned legendary VC investor backing Facebook, Twitter, Airbnb, and crypto.',
  'Co-created Netscape Navigator; Founded $35B+ VC firm; Early investor in Facebook, Twitter, Coinbase, GitHub',
  'Technology trends, startup investing, software eating the world, crypto, AI, media criticism'
),
(
  'reid-hoffman',
  'Reid Hoffman',
  'Co-founder',
  'LinkedIn',
  3200000,
  178000.00,
  'https://logo.clearbit.com/linkedin.com',
  'Serial entrepreneur who founded LinkedIn and became one of Silicon Valley''s most influential investors and thinkers.',
  'Built LinkedIn to $26B acquisition; Partner at Greylock; Invested in Facebook, Airbnb, PayPal Mafia member',
  'Professional networking, startup scaling, network effects, entrepreneurship, AI ethics'
),
(
  'chamath-palihapitiya',
  'Chamath Palihapitiya',
  'Founder & CEO',
  'Social Capital',
  2400000,
  167000.00,
  'https://logo.clearbit.com/socialcapital.com',
  'Former Facebook executive turned VC and SPAC pioneer who advocates for financial inclusion and challenges traditional power structures.',
  'Early Facebook executive; Pioneered SPAC boom; Invested in Slack, Box, Survey Monkey; Advocates for financial reform',
  'SPACs, venture investing, financial inclusion, market manipulation criticism, tech policy'
),
(
  'mohamed-el-erian',
  'Mohamed El-Erian',
  'Chief Economic Advisor',
  'Allianz',
  1500000,
  125000.00,
  'https://logo.clearbit.com/allianz.com',
  'Renowned economist and former PIMCO CEO who coined "New Normal" and provides expert commentary on global markets.',
  'Former PIMCO CEO; Coined "New Normal" post-2008; Cambridge PhD economist; Regular CNBC contributor',
  'Global economics, central bank policy, emerging markets, financial crises, market volatility'
),
(
  'nouriel-roubini',
  'Nouriel Roubini',
  'Chairman & CEO',
  'Roubini Macro Associates',
  980000,
  78000.00,
  null,
  'NYU professor known as "Dr. Doom" for correctly predicting the 2008 financial crisis years before it happened.',
  'Predicted 2008 housing crisis; Former IMF and Federal Reserve economist; Author of "Crisis Economics"',
  'Economic crises, debt sustainability, global macro trends, financial bubbles, recession forecasting'
),
(
  'sallie-krawcheck',
  'Sallie Krawcheck',
  'CEO & Co-founder',
  'Ellevest',
  890000,
  67000.00,
  'https://logo.clearbit.com/ellevest.com',
  'Former Wall Street executive who held top roles at Citi and Merrill Lynch before founding Ellevest to close the gender investing gap.',
  'Former CFO of Citigroup; Ran Merrill Lynch wealth management; Founded women-focused digital advisor; Advocate for pay equity',
  'Women and investing, gender pay gap, career advice, wealth building, financial inclusion'
),
(
  'cathie-wood',
  'Cathie Wood',
  'Founder & CEO',
  'ARK Invest',
  2100000,
  145000.00,
  'https://logo.clearbit.com/ark-invest.com',
  'Disruptive innovation investor who founded ARK Invest and gained fame for early bets on Tesla, Bitcoin, and genomics.',
  'Founded $50B+ innovation-focused ETFs; Early Tesla bull (bought at $200, rode to $1000+); Pioneer in thematic ETFs',
  'Disruptive innovation, electric vehicles, genomics, fintech, artificial intelligence, Bitcoin'
),
(
  'ruth-porat',
  'Ruth Porat',
  'President & CIO',
  'Alphabet',
  650000,
  42000.00,
  'https://logo.clearbit.com/abc.xyz',
  'Former Morgan Stanley CFO who became Google''s CFO and helped guide the tech giant''s financial strategy and moonshot projects.',
  'Former Morgan Stanley CFO during financial crisis; Google/Alphabet CFO since 2015; One of most powerful women in tech',
  'Tech finance, corporate strategy, financial discipline, moonshot projects, gender diversity'
),
(
  'paul-tudor-jones',
  'Paul Tudor Jones',
  'Founder',
  'Tudor Investment Corporation',
  720000,
  58000.00,
  null,
  'Legendary macro trader who predicted and profited from the 1987 Black Monday crash and became a philanthropist.',
  'Made 200% returns in 1987 crash; Built multi-billion dollar hedge fund; Robin Hood Foundation founder',
  'Macro trading, market crashes, technical analysis, philanthropy, income inequality'
),
(
  'jim-simons',
  'Jim Simons',
  'Founder',
  'Renaissance Technologies',
  450000,
  28000.00,
  null,
  'Mathematician who built the most successful quantitative hedge fund in history using mathematical models and algorithms.',
  'Founded Medallion Fund (66% annualized returns for 30 years); Former MIT and Harvard math professor; Billionaire philanthropist',
  'Quantitative trading, mathematical finance, algorithmic trading, scientific research philanthropy'
),
(
  'anne-boden',
  'Anne Boden',
  'Founder',
  'Starling Bank',
  520000,
  45000.00,
  'https://logo.clearbit.com/starlingbank.com',
  'Former RBS executive who founded one of the UK''s most successful digital challenger banks at age 55.',
  'Built £3B+ digital bank from scratch; Won UK banking license; Named OBE for services to financial technology',
  'Digital banking, fintech disruption, banking regulation, entrepreneurship later in life'
),
(
  'michael-bloomberg',
  'Michael Bloomberg',
  'Founder',
  'Bloomberg LP',
  1800000,
  89000.00,
  'https://logo.clearbit.com/bloomberg.com',
  'Built financial information empire after being fired from Salomon Brothers, became NYC mayor, and ran for president.',
  'Founded $10B+ financial data terminal business; 3-term NYC mayor; Spent $1B+ on presidential campaign',
  'Financial data, market information, climate change, gun control, political leadership'
),
(
  'warren-buffett',
  'Warren Buffett',
  'Chairman & CEO',
  'Berkshire Hathaway',
  2900000,
  134000.00,
  'https://logo.clearbit.com/berkshirehathaway.com',
  'The "Oracle of Omaha" - arguably the greatest investor of all time, known for value investing and annual shareholder letters.',
  'Built $700B+ conglomerate; 99.7% of wealth made after age 50; Pledged to give away 99% of fortune',
  'Value investing, business quality, long-term thinking, economic moats, annual letters'
)
ON CONFLICT (linkedin_id) DO NOTHING;