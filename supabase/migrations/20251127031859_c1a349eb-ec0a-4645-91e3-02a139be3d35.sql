-- Insert more universities across all regions with coordinates

-- AMERICAS - More universities
INSERT INTO public.universities (name, country, region, latitude, longitude, domain, student_count) VALUES
-- USA additions
('Dartmouth College', 'USA', 'AMERICA', 43.7044, -72.2887, 'dartmouth.edu', 6700),
('Brown University', 'USA', 'AMERICA', 41.8268, -71.4025, 'brown.edu', 10700),
('Boston University', 'USA', 'AMERICA', 42.3505, -71.1054, 'bu.edu', 36000),
('Georgia Tech', 'USA', 'AMERICA', 33.7756, -84.3963, 'gatech.edu', 44000),
('USC Marshall', 'USA', 'AMERICA', 34.0224, -118.2851, 'usc.edu', 49500),
('Notre Dame', 'USA', 'AMERICA', 41.7052, -86.2353, 'nd.edu', 12700),
('Vanderbilt University', 'USA', 'AMERICA', 36.1447, -86.8027, 'vanderbilt.edu', 13500),
('Rice University', 'USA', 'AMERICA', 29.7174, -95.4018, 'rice.edu', 8000),
('Emory University', 'USA', 'AMERICA', 33.7907, -84.3232, 'emory.edu', 15000),
('Washington University St Louis', 'USA', 'AMERICA', 38.6488, -90.3108, 'wustl.edu', 15000),
('University of Virginia', 'USA', 'AMERICA', 38.0336, -78.5080, 'virginia.edu', 25000),
('University of North Carolina', 'USA', 'AMERICA', 35.9049, -79.0469, 'unc.edu', 30000),
('University of Texas Austin', 'USA', 'AMERICA', 30.2849, -97.7341, 'utexas.edu', 51000),
('Indiana University Kelley', 'USA', 'AMERICA', 39.1753, -86.5127, 'iu.edu', 45000),
('Ohio State University', 'USA', 'AMERICA', 40.0067, -83.0305, 'osu.edu', 61000),
-- Canada additions
('Queens University', 'Canada', 'AMERICA', 44.2253, -76.4951, 'queensu.ca', 30000),
('Western University', 'Canada', 'AMERICA', 43.0096, -81.2737, 'uwo.ca', 34000),
('York University Schulich', 'Canada', 'AMERICA', 43.7735, -79.5019, 'schulich.yorku.ca', 12000),
('University of Alberta', 'Canada', 'AMERICA', 53.5232, -113.5263, 'ualberta.ca', 40000),
-- Latin America additions
('EGADE Business School', 'Mexico', 'AMERICA', 25.6580, -100.3615, 'egade.mx', 3000),
('FGV EAESP', 'Brazil', 'AMERICA', -23.5587, -46.6561, 'fgv.br', 8000),
('Insper', 'Brazil', 'AMERICA', -23.5985, -46.6761, 'insper.edu.br', 4500),
('Universidad de Chile', 'Chile', 'AMERICA', -33.4569, -70.6483, 'uchile.cl', 45000),
('ITBA', 'Argentina', 'AMERICA', -34.6037, -58.3816, 'itba.edu.ar', 4000),
('Universidad del Pacifico', 'Peru', 'AMERICA', -12.0969, -77.0258, 'up.edu.pe', 6000)
ON CONFLICT DO NOTHING;

-- EMEA - More universities
INSERT INTO public.universities (name, country, region, latitude, longitude, domain, student_count) VALUES
-- UK additions
('University of Manchester', 'UK', 'EMEA', 53.4668, -2.2339, 'manchester.ac.uk', 45000),
('University of Edinburgh', 'UK', 'EMEA', 55.9445, -3.1892, 'ed.ac.uk', 35000),
('University of Bristol', 'UK', 'EMEA', 51.4545, -2.5879, 'bristol.ac.uk', 28000),
('Durham University', 'UK', 'EMEA', 54.7650, -1.5782, 'dur.ac.uk', 20000),
('University of Bath', 'UK', 'EMEA', 51.3782, -2.3264, 'bath.ac.uk', 18000),
('City University London', 'UK', 'EMEA', 51.5280, -0.1025, 'city.ac.uk', 20000),
('Kings College London', 'UK', 'EMEA', 51.5115, -0.1160, 'kcl.ac.uk', 35000),
('UCL', 'UK', 'EMEA', 51.5246, -0.1340, 'ucl.ac.uk', 43000),
('Warwick Business School', 'UK', 'EMEA', 52.3838, -1.5616, 'wbs.ac.uk', 12000),
('Lancaster University', 'UK', 'EMEA', 54.0104, -2.7877, 'lancaster.ac.uk', 17000),
-- France additions
('EDHEC Business School', 'France', 'EMEA', 43.6115, 7.0530, 'edhec.edu', 9500),
('Emlyon Business School', 'France', 'EMEA', 45.7830, 4.8786, 'em-lyon.com', 8800),
('Toulouse Business School', 'France', 'EMEA', 43.6047, 1.4442, 'tbs-education.com', 5500),
('IESEG School of Management', 'France', 'EMEA', 50.6292, 3.0573, 'ieseg.fr', 7500),
('Grenoble Ecole de Management', 'France', 'EMEA', 45.1885, 5.7245, 'grenoble-em.com', 8000),
-- Germany additions
('Mannheim Business School', 'Germany', 'EMEA', 49.4875, 8.4660, 'mannheim-business-school.com', 4500),
('EBS Business School', 'Germany', 'EMEA', 50.0882, 8.2440, 'ebs.edu', 2500),
('HHL Leipzig', 'Germany', 'EMEA', 51.3397, 12.3731, 'hhl.de', 750),
-- Spain additions  
('ESADE', 'Spain', 'EMEA', 41.4036, 2.1744, 'esade.edu', 8000),
('IE Business School', 'Spain', 'EMEA', 40.4381, -3.6923, 'ie.edu', 9000),
('IESE Business School', 'Spain', 'EMEA', 41.4170, 2.1390, 'iese.edu', 2000),
('Universidad Carlos III', 'Spain', 'EMEA', 40.3318, -3.7653, 'uc3m.es', 22000),
('CUNEF', 'Spain', 'EMEA', 40.4460, -3.7089, 'cunef.edu', 3000),
('Universidad Pontificia Comillas ICADE', 'Spain', 'EMEA', 40.4351, -3.7227, 'comillas.edu', 12000),
-- Italy additions
('Bocconi University', 'Italy', 'EMEA', 45.4508, 9.1856, 'unibocconi.it', 14500),
('Politecnico di Milano', 'Italy', 'EMEA', 45.4784, 9.2275, 'polimi.it', 47000),
('LUISS Guido Carli', 'Italy', 'EMEA', 41.9241, 12.4925, 'luiss.it', 9000),
-- Netherlands additions
('Erasmus Rotterdam', 'Netherlands', 'EMEA', 51.9173, 4.5260, 'eur.nl', 30000),
('University of Amsterdam', 'Netherlands', 'EMEA', 52.3676, 4.9041, 'uva.nl', 42000),
('Tilburg University', 'Netherlands', 'EMEA', 51.5627, 5.0421, 'tilburguniversity.edu', 18000),
('VU Amsterdam', 'Netherlands', 'EMEA', 52.3342, 4.8659, 'vu.nl', 31000),
-- Switzerland additions
('ETH Zurich', 'Switzerland', 'EMEA', 47.3769, 8.5417, 'ethz.ch', 24000),
('University of Zurich', 'Switzerland', 'EMEA', 47.3744, 8.5508, 'uzh.ch', 28000),
('University of St Gallen HSG', 'Switzerland', 'EMEA', 47.4305, 9.3744, 'unisg.ch', 9500),
('IMD Lausanne', 'Switzerland', 'EMEA', 46.5196, 6.6322, 'imd.org', 2500),
('EPFL', 'Switzerland', 'EMEA', 46.5191, 6.5668, 'epfl.ch', 12000),
-- Nordic additions
('Stockholm School of Economics', 'Sweden', 'EMEA', 59.3388, 18.0620, 'hhs.se', 2000),
('NHH Bergen', 'Norway', 'EMEA', 60.3706, 5.3489, 'nhh.no', 3500),
('BI Norwegian Business School', 'Norway', 'EMEA', 59.9494, 10.7686, 'bi.no', 20000),
('CBS Copenhagen', 'Denmark', 'EMEA', 55.6807, 12.5302, 'cbs.dk', 23000),
('Hanken School of Economics', 'Finland', 'EMEA', 60.1713, 24.9216, 'hanken.fi', 2500),
-- Belgium additions
('Vlerick Business School', 'Belgium', 'EMEA', 51.0500, 3.7250, 'vlerick.com', 3500),
('Solvay Brussels School', 'Belgium', 'EMEA', 50.8117, 4.3808, 'solvay.edu', 4000),
-- Ireland additions
('Trinity College Dublin', 'Ireland', 'EMEA', 53.3438, -6.2546, 'tcd.ie', 18000),
('UCD Michael Smurfit', 'Ireland', 'EMEA', 53.3084, -6.2267, 'smurfitschool.ie', 4500),
-- Portugal
('Nova SBE', 'Portugal', 'EMEA', 38.6780, -9.3180, 'novasbe.pt', 6000),
('Universidade Catolica Portuguesa', 'Portugal', 'EMEA', 38.7223, -9.1393, 'ucp.pt', 14000),
-- Poland
('SGH Warsaw', 'Poland', 'EMEA', 52.2083, 21.0099, 'sgh.waw.pl', 14000),
('Kozminski University', 'Poland', 'EMEA', 52.2573, 21.0078, 'kozminski.edu.pl', 9000),
-- Czech Republic
('VSE Prague', 'Czech Republic', 'EMEA', 50.0840, 14.4419, 'vse.cz', 16000),
-- Middle East
('Tel Aviv University', 'Israel', 'EMEA', 32.1133, 34.8044, 'tau.ac.il', 30000),
('Hebrew University Jerusalem', 'Israel', 'EMEA', 31.7945, 35.2433, 'huji.ac.il', 23000),
('KAUST', 'Saudi Arabia', 'EMEA', 22.3095, 39.1039, 'kaust.edu.sa', 1200),
('NYU Abu Dhabi', 'UAE', 'EMEA', 24.5234, 54.4340, 'nyuad.nyu.edu', 2000),
('INSEAD Abu Dhabi', 'UAE', 'EMEA', 24.4539, 54.3773, 'insead.edu', 1200),
-- South Africa
('University of Cape Town', 'South Africa', 'EMEA', -33.9577, 18.4612, 'uct.ac.za', 29000),
('University of Witwatersrand', 'South Africa', 'EMEA', -26.1929, 28.0305, 'wits.ac.za', 40000)
ON CONFLICT DO NOTHING;

-- ASIA - More universities  
INSERT INTO public.universities (name, country, region, latitude, longitude, domain, student_count) VALUES
-- China additions
('Fudan University', 'China', 'ASIA', 31.2989, 121.5015, 'fudan.edu.cn', 35000),
('Shanghai Jiao Tong University', 'China', 'ASIA', 31.0277, 121.4322, 'sjtu.edu.cn', 46000),
('Zhejiang University', 'China', 'ASIA', 30.2636, 120.1219, 'zju.edu.cn', 60000),
('Renmin University', 'China', 'ASIA', 39.9692, 116.3188, 'ruc.edu.cn', 28000),
('CEIBS', 'China', 'ASIA', 31.2304, 121.5290, 'ceibs.edu', 2000),
('CKGSB', 'China', 'ASIA', 39.9885, 116.4808, 'ckgsb.edu.cn', 1500),
('Nanjing University', 'China', 'ASIA', 32.0603, 118.7969, 'nju.edu.cn', 35000),
-- Hong Kong additions
('CUHK', 'Hong Kong', 'ASIA', 22.4196, 114.2068, 'cuhk.edu.hk', 20000),
('City University of Hong Kong', 'Hong Kong', 'ASIA', 22.3364, 114.1733, 'cityu.edu.hk', 20000),
('PolyU Hong Kong', 'Hong Kong', 'ASIA', 22.3036, 114.1795, 'polyu.edu.hk', 32000),
-- Japan additions
('Keio University', 'Japan', 'ASIA', 35.6478, 139.7458, 'keio.ac.jp', 34000),
('Waseda University', 'Japan', 'ASIA', 35.7090, 139.7199, 'waseda.jp', 44000),
('Kyoto University', 'Japan', 'ASIA', 35.0280, 135.7810, 'kyoto-u.ac.jp', 23000),
('Hitotsubashi University', 'Japan', 'ASIA', 35.7021, 139.4186, 'hit-u.ac.jp', 6200),
('Tokyo Institute of Technology', 'Japan', 'ASIA', 35.6026, 139.6836, 'titech.ac.jp', 10000),
-- South Korea additions
('Seoul National University', 'South Korea', 'ASIA', 37.4563, 126.9520, 'snu.ac.kr', 28000),
('KAIST', 'South Korea', 'ASIA', 36.3700, 127.3634, 'kaist.ac.kr', 11000),
('Korea University', 'South Korea', 'ASIA', 37.5894, 127.0323, 'korea.ac.kr', 37000),
('Yonsei University', 'South Korea', 'ASIA', 37.5656, 126.9386, 'yonsei.ac.kr', 38000),
('SKK Graduate School of Business', 'South Korea', 'ASIA', 37.5894, 126.9931, 'skku.edu', 3000),
-- India additions
('IIM Ahmedabad', 'India', 'ASIA', 23.0339, 72.5299, 'iima.ac.in', 1400),
('IIM Bangalore', 'India', 'ASIA', 12.9986, 77.5711, 'iimb.ac.in', 3000),
('IIM Calcutta', 'India', 'ASIA', 22.4982, 88.4044, 'iimcal.ac.in', 2500),
('ISB Hyderabad', 'India', 'ASIA', 17.4245, 78.5516, 'isb.edu', 1200),
('IIT Delhi', 'India', 'ASIA', 28.5450, 77.1926, 'iitd.ac.in', 11000),
('IIT Bombay', 'India', 'ASIA', 19.1334, 72.9133, 'iitb.ac.in', 11500),
('XLRI Jamshedpur', 'India', 'ASIA', 22.7865, 86.1544, 'xlri.ac.in', 600),
-- Southeast Asia
('NUS Business School', 'Singapore', 'ASIA', 1.2966, 103.7764, 'nus.edu.sg', 5000),
('SMU Singapore', 'Singapore', 'ASIA', 1.2966, 103.8492, 'smu.edu.sg', 10000),
('Chulalongkorn University', 'Thailand', 'ASIA', 13.7367, 100.5335, 'chula.ac.th', 38000),
('National Taiwan University', 'Taiwan', 'ASIA', 25.0174, 121.5405, 'ntu.edu.tw', 32000),
('University of the Philippines', 'Philippines', 'ASIA', 14.6538, 121.0687, 'up.edu.ph', 56000),
('Universitas Indonesia', 'Indonesia', 'ASIA', -6.3606, 106.8280, 'ui.ac.id', 47000),
('University of Malaya', 'Malaysia', 'ASIA', 3.1209, 101.6540, 'um.edu.my', 25000),
-- Australia (ASIA-PACIFIC)
('University of Melbourne', 'Australia', 'ASIA', -37.7963, 144.9614, 'unimelb.edu.au', 52000),
('University of Sydney', 'Australia', 'ASIA', -33.8885, 151.1873, 'sydney.edu.au', 73000),
('UNSW Sydney', 'Australia', 'ASIA', -33.9173, 151.2313, 'unsw.edu.au', 63000),
('Australian National University', 'Australia', 'ASIA', -35.2777, 149.1185, 'anu.edu.au', 25000),
('Monash University', 'Australia', 'ASIA', -37.9100, 145.1356, 'monash.edu', 86000),
-- New Zealand
('University of Auckland', 'New Zealand', 'ASIA', -36.8509, 174.7689, 'auckland.ac.nz', 45000)
ON CONFLICT DO NOTHING;