-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Okt 2026 pada 15.52
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_stbtoefl`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bank_soal`
--

CREATE TABLE `bank_soal` (
  `id` int(10) UNSIGNED NOT NULL,
  `nomor_section` tinyint(3) UNSIGNED NOT NULL COMMENT '1=Listening, 2=Structure, 3=Reading',
  `nama_bagian` varchar(30) DEFAULT NULL COMMENT 'Part A, Part B, Part C',
  `wacana_id` int(10) UNSIGNED DEFAULT NULL,
  `berkas_audio` varchar(255) DEFAULT NULL COMMENT 'Audio MP3 untuk Section 1',
  `pertanyaan` text NOT NULL,
  `pilihan_a` text NOT NULL,
  `pilihan_b` text NOT NULL,
  `pilihan_c` text NOT NULL,
  `pilihan_d` text NOT NULL,
  `jawaban_benar` enum('A','B','C','D') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bank_soal`
--

INSERT INTO `bank_soal` (`id`, `nomor_section`, `nama_bagian`, `wacana_id`, `berkas_audio`, `pertanyaan`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`) VALUES
(30, 2, NULL, NULL, NULL, 'The North Platte River ______ from Wyoming into Nebraska.', 'it flowed', 'flows', 'flowing', 'with flowing', 'B'),
(31, 2, NULL, NULL, NULL, '______ Biloxi received its name from a Sioux word meaning \'first people.\'', 'The city of', 'It is the city', 'That the city', 'The city', 'A'),
(32, 2, NULL, NULL, NULL, 'A pride of lions ______ up to forty members, including adult males, females, and cubs.', 'can contain', 'contains often', 'containing', 'which contains', 'A'),
(33, 2, NULL, NULL, NULL, '______ tea plant is an evergreen shrub with dark green, thick leaves.', 'That', 'The', 'It is the', 'Which the', 'B'),
(34, 2, NULL, NULL, NULL, 'Not until the late nineteenth century ______ widespread use.', 'did bicycles gain', 'bicycles gained', 'that bicycles gained', 'bicycles have gained', 'A'),
(35, 2, NULL, NULL, NULL, 'The edible portion of a walnut is the seed, ______ inside a hard shell.', 'which enclosed', 'enclosed', 'where enclosed', 'it is enclosed', 'B'),
(36, 2, NULL, NULL, NULL, '______ in the atmosphere, carbon dioxide traps heat radiated from Earth\'s surface.', 'Present', 'It is present', 'When presents', 'Presence', 'A'),
(37, 2, NULL, NULL, NULL, 'Rarely ______ located near volcanic areas without encountering geothermal activity.', 'geologists are', 'do geologists', 'are geologists', 'geologists do', 'C'),
(38, 2, NULL, NULL, NULL, 'The Missouri River, ______ largest tributary of the Mississippi, originates in Montana.', 'the', 'which the', 'is the', 'it is the', 'A'),
(39, 2, NULL, NULL, NULL, 'Neither the coach nor the players ______ pleased with the referee\'s final decision.', 'was', 'were', 'is', 'being', 'B'),
(40, 2, NULL, NULL, NULL, 'Although ______ extensively for cargo, nineteenth-century canals faced steep rail competition.', 'used', 'they used', 'using', 'were used', 'A'),
(41, 2, NULL, NULL, NULL, 'A hummingbird\'s heart beats at an astonishing rate, ______ over 1,000 times per minute.', 'often exceeding', 'exceeds often', 'often exceeded', 'which often exceed', 'A'),
(42, 2, NULL, NULL, NULL, '______ known as \'fool\'s gold\' because of its striking resemblance to real gold.', 'Iron pyrite is', 'It is iron pyrite', 'Because iron pyrite', 'That iron pyrite', 'A'),
(43, 2, NULL, NULL, NULL, 'Only after completing rigorous clinical trials ______ approved by regulatory authorities.', 'the drug was', 'was the drug', 'did the drug', 'the drug had', 'B'),
(44, 2, NULL, NULL, NULL, 'The clearer the water in a coral reef, ______ sunlight penetrates to nourish the algae.', 'the more', 'more', 'the most', 'most', 'A'),
(45, 2, NULL, NULL, NULL, 'Mammals are warm-blooded creatures that regulate ______ body temperature internally.', 'their', 'its', 'theirs', 'them', 'A'),
(46, 2, NULL, NULL, NULL, 'Mount McKinley, located in Alaska, is ______ peak in North America.', 'the highest', 'higher', 'highest', 'as high', 'A'),
(47, 2, NULL, NULL, NULL, 'Photovoltaic cells convert sunlight ______ into electrical energy.', 'directly', 'direct', 'direction', 'directness', 'A'),
(48, 2, NULL, NULL, NULL, 'The invention of movable type ______ information to spread rapidly across Europe.', 'enabled', 'enabling', 'enable', 'enables to', 'A'),
(49, 2, NULL, NULL, NULL, '______ minerals have a crystalline structure with atoms arranged in regular patterns.', 'Most', 'Almost', 'Mostly', 'The most', 'A'),
(50, 2, NULL, NULL, NULL, 'Before glass blowing was developed, craftsmen fashioned vessels by ______ hot glass.', 'winding', 'wind', 'wound', 'winds', 'A'),
(51, 2, NULL, NULL, NULL, 'The giant sequoia tree survives forest fires because ______ thick bark insulates its trunk.', 'its', 'it\'s', 'their', 'they\'re', 'A'),
(52, 2, NULL, NULL, NULL, 'Under no circumstances ______ unattended in the chemical laboratory.', 'flammable liquids should be left', 'should flammable liquids be left', 'flammable liquids be left', 'are flammable liquids leave', 'B'),
(53, 2, NULL, NULL, NULL, 'The sonar system helps marine mammals navigate underwater and ______ prey.', 'detect', 'detecting', 'detected', 'detection', 'A'),
(54, 2, NULL, NULL, NULL, 'Benjamin Franklin was renowned not only as a statesman ______ as an ingenious inventor.', 'and also', 'but also', 'as well', 'in addition', 'B'),
(55, 2, NULL, NULL, NULL, 'A tornado is a violently rotating column of air ______ contact with the ground.', 'in', 'with', 'by', 'on', 'A'),
(56, 2, NULL, NULL, NULL, '______ simple tools, early humans successfully constructed enduring stone monuments.', 'Using', 'Used', 'Use of', 'They used', 'A'),
(57, 2, NULL, NULL, NULL, 'The higher the altitude above sea level, ______ atmospheric pressure becomes.', 'the lower', 'lower', 'the lowest', 'lowest', 'A'),
(58, 2, NULL, NULL, NULL, 'A majority of freshwater lakes in North America ______ formed by glacial movement.', 'were', 'was', 'are', 'is', 'A'),
(59, 2, NULL, NULL, NULL, 'Antibiotics are ineffective against viral illnesses ______ they specifically target bacteria.', 'because', 'so', 'unless', 'despite', 'A'),
(60, 2, NULL, NULL, NULL, 'Had the warning sirens sounded earlier, the residents ______ sufficient time to evacuate.', 'would have had', 'will have', 'had had', 'would have', 'A'),
(61, 2, NULL, NULL, NULL, 'The bald eagle, once ______ extinction, made a remarkable recovery under federal protection.', 'threatened with', 'threaten by', 'threatening to', 'was threatened with', 'A'),
(62, 2, NULL, NULL, NULL, 'Granite is an igneous rock formed ______ deep beneath the Earth\'s crust.', 'by magma cooling', 'when magma cools', 'as cooling magma', 'cooling by magma', 'B'),
(63, 2, NULL, NULL, NULL, 'No sooner had the expedition reached the summit ______ severe snowstorms struck.', 'when', 'than', 'then', 'until', 'B'),
(64, 2, NULL, NULL, NULL, 'The violin is widely regarded ______ one of the most versatile orchestral instruments.', 'as', 'to be', 'being', 'like', 'A'),
(65, 2, NULL, NULL, NULL, 'Desalination removes dissolved mineral salts from seawater, ______ potable water.', 'producing', 'produces', 'produced', 'produce', 'A'),
(66, 2, NULL, NULL, NULL, 'So dense ______ the fog that all outbound commercial flights were delayed.', 'was', 'it was', 'did', 'became', 'A'),
(67, 2, NULL, NULL, NULL, 'In 1969, Neil Armstrong became the first human ______ on the surface of the Moon.', 'to walk', 'walked', 'walking', 'walk', 'A'),
(68, 2, NULL, NULL, NULL, 'Sound waves travel much faster through dense solids ______ through air or water.', 'than', 'as', 'from', 'to', 'A'),
(69, 2, NULL, NULL, NULL, '______ by ocean currents and wind patterns, coastal climates tend to remain moderate.', 'Influenced', 'Influencing', 'Influence', 'To influence', 'A'),
(70, 3, NULL, 5, NULL, 'What is the primary topic of the passage?', 'The geological formation and hydrothermal features of Yellowstone', 'The historical eruptions of supervolcanoes worldwide', 'The ecological impact of volcanic ash on Wyoming', 'The discovery and protection of Old Faithful', 'A'),
(71, 3, NULL, 5, NULL, 'The word \"catastrophic\" in line 2 is closest in meaning to', 'gradual', 'disastrous', 'predictable', 'minor', 'B'),
(72, 3, NULL, 5, NULL, 'According to paragraph 1, how was the Yellowstone Caldera formed?', 'By continuous glacial erosion over millions of years', 'Through human excavation in northwestern Wyoming', 'During three massive volcanic eruptions', 'By a sudden shift in underground tectonic fault lines', 'C'),
(73, 3, NULL, 5, NULL, 'What directly causes groundwater beneath Yellowstone to become superheated?', 'Intense atmospheric pressure at high altitudes', 'Underlying molten rock and magma reservoirs', 'Chemical reactions between hot springs and sulfur', 'Radiation produced by thermophilic bacteria', 'B'),
(74, 3, NULL, 5, NULL, 'The word \"ejecting\" in line 7 is closest in meaning to', 'absorbing', 'forcing out', 'cooling down', 'filtering', 'B'),
(75, 3, NULL, 5, NULL, 'Why does water erupt from geysers instead of simply boiling gently?', 'Pressure drops suddenly, allowing steam to expand rapidly', 'Cold surface air freezes the rising columns of liquid', 'Subsurface channels are blocked by volcanic ash', 'Bacterial colonies trigger subterranean explosions', 'A'),
(76, 3, NULL, 5, NULL, 'What gives the Grand Prismatic Spring its distinct, brilliant colors?', 'Industrial chemical pollutants left by visitors', 'Suspended minerals dissolved from limestone beds', 'Pigmented mats of heat-tolerant microorganisms', 'Reflections from nearby sulfurous mountain slopes', 'C'),
(77, 3, NULL, 5, NULL, 'The author mentions \"extremophiles\" in line 10 in order to describe organisms that', 'cannot survive outside warm ocean water', 'prosper under extraordinarily severe environmental conditions', 'cause extensive damage to hydrothermal rock structures', 'rely entirely on photosynthesis in dark caves', 'B'),
(78, 3, NULL, 5, NULL, 'The word \"shield\" in line 11 is closest in meaning to', 'protect', 'expose', 'convert', 'diminish', 'A'),
(79, 3, NULL, 5, NULL, 'Which of the following can be inferred about the Yellowstone Caldera?', 'It has become completely dormant and poses no future threat', 'It continues to be thermally active beneath the Earth\'s surface', 'It was discovered only after the invention of modern drilling technology', 'Its geysers have ceased erupting due to climatic changes', 'B'),
(80, 3, NULL, 6, NULL, 'What does the passage mainly discuss?', 'The biological life cycle of common Canadian insects', 'The navigational mechanisms and migratory journey of monarch butterflies', 'Deforestation practices in Mexican mountain ecosystems', 'The impact of synthetic pesticides on wildflower growth', 'B'),
(81, 3, NULL, 6, NULL, 'The phrase \"multi-generational\" indicates that the migration', 'is completed by a single insect over decades', 'involves successive generations completing different legs of the journey', 'occurs only once every hundred years in nature', 'requires butterflies to breed before leaving northern climates', 'B'),
(82, 3, NULL, 6, NULL, 'How does the \'methuselah\' generation differ from earlier summer generations?', 'It has an extended lifespan and delayed reproduction', 'It feeds on nectar rather than blooming wildflowers', 'It travels exclusively during cloudy nocturnal hours', 'It lacks wings capable of sustaining high-altitude flight', 'A'),
(83, 3, NULL, 6, NULL, 'The word \"intricate\" in line 7 is closest in meaning to', 'simple', 'complex', 'fragile', 'ancient', 'B'),
(84, 3, NULL, 6, NULL, 'According to the text, where is the monarch\'s sun compass mechanism located?', 'In the scales covering their thoracic wings', 'In their antennae and central brain structures', 'In the compound eyes and abdominal segments', 'Exclusively within the respiratory spiracles', 'B'),
(85, 3, NULL, 6, NULL, 'What is the function of the internal circadian clock during monarch migration?', 'It signals when winter temperatures become lethal', 'It compensates for the changing position of the sun during the day', 'It stimulates rapid egg production during flight', 'It enables monarchs to sense magnetic polar north', 'B'),
(86, 3, NULL, 6, NULL, 'The word \"eliminates\" in line 11 is closest in meaning to', 'spreads', 'destroys', 'cultivates', 'alters', 'B'),
(87, 3, NULL, 6, NULL, 'Why is milkweed essential to the survival of monarch butterflies?', 'It provides the exclusive canopy shelter during Mexican winters', 'It is the only plant species eaten by monarch caterpillars', 'It repels avian predators with unpleasant scents', 'It stores critical water supplies for adult migrating insects', 'B'),
(88, 3, NULL, 6, NULL, 'According to paragraph 2, which factor has contributed to monarch population decline?', 'Competition from non-native migratory dragonflies', 'Forest destruction in their Mexican wintering habitats', 'Unusually cold summers across southern Canada', 'A decrease in solar radiation detected by cryptochromes', 'B'),
(89, 3, NULL, 6, NULL, 'It can be inferred from the passage that monarch butterflies migrating to Mexico', 'have never visited the Mexican overwintering sites before', 'navigate solely by recognizing physical landmarks on the ground', 'travel only when thick cloud cover hides the sun', 'mate repeatedly throughout their southward flight', 'A'),
(90, 3, NULL, 7, NULL, 'What is the main idea of the passage?', 'The economic rivalry between French and Roman stone masons', 'The engineering innovations and civic role of Gothic cathedrals', 'The theological symbolism of stained glass windows in Europe', 'The destruction of medieval religious monuments in France', 'B'),
(91, 3, NULL, 7, NULL, 'The word \"departure\" in line 1 is closest in meaning to', 'arrival', 'divergence', 'reinforcement', 'failure', 'B'),
(92, 3, NULL, 7, NULL, 'How did the Gothic style differ noticeably from the Romanesque style?', 'It featured heavier and thicker outer stone walls', 'It achieved greater vertical height and abundant interior illumination', 'It abandoned stone masonry in favor of timber beams', 'It eliminated exterior decorative sculptures entirely', 'B'),
(93, 3, NULL, 7, NULL, 'Why was the pointed arch superior to the semicircular arch?', 'It channeled structural weight more vertically, minimizing outward thrust', 'It was easier to construct without wooden scaffolding', 'It allowed water to drain more quickly from exterior parapets', 'It required significantly less quarried limestone', 'A'),
(94, 3, NULL, 7, NULL, 'The word \"pierced\" in line 9 is closest in meaning to', 'penetrated', 'reinforced', 'demolished', 'shadowed', 'A'),
(95, 3, NULL, 7, NULL, 'What was the primary structural purpose of flying buttresses?', 'To support delicate stained glass frames directly from the wind', 'To convey lateral ceiling weight outward to external masonry piers', 'To provide elevated scaffolding for cathedral painters', 'To connect the cathedral roof to adjacent administrative buildings', 'B'),
(96, 3, NULL, 7, NULL, 'According to the passage, why could Gothic builders install expansive stained glass windows?', 'New glassmaking techniques made panes virtually indestructible', 'Outer walls no longer bore the entire structural load of the roof', 'Clergy members demanded brightly lit crypts for religious rites', 'Interior iron beams replaced exterior stone pillars', 'B'),
(97, 3, NULL, 7, NULL, 'The word \"epicenter\" in line 11 refers to a', 'boundary line', 'central focus', 'hidden retreat', 'temporary market', 'B'),
(98, 3, NULL, 7, NULL, 'All of the following are mentioned as structural innovations of Gothic architecture EXCEPT', 'pointed arches', 'flying buttresses', 'concrete domes', 'ribbed vaults', 'C'),
(99, 3, NULL, 7, NULL, 'It can be inferred from the passage that Gothic cathedrals', 'were funded and utilized solely by monastic hermits', 'held great cultural and financial significance for medieval cities', 'collapsed frequently due to excessive wall height', 'were designed without any mathematical planning', 'B'),
(100, 3, NULL, 8, NULL, 'Which of the following is the best title for the passage?', 'Deep-Sea Trenches and Oceanic Trenches', 'The Mechanism of Ocean Gyres and Plastic Accumulation', 'The Global Extinction of Marine Zooplankton', 'Atmospheric Storms across Equatorial Regions', 'B'),
(101, 3, NULL, 8, NULL, 'The Coriolis effect is caused by', 'gravitational pull from the Moon', 'the rotational motion of the Earth', 'temperature differences between ocean layers', 'seasonal variations in tropical trade winds', 'B'),
(102, 3, NULL, 8, NULL, 'According to paragraph 1, how do surface currents deflect in the Northern Hemisphere?', 'To the left of their path of motion', 'Directly toward the equator', 'To the right of their path of motion', 'Vertically toward the ocean floor', 'C'),
(103, 3, NULL, 8, NULL, 'The word \"deflects\" in line 6 is closest in meaning to', 'diverts', 'halts', 'strengthens', 'heats', 'A'),
(104, 3, NULL, 9, NULL, 'What historical role have subtropical gyres played in global ecology?', 'Preventing warm water from escaping polar regions', 'Transferring equatorial heat toward higher latitudes', 'Blocking powerful hurricanes from reaching continents', 'Filtering natural sediment from continental rivers', 'B'),
(105, 3, NULL, 8, NULL, 'The word \"anthropogenic\" in line 8 describes pollution that is', 'caused by human activities', 'generated by undersea volcanism', 'naturally decomposing over time', 'confined strictly to freshwater lakes', 'A'),
(106, 3, NULL, 8, NULL, 'Why does synthetic debris tend to gather inside the center of gyres?', 'Centrifugal forces propel waste toward shoreline rocks', 'Interior waters are relatively calm and circulating inward', 'Dense ocean currents pull plastics down into deep abyssal plains', 'Commercial ships legally discard garbage in marine centers', 'B'),
(107, 3, NULL, 8, NULL, 'The word \"degrade\" in line 10 is closest in meaning to', 'break down', 'multiply', 'crystallize', 'disinfect', 'A'),
(108, 3, NULL, 8, NULL, 'How do microplastics pose a severe threat to marine ecosystems?', 'They block sunlight from penetrating into coastal tide pools', 'They are ingested by marine organisms and bioaccumulate in the food chain', 'They accelerate the rate of ocean water evaporation', 'They alter the directional flow of global trade winds', 'B'),
(109, 3, NULL, 8, NULL, 'It can be inferred from the passage that plastics in ocean gyres', 'disappear completely after several weeks of sunlight exposure', 'cannot be easily removed due to their microscopic fragmentation', 'sink immediately to the ocean floor without interacting with sea life', 'originate almost exclusively from polar scientific expeditions', 'B'),
(110, 3, NULL, 10, NULL, 'What is the primary focus of the passage?', 'The evolutionary decline of forest bird populations', 'The sophisticated cognitive and problem-solving skills of corvids', 'The dietary habits of migratory songbirds in winter', 'The physical anatomy of New Caledonian tree species', 'B'),
(111, 3, NULL, 10, NULL, 'Which birds belong to the corvid family according to the text?', 'Pigeons, eagles, and owls', 'Ravens, crows, rooks, and jays', 'Ducks, geese, and swans', 'Parrots, flamingos, and pelicans', 'B'),
(112, 3, NULL, 10, NULL, 'The word \"rivaling\" in line 4 is closest in meaning to', 'matching', 'ignoring', 'surpassing', 'preventing', 'A'),
(113, 3, NULL, 10, NULL, 'How do corvid brains achieve high cognitive function without a mammalian cortex?', 'They rely exclusively on instinctual genetic programming', 'They possess an exceptionally dense neural structure called the nidopallium', 'Their brains are larger in total mass than those of adult chimpanzees', 'They maintain multiple independent forebrain lobes for sensory tasks', 'B'),
(114, 3, NULL, 10, NULL, 'The word \"implements\" in line 8 is closest in meaning to', 'tools', 'barriers', 'substances', 'shelters', 'A'),
(115, 3, NULL, 10, NULL, 'What do New Caledonian crows utilize to extract food from tree crevices?', 'Artificially colored glass beads', 'Handmade hooks fashioned from twigs and leaves', 'Polished pebbles dropped from high branches', 'Water currents blown into bark hollows', 'B'),
(116, 3, NULL, 10, NULL, 'According to paragraph 2, Western scrub-jays demonstrate social foresight by', 'sharing food caches equally with younger birds', 're-hiding food stores when they notice rival birds watching', 'abandoning food foraging during colder winter periods', 'migrating south in coordinated tactical formations', 'B'),
(117, 3, NULL, 10, NULL, 'The word \"perishable\" in line 10 refers to items that', 'cannot be digested', 'spoil or decay quickly', 'are toxic to predators', 'remain fresh indefinitely', 'B'),
(118, 3, NULL, 10, NULL, 'The author mentions \"episodic memory\" to illustrate that corvids can remember', 'specific events, locations, and timestamps from the past', 'only basic flight paths between nests', 'unpleasant sounds made by approaching predators', 'the structural blueprints of foreign bird nests', 'A'),
(119, 3, NULL, 10, NULL, 'What can be inferred about corvid problem-solving abilities?', 'They are purely accidental responses without cognitive intent', 'They demonstrate flexible intelligence comparable to higher primates', 'They are limited only to captive birds trained by humans', 'They decline sharply when birds are required to use tools', 'B'),
(180, 1, 'Part A', NULL, 'question 1.wav', 'What does the man tell the woman about her book?', 'She will have to pay a small fine for the two extra days.', 'It is not overdue yet.', 'The loan period for graduate students has been shortened.', 'She must renew it online before leaving the library.', 'B'),
(181, 1, 'Part A', NULL, 'question 2', 'What will the student most likely do next?', 'Present his project to the class on Friday.', 'Ask his lab partner to write the paper for him.', 'Visit the professor\'s office again on Monday.', 'Send the professor a message explaining the scheduling conflict.', 'D'),
(182, 1, 'Part A', NULL, 'question 3', 'What does the man say about the winter housing exception?', 'Any student with a faculty sponsor may apply for it.', 'It is available exclusively to international students.', 'It is granted automatically to students writing a thesis.', 'The application period ended last Wednesday.', 'A'),
(183, 1, 'Part A', NULL, 'question 4', 'What does the woman imply about the study group?', 'She plans to stop attending it.', 'It covered topics unrelated to the exam.', 'It helped her prepare effectively for the exam.', 'It required too much of her time.', 'C'),
(184, 1, 'Part A', NULL, 'question 5', 'What will the woman most likely do tomorrow?', 'Begin working evening shifts at the bookstore.', 'Tutor other students in the bookstore.', 'Go to the bookstore to complete some paperwork.', 'Apply for a job at the tutoring center.', 'C'),
(185, 1, 'Part A', NULL, 'question 6.wav', 'Why does the woman suggest freezing the membership?', 'The man could avoid paying a higher price later.', 'The gym will refund the money he has already spent.', 'Students are not allowed to cancel their memberships.', 'The man will be able to attend classes for free.', 'A'),
(186, 1, 'Part A', NULL, 'question 7.wav', 'What does the man suggest the woman do?', 'Read the article a second time before class.', 'Ask the professor to assign a different reading.', 'Copy his notes from the lecture.', 'Look at the summary materials posted online.', 'D'),
(187, 1, 'Part A', NULL, 'question 8.wav', 'Why is the man unable to register for the course?', 'He did not pass the prerequisite course.', 'His transfer credits have not yet been recorded.', 'The class has already reached its enrollment limit.', 'He missed the registration deadline.', 'B'),
(188, 1, 'Part A', NULL, 'question 9.wav', 'What will happen if the weather is too dangerous for the trip?', 'The trip will be postponed until the following week.', 'The professor will provide the students with data.', 'The report will no longer be required.', 'The class will visit a geology museum instead.', 'B'),
(189, 1, 'Part A', NULL, 'question 10.wav', 'What concern does the woman raise about the apartment?', 'The rent may increase next year.', 'The apartment is too small for two people.', 'The neighborhood is not safe at night.', 'The man might have trouble getting home late.', 'D'),
(190, 1, 'Part A', NULL, 'question 11.wav', 'What does the man imply about the research position?', 'She should decline it because the pay is too low.', 'She should negotiate for more working hours.', 'It could strengthen her applications for graduate school.', 'It would prevent her from working on weekends.', 'C'),
(191, 1, 'Part A', NULL, 'question 12.wav', 'What does the woman offer to do?', 'Print the man\'s paper for him.', 'Repair the printer in the computer lab.', 'Ask the technician to arrive earlier.', 'Request an extension from the instructor.', 'A'),
(192, 1, 'Part A', NULL, 'question 13.wav', 'What did the woman miss during the lecture?', 'An announcement that a quiz had been rescheduled.', 'A quiz covering several chapters.', 'A review session for the final exam.', 'An assignment that is due on Friday.', 'A'),
(193, 1, 'Part A', NULL, 'question 14.wav', 'What is the woman worried about?', 'She does not have enough money for lunch.', 'Her laptop may not work properly.', 'A required document may not arrive before the deadline.', 'She has already missed the application deadline.', 'C'),
(194, 1, 'Part A', NULL, 'question 15.wav', 'What does the woman still need to do?', 'Retake the composition course.', 'Improve her grade to a B-plus.', 'Request a new copy of her transcript from the registrar.', 'Obtain a recommendation from a faculty member.', 'D'),
(195, 1, 'Part A', NULL, 'question 16.wav', 'What does the woman decide to do?', 'Use the online exhibit for her assignment.', 'Visit the museum in person on Thursday.', 'Ask the professor for a different assignment.', 'Pay for a museum ticket on the weekend.', 'B'),
(196, 1, 'Part A', NULL, 'question 17.wav', 'What can be inferred about the man?', 'He has not started his lab report.', 'He regularly uses planners to organize his work.', 'He believes the woman\'s strategy is unrealistic.', 'He has difficulty applying organizational tools consistently.', 'D'),
(197, 1, 'Part A', NULL, 'question 18.wav', 'What is the purpose of the conversation partner program?', 'To pair international students with local students for language practice.', 'To provide free English classes for new arrivals.', 'To help international students find housing near campus.', 'To train local students as language teachers.', 'A'),
(198, 1, 'Part A', NULL, 'question 19.wav', 'What do the speakers decide to do?', 'Report their results exactly as they obtained them.', 'Ask the professor to correct the textbook.', 'Repeat the experiment while monitoring the conditions more carefully.', 'Replace the thermometer with a new one immediately.', 'C'),
(199, 1, 'Part A', NULL, 'question 20.wav', 'What does the woman recommend?', 'Memorizing the speech word for word.', 'Using brief keyword notes to guide his talk.', 'Postponing the presentation until next week.', 'Practicing the speech in front of the instructor.', 'B'),
(200, 1, 'Part A', NULL, 'question 21.wav', 'Why was the woman\'s phone bill so high?', 'She made a late payment last month.', 'She switched to a more expensive plan.', 'She used more mobile data than her plan allowed.', 'The company charged her by mistake.', 'C'),
(201, 1, 'Part A', NULL, 'question 22.wav', 'What is the man\'s attitude toward the woman\'s idea?', 'He is delighted by it.', 'He believes it is impossible to carry out.', 'He thinks she should consult her family first.', 'He is concerned about whether she has enough time.', 'D'),
(202, 1, 'Part A', NULL, 'question 23.wav', 'What does the woman suggest the man do?', 'Appeal the ticket and include a photograph.', 'Pay the fine before the end of the week.', 'Apply for a faculty parking permit.', 'Park in lot C only after five o\'clock.', 'A'),
(203, 1, 'Part A', NULL, 'question 24', 'What does the man suggest?', 'Reducing the number of survey questions.', 'Asking instructors to promote the survey in class.', 'Using only the responses she already has.', 'Offering a small reward to participants.', 'B'),
(204, 1, 'Part A', NULL, 'question 25', 'What surprised the woman about her internship?', 'The amount of time she spent traveling.', 'The low salary she was offered.', 'The friendliness of her coworkers.', 'The significance of the project she was assigned.', 'D'),
(205, 2, NULL, NULL, NULL, 'Not only _______ the experiment fail to support the hypothesis, but it also revealed a flaw in the research method.', 'the experiment did', 'was the experiment', 'the experiment has', 'did the experiment', 'D'),
(206, 2, NULL, NULL, NULL, 'Each of (A) the new laboratories on the north campus (B) have been (C) equipped with advanced (D) safety systems.', 'the new laboratories', 'have', 'equipped with', 'safety systems', 'B'),
(207, 2, NULL, NULL, NULL, 'The committee insisted that the report _______ before the end of the month.', 'be submitted', 'is submitted', 'was submitted', 'submitting', 'A'),
(208, 2, NULL, NULL, NULL, 'If the city had invested more in public transportation years ago, traffic congestion _______ so severe today.', 'will not be', 'would not have been', 'would not be', 'had not been', 'C'),
(209, 2, NULL, NULL, NULL, 'The program aims (A) to reduce unemployment, (B) improving wages, and (C) to increase access to (D) vocational training.', 'to reduce', 'improving', 'to increase', 'vocational training', 'B'),
(210, 2, NULL, NULL, NULL, 'The novel, _______ in 1925, remains one of the most widely studied works of American literature.', 'which publishing', 'that was published', 'publishing', 'published', 'D'),
(211, 2, NULL, NULL, NULL, 'The more carefully the data are analyzed, _______ the conclusions become.', 'the more reliable', 'more reliable', 'the most reliable', 'reliable more', 'A'),
(212, 2, NULL, NULL, NULL, 'The company\'s (A) decision to (B) expand into new markets was based on a careful (C) analyze of (D) consumer behavior.', 'decision', 'expand', 'analyze', 'consumer behavior', 'C'),
(213, 2, NULL, NULL, NULL, '_______ caused the sudden decline in the bee population remains unknown to scientists.', 'That', 'What', 'Whose', 'Since', 'B'),
(214, 2, NULL, NULL, NULL, 'The students were advised against _______ answers from the Internet without citing the source.', 'copy', 'to copy', 'copied', 'copying', 'D'),
(215, 2, NULL, NULL, NULL, '(A) Despite the weather was bad, the expedition (B) continued its (C) journey toward (D) the summit.', 'Despite', 'continued', 'journey', 'the summit', 'A'),
(216, 2, NULL, NULL, NULL, 'The samples must _______ at a temperature below zero to prevent decay.', 'store', 'be storing', 'be stored', 'stored', 'C'),
(217, 2, NULL, NULL, NULL, 'The author _______ latest novel won a major prize will give a lecture at the university tomorrow.', 'who', 'whose', 'whom', 'which', 'B'),
(218, 2, NULL, NULL, NULL, 'The library has (A) a large number of equipment (B) that students (C) can borrow for (D) free.', 'a large number of equipment', 'that', 'can borrow', 'free', 'A'),
(219, 2, NULL, NULL, NULL, 'The company had to reduce its expenses; _______, several departments were merged.', 'although', 'despite', 'whereas', 'consequently', 'D'),
(220, 2, NULL, NULL, NULL, 'Of all the animals in the rainforest, the jaguar is perhaps _______.', 'the more elusive', 'as elusive', 'the most elusive', 'elusive than', 'C'),
(221, 2, NULL, NULL, NULL, 'Hardly (A) had the lecture (B) began when (C) the projector (D) stopped working.', 'had', 'began', 'the projector', 'stopped working', 'B'),
(222, 2, NULL, NULL, NULL, '_______ the findings been published earlier, the government\'s policy might have been different.', 'Have', 'Would', 'Were', 'Had', 'D'),
(223, 2, NULL, NULL, NULL, 'The patient responded (A) positive to (B) the new treatment, (C) which was (D) developed last year.', 'positive', 'the new', 'which', 'developed', 'A'),
(224, 2, NULL, NULL, NULL, '_______ the experiment, the students recorded their observations in a notebook.', 'Conduct', 'Conducted', 'While conducting', 'While conducted', 'C'),
(225, 2, NULL, NULL, NULL, '(A) More students study, (B) the better they (C) perform on (D) examinations.', 'More', 'the better', 'perform', 'examinations', 'A'),
(226, 2, NULL, NULL, NULL, 'By the time the new library opens next year, the university _______ more than twenty million dollars on the project.', 'spends', 'will have spent', 'has spent', 'spent', 'B'),
(227, 2, NULL, NULL, NULL, 'Neither the director nor the assistants _______ aware of the change in the schedule.', 'is', 'has been', 'was', 'were', 'D'),
(228, 2, NULL, NULL, NULL, 'The director, (A) together with his (B) colleagues, (C) are planning to (D) attend the conference.', 'together with', 'colleagues', 'are', 'attend', 'C'),
(229, 2, NULL, NULL, NULL, 'The new regulations are intended to ensure the _______ of drinking water in rural areas.', 'safe', 'safety', 'safely', 'saving', 'B');

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_ujian`
--

CREATE TABLE `hasil_ujian` (
  `id` int(10) UNSIGNED NOT NULL,
  `pengguna_id` int(10) UNSIGNED NOT NULL,
  `sesi_id` int(10) UNSIGNED NOT NULL,
  `benar_listening` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `benar_structure` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `benar_reading` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `skala_listening` tinyint(3) UNSIGNED NOT NULL DEFAULT 31,
  `skala_structure` tinyint(3) UNSIGNED NOT NULL DEFAULT 31,
  `skala_reading` tinyint(3) UNSIGNED NOT NULL DEFAULT 31,
  `total_skor_toefl` smallint(5) UNSIGNED NOT NULL DEFAULT 310,
  `level_cefr` varchar(10) NOT NULL DEFAULT 'A2',
  `selesai_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jawaban_mahasiswa`
--

CREATE TABLE `jawaban_mahasiswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pengguna_id` int(10) UNSIGNED NOT NULL,
  `sesi_id` int(10) UNSIGNED NOT NULL,
  `soal_id` int(10) UNSIGNED NOT NULL,
  `jawaban_dipilih` enum('A','B','C','D') DEFAULT NULL,
  `stempel_waktu_klien` bigint(20) UNSIGNED NOT NULL COMMENT 'Unix epoch millisecond',
  `diperbarui_pada` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `jawaban_mahasiswa`
--

INSERT INTO `jawaban_mahasiswa` (`id`, `pengguna_id`, `sesi_id`, `soal_id`, `jawaban_dipilih`, `stempel_waktu_klien`, `diperbarui_pada`) VALUES
(219, 37, 2, 180, 'D', 1791725132783, '2026-10-11 13:25:32'),
(220, 37, 2, 181, 'B', 1791724821958, '2026-10-11 13:20:21'),
(222, 37, 2, 187, 'A', 1791725067350, '2026-10-11 13:24:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `konversi_skor`
--

CREATE TABLE `konversi_skor` (
  `skor_mentah` tinyint(3) UNSIGNED NOT NULL,
  `skala_listening` tinyint(3) UNSIGNED NOT NULL,
  `skala_structure` tinyint(3) UNSIGNED NOT NULL,
  `skala_reading` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `konversi_skor`
--

INSERT INTO `konversi_skor` (`skor_mentah`, `skala_listening`, `skala_structure`, `skala_reading`) VALUES
(0, 31, 31, 31),
(1, 31, 31, 31),
(2, 31, 31, 31),
(3, 32, 31, 31),
(4, 32, 33, 31),
(5, 33, 34, 31),
(6, 34, 35, 31),
(7, 35, 36, 31),
(8, 37, 37, 31),
(9, 38, 38, 32),
(10, 39, 40, 33),
(11, 41, 40, 35),
(12, 42, 41, 37),
(13, 43, 42, 38),
(14, 44, 43, 40),
(15, 45, 44, 41),
(16, 46, 45, 43),
(17, 47, 46, 44),
(18, 48, 47, 45),
(19, 49, 48, 46),
(20, 50, 49, 47),
(21, 51, 50, 48),
(22, 52, 51, 49),
(23, 52, 52, 50),
(24, 53, 53, 51),
(25, 54, 54, 52),
(26, 54, 55, 52),
(27, 55, 56, 53),
(28, 55, 57, 54),
(29, 56, 58, 54),
(30, 57, 59, 55),
(31, 57, 60, 56),
(32, 58, 61, 56),
(33, 58, 63, 57),
(34, 59, 65, 58),
(35, 60, 67, 59),
(36, 61, 68, 60),
(37, 62, 68, 61),
(38, 63, 68, 62),
(39, 64, 68, 63),
(40, 65, 68, 64),
(41, 66, 68, 65),
(42, 67, 68, 65),
(43, 68, 68, 66),
(44, 68, 68, 67),
(45, 68, 68, 67),
(46, 68, 68, 67),
(47, 68, 68, 67),
(48, 68, 68, 67),
(49, 68, 68, 67),
(50, 68, 68, 67);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `id` int(10) UNSIGNED NOT NULL,
  `nomor_induk` varchar(30) NOT NULL,
  `nama_lengkap` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `kata_sandi` varchar(255) NOT NULL,
  `peran` enum('mahasiswa','pengawas') NOT NULL DEFAULT 'mahasiswa',
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`id`, `nomor_induk`, `nama_lengkap`, `email`, `kata_sandi`, `peran`, `dibuat_pada`) VALUES
(1, 'admin', 'Dosen Pengawas Utama', 'proctor@stbtoefl.ac.id', '$2b$10$Hi.D5pkeZsmg4lPQteCJh.kn9mWRfzYzbgQ.8x2Km0YvzkB/jnTl6', 'pengawas', '2026-09-21 13:02:05'),
(37, '087654321', 'budi santoso', 'budi@gmail.com', '123456', 'mahasiswa', '2026-10-08 14:58:18');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sesi_ujian`
--

CREATE TABLE `sesi_ujian` (
  `id` int(10) UNSIGNED NOT NULL,
  `nama_sesi` varchar(150) NOT NULL,
  `token` varchar(10) NOT NULL,
  `status_aktif` tinyint(1) NOT NULL DEFAULT 0,
  `waktu_mulai` datetime DEFAULT NULL,
  `waktu_selesai` datetime DEFAULT NULL,
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sesi_ujian`
--

INSERT INTO `sesi_ujian` (`id`, `nama_sesi`, `token`, `status_aktif`, `waktu_mulai`, `waktu_selesai`, `dibuat_pada`) VALUES
(1, 'Gelombang 1 LAB 2', 'EGZWBR', 0, NULL, NULL, '2026-09-21 13:08:22'),
(2, 'Lab1', 'KZ7SV4', 1, NULL, NULL, '2026-09-23 14:29:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `wacana_reading`
--

CREATE TABLE `wacana_reading` (
  `id` int(10) UNSIGNED NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `isi_wacana` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `wacana_reading`
--

INSERT INTO `wacana_reading` (`id`, `judul`, `isi_wacana`) VALUES
(5, 'Wacana Import', 'Yellowstone National Park sits atop one of North America\'s largest active volcanic systems, known as the Yellowstone Caldera. Formed during three catastrophic eruptions over the past two million years, the caldera spans approximately 72 kilometers across northwestern Wyoming. Beneath the park lies a massive magma chamber that fuels thousands of hydrothermal wonders, including bubbling mudpots, vibrant hot springs, and spectacular geysers such as Old Faithful. Groundwater seeps deep into the fractured crust, where it is superheated by underlying molten rock under extreme hydrostatic pressure. When the ascending superheated water begins to boil and converts to steam, it expands rapidly, ejecting massive columns of water and vapor skyward. The vibrant colors seen in hydrothermal pools like the Grand Prismatic Spring are not caused by chemical pollutants, but rather by mats of thermophilic bacteria and archaea that thrive in scalding temperatures. These microscopic extremophiles produce pigmented proteins to shield themselves from intense solar radiation and optimize metabolic reactions in harsh chemical environments.'),
(6, 'Wacana Import', 'Every autumn, millions of monarch butterflies undertake an astonishing multi-generational migration across North America, journeying up to four thousand kilometers from Canada and the northern United States to specific oyamel fir forests in the mountains of central Mexico. Unlike birds or whales that make repetitive seasonal round trips within an individual lifespan, monarch migration is spread across four generations. The monarchs that travel south are a specialized \'methuselah\' generation, exhibiting delayed reproductive development and living up to eight times longer than summer generations. To maintain a consistent heading across unfamiliar terrain, monarchs rely on an intricate internal time-compensated sun compass housed in their antennae and central brains. Specialized photoreceptor proteins called cryptochromes detect solar azimuth and ultraviolet wavelengths, while internal circadian clocks adjust for the sun\'s apparent motion across the sky. In recent decades, however, monarch populations have suffered alarming declines due to deforestation in their wintering grounds and widespread herbicide use that eliminates milkweed, the sole host plant for monarch caterpillars.'),
(7, 'Wacana Import', 'Emerging in twelfth-century France, Gothic architecture represented a revolutionary departure from the heavy, fortress-like Romanesque style that preceded it. Master masons developed innovative engineering solutions that allowed stone churches to attain unprecedented heights and incorporate vast expanses of luminous stained glass. Three architectural innovations were fundamental to this transformation: pointed arches, ribbed vaults, and flying buttresses. The pointed arch distributed structural weight more vertically than the semicircular Roman arch, greatly reducing lateral thrust against outer walls. Ribbed vaulting concentrated ceiling mass onto slender stone pillars rather than solid partitions. Most decisively, exterior flying buttresses transferred remaining downward and outward forces away from high walls toward heavy masonry piers grounded outside the nave. Relieved of their load-bearing function, the church walls could be pierced with towering lancet windows and intricate rose windows. Beyond structural marvels, Gothic cathedrals served as spiritual and civic epicenters for medieval urban communities, functioning simultaneously as houses of worship, pilgrim destinations, and symbols of municipal prosperity.'),
(8, 'Wacana Import', 'Ocean gyres are vast circular systems of circulating currents created by the combined effects of global atmospheric wind patterns and the Earth\'s rotation, a phenomenon known as the Coriolis effect. The planet hosts five major subtropical gyres located in the North Atlantic, South Atlantic, North Pacific, South Pacific, and Indian Oceans. Trade winds blowing from east to west near the equator and westerlies blowing from west to east at mid-latitudes generate wind-driven surface currents. As water moves, the Coriolis force deflects surface flow to the right in the Northern Hemisphere and to the left in the Southern Hemisphere, producing a mound of water in the gyre\'s center and generating clockwise or counterclockwise vortex circulation. While these gyres have historically regulated global climate by redistributing solar warmth from equatorial zones to polar latitudes, they have recently become epicenters of anthropogenic pollution. Non-biodegradable plastics discarded into rivers and coastal waters drift into the sluggish, calm waters of gyre interiors, where sunlight and wave action degrade synthetic debris into millions of microplastic particles. These toxic fragments enter the marine food web, poisoning organisms ranging from zooplankton to apex predators.'),
(9, 'Wacana Import', 'Ocean gyres are vast circular systems of circulating currents created by the combined effects of global atmospheric wind patterns and the Earth\'s rotation, a phenomenon known as the Coriolis effect. The planet hosts five major subtropical gyres located in the North Atlantic, South artistic, North Pacific, South Pacific, and Indian Oceans. Trade winds blowing from east to west near the equator and westerlies blowing from west to east at mid-latitudes generate wind-driven surface currents. As water moves, the Coriolis force deflects surface flow to the right in the Northern Hemisphere and to the left in the Southern Hemisphere, producing a mound of water in the gyre\'s center and generating clockwise or counterclockwise vortex circulation. While these gyres have historically regulated global climate by redistributing solar warmth from equatorial zones to polar latitudes, they have recently become epicenters of anthropogenic pollution. Non-biodegradable plastics discarded into rivers and coastal waters drift into the sluggish, calm waters of gyre interiors, where sunlight and wave action degrade synthetic debris into millions of microplastic particles. These toxic fragments enter the marine food web, poisoning organisms ranging from zooplankton to apex predators.'),
(10, 'Wacana Import', 'For generations, human observers assumed that advanced cognitive capacities such as episodic memory, causal reasoning, and tool manufacture were exclusive domains of primates. However, recent behavioral neuroscience has revealed that members of the corvid family—encompassing ravens, crows, rooks, and jays—display intellectual faculties rivaling those of great apes. Despite lacking the layered cerebral cortex characteristic of mammalian brains, corvids possess an extraordinarily dense forebrain structure known as the nidopallium. This avian brain region packs neurons at densities twice that of primate brains, facilitating rapid signal transmission and sophisticated problem-solving. Laboratory experiments demonstrate that New Caledonian crows routinely fashion hooked implements from twig segments and barbed pandanus leaves to retrieve inaccessible grubs from tree crevices. Furthermore, Western scrub-jays exhibit remarkable memory recall and social foresight: when caching perishable foods for winter survival, they remember not only where and when food was hidden, but also which competitors were observing them, promptly moving items if they suspect theft is imminent.');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bank_soal`
--
ALTER TABLE `bank_soal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_bank_soal_section` (`nomor_section`),
  ADD KEY `fk_bank_soal_wacana` (`wacana_id`);

--
-- Indeks untuk tabel `hasil_ujian`
--
ALTER TABLE `hasil_ujian`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_hasil_pengguna_sesi` (`pengguna_id`,`sesi_id`),
  ADD KEY `fk_hasil_sesi` (`sesi_id`);

--
-- Indeks untuk tabel `jawaban_mahasiswa`
--
ALTER TABLE `jawaban_mahasiswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pengguna_sesi_soal` (`pengguna_id`,`sesi_id`,`soal_id`),
  ADD KEY `fk_jawaban_sesi` (`sesi_id`),
  ADD KEY `fk_jawaban_soal` (`soal_id`);

--
-- Indeks untuk tabel `konversi_skor`
--
ALTER TABLE `konversi_skor`
  ADD PRIMARY KEY (`skor_mentah`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pengguna_nomor_induk` (`nomor_induk`),
  ADD UNIQUE KEY `uq_pengguna_email` (`email`);

--
-- Indeks untuk tabel `sesi_ujian`
--
ALTER TABLE `sesi_ujian`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_sesi_token` (`token`);

--
-- Indeks untuk tabel `wacana_reading`
--
ALTER TABLE `wacana_reading`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bank_soal`
--
ALTER TABLE `bank_soal`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=230;

--
-- AUTO_INCREMENT untuk tabel `hasil_ujian`
--
ALTER TABLE `hasil_ujian`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `jawaban_mahasiswa`
--
ALTER TABLE `jawaban_mahasiswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT untuk tabel `sesi_ujian`
--
ALTER TABLE `sesi_ujian`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `wacana_reading`
--
ALTER TABLE `wacana_reading`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bank_soal`
--
ALTER TABLE `bank_soal`
  ADD CONSTRAINT `fk_bank_soal_wacana` FOREIGN KEY (`wacana_id`) REFERENCES `wacana_reading` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `hasil_ujian`
--
ALTER TABLE `hasil_ujian`
  ADD CONSTRAINT `fk_hasil_pengguna` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hasil_sesi` FOREIGN KEY (`sesi_id`) REFERENCES `sesi_ujian` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jawaban_mahasiswa`
--
ALTER TABLE `jawaban_mahasiswa`
  ADD CONSTRAINT `fk_jawaban_pengguna` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jawaban_sesi` FOREIGN KEY (`sesi_id`) REFERENCES `sesi_ujian` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jawaban_soal` FOREIGN KEY (`soal_id`) REFERENCES `bank_soal` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
