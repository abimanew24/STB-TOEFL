-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Okt 2026 pada 17.19
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
  `nama_bagian` varchar(30) DEFAULT NULL,
  `wacana_id` int(10) UNSIGNED DEFAULT NULL,
  `berkas_audio` varchar(255) DEFAULT NULL,
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
(255, 2, NULL, NULL, NULL, 'The North American prairie ________ vast areas of grassland that once supported enormous herds of bison.', 'consisted of', 'consisting', 'it consisted of', 'was consisting', 'A'),
(256, 2, NULL, NULL, NULL, 'Rarely ________ more than fifty miles from its home territory during the winter months.', 'travels a cougar', 'a cougar travels', 'does a cougar travel', 'travel a cougar', 'C'),
(257, 2, NULL, NULL, NULL, '________ known as the father of modern chemistry, Antoine Lavoisier discovered the role of oxygen in combustion.', 'He is generally', 'Generally', 'Although generally', 'It is generally', 'B'),
(258, 2, NULL, NULL, NULL, 'Sharp increases in the price of petroleum products often cause ________ in consumer spending.', 'a noticeable decline', 'noticeably decline', 'to decline noticeably', 'decline noticeable', 'A'),
(259, 2, NULL, NULL, NULL, 'Not until the invention of the electron microscope ________ to observe viruses directly.', 'were scientists able', 'scientists were able', 'able were scientists', 'scientists could', 'A'),
(260, 2, NULL, NULL, NULL, 'Geothermal energy is produced from the natural heat ________ within the Earth\'s molten core.', 'stores', 'stored', 'is stored', 'storing', 'B'),
(261, 2, NULL, NULL, NULL, 'The hummingbird is one of the few birds capable of flying backwards, ________.', 'and it can hover in place as well', 'as well as hovering in place it can', 'hover in place it can also', 'in place it hovers too', 'A'),
(262, 2, NULL, NULL, NULL, 'In 1935, Amelia Earhart became the first pilot ________ solo from Honolulu, Hawaii, to Oakland, California.', 'flew', 'to fly', 'flying of', 'was flying', 'B'),
(263, 2, NULL, NULL, NULL, '________ bacteria lack a membrane-bound nucleus, they contain genetic material dispersed in the cytoplasm.', 'Because', 'Although', 'Despite', 'In spite of', 'B'),
(264, 2, NULL, NULL, NULL, 'Most of the oxygen in the atmosphere ________ by photosynthetic marine microorganisms.', 'produces', 'has produced', 'is produced', 'producing', 'C'),
(265, 2, NULL, NULL, NULL, 'Ultrasonic sound waves have frequencies ________ the upper limit of human hearing.', 'that exceed', 'exceed', 'they exceed', 'which exceeding', 'A'),
(266, 2, NULL, NULL, NULL, 'The more complex an ecosystem is, ________ its resistance to environmental disruptions.', 'greater', 'the greater', 'is greater', 'greater is', 'B'),
(267, 2, NULL, NULL, NULL, 'Neither the author nor his publishers ________ anticipated the overwhelming commercial success of the novel.', 'had', 'have been', 'was', 'were to', 'A'),
(268, 2, NULL, NULL, NULL, '________ throughout all living organisms, nucleic acids are essential for the transmission of genetic information.', 'Finding', 'Found', 'They are found', 'To find', 'B'),
(269, 2, NULL, NULL, NULL, 'The governor insisted that the budget proposal ________ thoroughly reviewed before the legislative session ended.', 'is', 'be', 'was', 'would be', 'B'),
(270, 2, NULL, NULL, NULL, 'Porpoises and dolphins are similar in appearance, but porpoises have shorter snouts and ________.', 'spade-shaped teeth', 'teeth are spade-shaped', 'having teeth like spades', 'spade-shaped are their teeth', 'A'),
(271, 2, NULL, NULL, NULL, 'It was during the Renaissance ________ scientific inquiry began to challenge traditional scholastic doctrines.', 'what', 'when', 'that', 'which', 'C'),
(272, 2, NULL, NULL, NULL, 'Glaciers move downhill ________ gravity exerts pressure on the thick accumulation of ice.', 'because of', 'because', 'so that', 'due to', 'B'),
(273, 2, NULL, NULL, NULL, '________, glass behaves more like a solid than a typical liquid at room temperature.', 'Even though technically a liquid', 'A liquid even though technically', 'Technically a liquid even though', 'Is technically a liquid', 'A'),
(274, 2, NULL, NULL, NULL, 'No single economic theory can explain ________ fluctuations occur in the global market.', 'that why', 'why do', 'why', 'reason why', 'C'),
(275, 2, NULL, NULL, NULL, 'Located on the border of Canada and the United States, ________ attracts millions of tourists each year.', 'Niagara Falls', 'where Niagara Falls is', 'it is Niagara Falls', 'which Niagara Falls', 'A'),
(276, 2, NULL, NULL, NULL, 'The Brooklyn Bridge, ________ in 1883, was considered an engineering marvel of its era.', 'completed', 'was completed', 'completing', 'it was completed', 'A'),
(277, 2, NULL, NULL, NULL, 'Had the emergency services arrived ten minutes later, the damage ________ far more severe.', 'will be', 'had been', 'would have been', 'was', 'C'),
(278, 2, NULL, NULL, NULL, 'Unlike reptiles, mammals are endothermic and possess hair, ________ helps regulate body temperature.', 'which', 'that it', 'what', 'in which', 'A'),
(279, 2, NULL, NULL, NULL, 'Total solar eclipses are rare events ________ only along a narrow path on the Earth\'s surface.', 'visible', 'they are visible', 'which visible', 'visibly', 'A'),
(280, 2, NULL, NULL, NULL, '________ their high nutritional value, soybeans are widely cultivated as a primary protein source.', 'In spite of', 'Because of', 'Although', 'Because', 'B'),
(281, 2, NULL, NULL, NULL, 'The violin and the cello belong to the string family, but ________ produces significantly lower pitches.', 'latter', 'the latter', 'later', 'the later', 'B'),
(282, 2, NULL, NULL, NULL, 'So dense ________ that light cannot escape its gravitational field.', 'a black hole is', 'is a black hole', 'does a black hole', 'a black hole', 'B'),
(283, 2, NULL, NULL, NULL, 'The teacher asked the students ________ their essays to the online portal by midnight.', 'submitting', 'to submit', 'submit', 'that they submit', 'B'),
(284, 2, NULL, NULL, NULL, '________ in the desert requires specialized adaptations to minimize moisture loss.', 'Plant life', 'Plants live', 'For plants to living', 'Living plants are', 'A'),
(285, 2, NULL, NULL, NULL, 'Copper is second only to silver ________ its electrical conductivity.', 'in terms of', 'in term', 'by term of', 'terms of', 'A'),
(286, 2, NULL, NULL, NULL, '________ was Thomas Edison who patented the first practical incandescent light bulb.', 'There', 'That', 'It', 'He', 'C'),
(287, 2, NULL, NULL, NULL, 'Before the adoption of standardized time zones, each town set its clocks according to ________.', 'when was the sun overhead', 'the sun was overhead', 'the sun overhead was', 'when the sun was overhead', 'D'),
(288, 2, NULL, NULL, NULL, 'Chlorophyll allows plants ________ sunlight into chemical energy through photosynthesis.', 'convert', 'converting', 'to convert', 'conversion', 'C'),
(289, 2, NULL, NULL, NULL, 'The giant redwood trees of California can live for ________ two thousand years.', 'more than', 'as much as', 'over than', 'higher than', 'A'),
(290, 2, NULL, NULL, NULL, '________ discovered by Alexander Fleming in 1928, penicillin transformed modern medicine.', 'It was', 'First', 'When was', 'There was', 'B'),
(291, 2, NULL, NULL, NULL, 'Desert foxes have large ears ________ heat from their bodies into the surrounding air.', 'dissipate', 'to dissipate', 'dissipation', 'dissipated', 'B'),
(292, 2, NULL, NULL, NULL, 'Under no circumstances ________ permitted to enter the laboratory without safety goggles.', 'visitors are', 'are visitors', 'visitors will', 'do visitors', 'B'),
(293, 2, NULL, NULL, NULL, 'The ozone layer serves as a protective shield ________ harmful ultraviolet radiation from reaching the ground.', 'prevents', 'that prevents', 'prevention of', 'to prevent it', 'B'),
(294, 2, NULL, NULL, NULL, 'Despite ________ several revisions, the manuscript still contained minor typographical errors.', 'undergo', 'undergoing', 'underwent', 'has undergone', 'B'),
(295, 3, NULL, 11, NULL, 'What is the primary topic of the passage?', 'The differences between marine algae and land plants', 'The discovery and ecological dynamics of hydrothermal vent ecosystems', 'The economic value of mineral-rich deep-sea fluids', 'The impact of tectonic plate movement on volcanic eruptions', 'B'),
(296, 3, NULL, 11, NULL, 'Prior to 1977, what was the prevailing belief among marine biologists?', 'Deep-sea organisms relied primarily on chemical energy.', 'All marine ecosystems ultimately depended on photosynthesis.', 'Hydrothermal vents were the source of most ocean minerals.', 'Photosynthesis could take place in complete darkness.', 'B'),
(297, 3, NULL, 11, NULL, 'The word \"shattered\" in paragraph 1 is closest in meaning to', 'confirmed', 'disproved', 'separated', 'delayed', 'B'),
(298, 3, NULL, 11, NULL, 'According to paragraph 2, how do chemotrophic bacteria produce metabolic energy?', 'By absorbing solar radiation that penetrates the water', 'By consuming decaying organic matter from surface waters', 'By oxidizing dissolved inorganic chemical compounds', 'By extracting nutrients from the shells of limpets', 'C'),
(299, 3, NULL, 11, NULL, 'Why does the author mention Riftia pachyptila in paragraph 2?', 'To illustrate an extreme symbiotic reliance on chemotrophic bacteria', 'To argue that deep-sea animals have primitive internal organs', 'To show that predators control bacteria populations in vent fields', 'To demonstrate how tube worms compete with snails for nutrients', 'A'),
(300, 3, NULL, 11, NULL, 'The word \"its\" in paragraph 2 refers to', 'the trophosome', 'the bacteria', 'the adult worm', 'the surrounding water', 'C'),
(301, 3, NULL, 11, NULL, 'According to paragraph 2, which anatomical feature does the adult tube worm lack?', 'A specialized vascularized organ', 'A red plume', 'A circulatory system', 'A digestive tract', 'D'),
(302, 3, NULL, 11, NULL, 'The word \"ephemeral\" in paragraph 3 is closest in meaning to', 'permanent', 'short-lived', 'unpredictable', 'hazardous', 'B'),
(303, 3, NULL, 11, NULL, 'According to paragraph 3, what happens to vent communities when magma pathways shift?', 'They adapt rapidly by switching to photosynthetic food sources.', 'They face starvation because the hydrothermal fluids cease flowing.', 'They migrate immediately as mature adults to neighboring vents.', 'They trigger new volcanic eruptions to restore water temperatures.', 'B'),
(304, 3, NULL, 11, NULL, 'It can be inferred from paragraph 3 that larval dispersal is critical because', 'adult vent organisms cannot survive in cold ambient ocean water', 'existing vent habitats are temporary and geographically isolated', 'volcanic activity destroys all larvae remaining near the parent vent', 'larvae must reach shallow surface waters to mature properly', 'B'),
(305, 3, NULL, 12, NULL, 'Which statement best summarizes the main idea of the passage?', 'The Silk Road was a single trade route established exclusively for selling Chinese silk.', 'The Sogdians monopolized all economic and religious activities across ancient Eurasia.', 'The Silk Road was a complex network that facilitated extensive commercial and cultural exchanges.', 'Epidemic diseases along caravan trails brought a sudden halt to international trade.', 'C'),
(306, 3, NULL, 12, NULL, 'The word \"treacherous\" in paragraph 1 is closest in meaning to', 'dangerous', 'unpopulated', 'unfamiliar', 'mountainous', 'A'),
(307, 3, NULL, 12, NULL, 'According to paragraph 2, which of the following goods was brought into China from the west?', 'Silk textiles', 'Paper scrolls', 'Pomegranates', 'Porcelain vessels', 'C'),
(308, 3, NULL, 12, NULL, 'According to paragraph 2, how was long-distance trade along the Silk Road primarily conducted?', 'Individual merchants traveled the entire distance from China to Rome.', 'Maritime fleets transported the majority of heavy goods between ports.', 'Regional intermediaries transported goods in stages from one hub to another.', 'Han imperial soldiers escorted caravan leaders from start to finish.', 'C'),
(309, 3, NULL, 12, NULL, 'Why does the author mention the Sogdians in paragraph 2?', 'To highlight a major intermediary group that organized caravan transport and services', 'To demonstrate how Chinese emperors controlled foreign merchant settlements', 'To show that Roman merchants had settled permanently in Central Asia', 'To argue that linguistic differences prevented trade negotiations', 'A'),
(310, 3, NULL, 12, NULL, 'The word \"enduring\" in paragraph 3 is closest in meaning to', 'lasting', 'fragile', 'documented', 'secondary', 'A'),
(311, 3, NULL, 12, NULL, 'According to paragraph 3, which technology spread westward to Samarkand and Baghdad?', 'Silk spinning', 'Paper-making', 'Glassblowing', 'Gunpowder manufacturing', 'B'),
(312, 3, NULL, 12, NULL, 'The word \"its\" in paragraph 3 refers to', 'the route', 'Chinese art', 'Buddhism', 'northern India', 'C'),
(313, 3, NULL, 12, NULL, 'All of the following are mentioned in the passage as consequences of Silk Road interactions EXCEPT:', 'The adoption of new agricultural crops in East Asia', 'The dissemination of Buddhist religious teachings to China', 'The construction of a paved imperial highway connecting continents', 'The unintentional spread of deadly epidemic diseases', 'C'),
(314, 3, NULL, 12, NULL, 'What can be inferred about the cultural impact of the Silk Road?', 'It affected material lifestyle and religious philosophy far beyond the merchant class.', 'It caused European civilizations to abandon their traditional administrative models.', 'It diminished the importance of local languages throughout Central Asia.', 'It was limited to regions bordering the Mediterranean Sea.', 'A'),
(315, 3, NULL, 13, NULL, 'What is the primary purpose of the passage?', 'To debate whether modern climate change accelerates glacier loss', 'To explain the formation, mechanics, and landscape impacts of glaciers', 'To compare the properties of alpine glaciers with continental ice sheets', 'To describe how glacial striations are measured by geologists', 'B'),
(316, 3, NULL, 13, NULL, 'According to paragraph 1, under what condition does a glacier form?', 'When annual snowfall exceeds total snow loss through ablation', 'When intense volcanic heat melts underlying bedrock', 'When extreme cold prevents snow from melting during the summer', 'When ocean tides deposit compacted ice onto coastal land', 'A'),
(317, 3, NULL, 13, NULL, 'The word \"ablation\" in paragraph 1 refers to', 'the accumulation of new snow layers', 'the total loss of snow and ice from a glacier', 'the conversion of firn into dense glacial ice', 'the pressure exerted by overlying layers', 'B'),
(318, 3, NULL, 13, NULL, 'What intermediate stage occurs as snow transforms into glacial ice?', 'Sublimation', 'Till', 'Firn', 'Basal meltwater', 'C'),
(319, 3, NULL, 13, NULL, 'The word \"lubricates\" in paragraph 2 is closest in meaning to', 'cools down', 'reduces friction', 'creates cracks', 'increases pressure', 'B'),
(320, 3, NULL, 13, NULL, 'According to paragraph 2, how does glacial plucking occur?', 'Rocks scrape the bedrock to leave smooth grooves.', 'Ice crystals deform internally under intense pressure.', 'Water freezes in bedrock fissures, detaching rock fragments that the ice carries away.', 'Strong winds deposit debris onto the glacier\'s upper surface.', 'C'),
(321, 3, NULL, 13, NULL, 'The word \"they\" in paragraph 2 refers to', 'shear planes', 'landscapes', 'glaciers', 'erosional processes', 'C'),
(322, 3, NULL, 13, NULL, 'According to paragraph 3, how do glaciated valleys differ from river valleys?', 'Glaciated valleys are V-shaped, whereas river valleys are flat-bottomed.', 'Glaciated valleys have steep sides and flat bottoms, forming a U-shape.', 'Glaciated valleys are narrower and much shallower than river valleys.', 'Glaciated valleys contain no moraines or sediment deposits.', 'B'),
(323, 3, NULL, 13, NULL, 'Why does the author mention hanging valleys in paragraph 3?', 'To provide an example of a landform created by differences in tributary glacier erosion', 'To illustrate how terminal moraines block meltwater drainage', 'To show that river erosion is more powerful than glacial erosion', 'To demonstrate how water freezes at high altitudes', 'A'),
(324, 3, NULL, 13, NULL, 'It can be inferred from paragraph 3 that terminal moraines are useful to geologists because they', 'reveal the exact chemical composition of ancient atmosphere', 'mark the farthest point reached by an advancing glacier', 'protect U-shaped valleys from further weathering', 'prevent meltwater from creating waterfalls', 'B'),
(325, 3, NULL, 14, NULL, 'Which of the following is the main topic of the passage?', 'The rebuilding costs following the Great Chicago Fire of 1871', 'The technological and architectural factors that produced the Chicago skyscraper', 'The aesthetic philosophy of Louis Sullivan\'s decorative ornaments', 'The rivalry between New York and Chicago property developers', 'B'),
(326, 3, NULL, 14, NULL, 'According to paragraph 1, what geographic constraint affected Chicago\'s Loop?', 'Frequent flooding caused by excessive rainfall', 'A lack of railroad connections to surrounding farmland', 'Physical boundaries created by Lake Michigan and the Chicago River', 'Unstable marshland unable to support stone foundations', 'C'),
(327, 3, NULL, 14, NULL, 'What limitation of traditional masonry construction is described in paragraph 1?', 'Masonry buildings caught fire more easily than wooden structures.', 'Lower-floor walls had to be excessively thick to support the building\'s height.', 'Brick materials were far more expensive than structural steel.', 'City zoning laws banned brick buildings above three stories.', 'B'),
(328, 3, NULL, 14, NULL, 'The word \"compelled\" in paragraph 1 is closest in meaning to', 'forced', 'allowed', 'inspired', 'discouraged', 'A'),
(329, 3, NULL, 14, NULL, 'According to paragraph 2, what was the primary structural feature of the Home Insurance Building?', 'Massive exterior stone buttresses', 'An internal framework of iron and steel columns', 'Thick concrete foundation pillars reinforced with timber', 'Prefabricated wooden trusses supporting each level', 'B'),
(330, 3, NULL, 14, NULL, 'The term \"curtain wall\" in paragraph 2 refers to an exterior wall that', 'carries the total weight of the roof and floors', 'serves as a decorative curtain inside office suites', 'separates adjoining buildings in crowded city blocks', 'bears no structural load and protects against weather', 'D'),
(331, 3, NULL, 14, NULL, 'The word \"indispensable\" in paragraph 3 is closest in meaning to', 'essential', 'costly', 'temporary', 'unusual', 'A'),
(332, 3, NULL, 14, NULL, 'Why does the author mention the safety elevator in paragraph 3?', 'To demonstrate that early elevators frequently broke down', 'To show that upper floors were practical for commercial use only with safe transit', 'To argue that mechanical engineers contributed more than architects', 'To explain why building heights were limited to ten stories', 'B'),
(333, 3, NULL, 14, NULL, 'The word \"its\" in paragraph 3 refers to', 'electric lighting', 'a skyscraper', 'a companion industry', 'function', 'B'),
(334, 3, NULL, 14, NULL, 'Sullivan\'s phrase \"form follows function\" suggests that a building\'s design should', 'copy classical Greek and Roman decorative styles', 'prioritize ornate decorations over structural efficiency', 'directly reflect its internal structural role and practical purpose', 'disguise the industrial steel components behind heavy stone facades', 'C'),
(335, 3, NULL, 15, NULL, 'What is the main topic of the passage?', 'The differences between electroencephalography and magnetic resonance imaging', 'The neural mechanisms by which sleep facilitates memory consolidation', 'The evolutionary origin of dreaming during rapid eye movement sleep', 'The impact of pharmacological drugs on sleep deprivation', 'B'),
(336, 3, NULL, 15, NULL, 'The word \"dormancy\" in paragraph 1 is closest in meaning to', 'inactivity', 'confusion', 'exhaustion', 'perception', 'A'),
(337, 3, NULL, 15, NULL, 'According to paragraph 1, what is memory consolidation?', 'The active elimination of unnecessary emotional memories', 'The temporary storage of visual stimuli during wakefulness', 'The transformation of newly acquired memories into stable long-term forms', 'The metabolic recovery of brain cells after intense physical exertion', 'C'),
(338, 3, NULL, 15, NULL, 'According to paragraph 2, what role does the hippocampus play during wakefulness?', 'It permanently archives factual knowledge in deep cortical networks.', 'It rapidly encodes novel experiences using its high synaptic plasticity.', 'It generates slow oscillations to prevent memory interference.', 'It suppresses emotional responses triggered by the amygdala.', 'B'),
(339, 3, NULL, 15, NULL, 'The word \"its\" in paragraph 2 refers to', 'the hippocampus', 'information', 'wakefulness', 'plasticity', 'A'),
(340, 3, NULL, 15, NULL, 'According to paragraph 2, what occurs during slow-wave sleep (SWS)?', 'The brain completely halts synaptic firing to conserve glucose.', 'Synchronized neural rhythms drive the replay and transfer of memories to the neocortex.', 'The hippocampus permanently retains all procedural motor memories.', 'Sleep spindles prevent memories from reaching the prefrontal cortex.', 'B'),
(341, 3, NULL, 15, NULL, 'The word \"fragile\" in paragraph 2 is closest in meaning to', 'vulnerable', 'ancient', 'complicated', 'organized', 'A'),
(342, 3, NULL, 15, NULL, 'How does REM sleep differ from slow-wave sleep according to paragraph 3?', 'REM sleep is characterized by high-voltage slow waves, unlike SWS.', 'REM sleep is linked to procedural memories and associative network integration.', 'REM sleep has higher levels of serotonin and norepinephrine than SWS.', 'REM sleep only stabilizes factual and autobiographical declarative knowledge.', 'B'),
(343, 3, NULL, 15, NULL, 'Which cognitive benefit of REM sleep is mentioned in paragraph 3?', 'Enhanced creative problem-solving through novel network associations', 'The total erasure of all stressful emotional memories', 'Increased production of growth hormones during motor rest', 'Rapid recovery of physical muscle strength', 'A'),
(344, 3, NULL, 15, NULL, 'It can be inferred from the passage that a person deprived entirely of slow-wave sleep would likely have difficulty', 'retaining facts learned in a class earlier that day', 'experiencing rapid saccadic eye movements during the day', 'performing routine motor habits acquired during childhood', 'waking up from general anesthesia', 'A'),
(395, 3, NULL, NULL, NULL, 'Why does the author mention smartphones and electric vehicles in paragraph 1?', 'To show that grid batteries use technology already familiar from consumer products', 'To argue that these devices damage electrical grids', '', '', 'A'),
(396, 1, 'Part A', NULL, 'question 1', 'What does the man tell the woman about her book?', 'She will have to pay a small fine for the two extra days.', 'It is not overdue yet.', 'The loan period for graduate students has been shortened.', 'She must renew it online before leaving the library.', 'B'),
(397, 1, 'Part A', NULL, 'question 2', 'What will the student most likely do next?', 'Present his project to the class on Friday.', 'Ask his lab partner to write the paper for him.', 'Visit the professor\'s office again on Monday.', 'Send the professor a message explaining the scheduling conflict.', 'D'),
(398, 1, 'Part A', NULL, 'question 3', 'What does the man say about the winter housing exception?', 'Any student with a faculty sponsor may apply for it.', 'It is available exclusively to international students.', 'It is granted automatically to students writing a thesis.', 'The application period ended last Wednesday.', 'A'),
(399, 1, 'Part A', NULL, 'question 4', 'What does the woman imply about the study group?', 'She plans to stop attending it.', 'It covered topics unrelated to the exam.', 'It helped her prepare effectively for the exam.', 'It required too much of her time.', 'C'),
(400, 1, 'Part A', NULL, 'question 5', 'What will the woman most likely do tomorrow?', 'Begin working evening shifts at the bookstore.', 'Tutor other students in the bookstore.', 'Go to the bookstore to complete some paperwork.', 'Apply for a job at the tutoring center.', 'C'),
(401, 1, 'Part A', NULL, 'question 6', 'Why does the woman suggest freezing the membership?', 'The man could avoid paying a higher price later.', 'The gym will refund the money he has already spent.', 'Students are not allowed to cancel their memberships.', 'The man will be able to attend classes for free.', 'A'),
(402, 1, 'Part A', NULL, 'question 7', 'What does the man suggest the woman do?', 'Read the article a second time before class.', 'Ask the professor to assign a different reading.', 'Copy his notes from the lecture.', 'Look at the summary materials posted online.', 'D'),
(403, 1, 'Part A', NULL, 'question 8', 'Why is the man unable to register for the course?', 'He did not pass the prerequisite course.', 'His transfer credits have not yet been recorded.', 'The class has already reached its enrollment limit.', 'He missed the registration deadline.', 'B'),
(404, 1, 'Part A', NULL, 'question 9', 'What will happen if the weather is too dangerous for the trip?', 'The trip will be postponed until the following week.', 'The professor will provide the students with data.', 'The report will no longer be required.', 'The class will visit a geology museum instead.', 'B'),
(405, 1, 'Part A', NULL, 'question 10', 'What concern does the woman raise about the apartment?', 'The rent may increase next year.', 'The apartment is too small for two people.', 'The neighborhood is not safe at night.', 'The man might have trouble getting home late.', 'D'),
(406, 1, 'Part A', NULL, 'question 11', 'What does the man imply about the research position?', 'She should decline it because the pay is too low.', 'She should negotiate for more working hours.', 'It could strengthen her applications for graduate school.', 'It would prevent her from working on weekends.', 'C'),
(407, 1, 'Part A', NULL, 'question 12', 'What does the woman offer to do?', 'Print the man\'s paper for him.', 'Repair the printer in the computer lab.', 'Ask the technician to arrive earlier.', 'Request an extension from the instructor.', 'A'),
(408, 1, 'Part A', NULL, 'question 13', 'What did the woman miss during the lecture?', 'An announcement that a quiz had been rescheduled.', 'A quiz covering several chapters.', 'A review session for the final exam.', 'An assignment that is due on Friday.', 'A'),
(409, 1, 'Part A', NULL, 'question 14', 'What is the woman worried about?', 'She does not have enough money for lunch.', 'Her laptop may not work properly.', 'A required document may not arrive before the deadline.', 'She has already missed the application deadline.', 'C'),
(410, 1, 'Part A', NULL, 'question 15', 'What does the woman still need to do?', 'Retake the composition course.', 'Improve her grade to a B-plus.', 'Request a new copy of her transcript from the registrar.', 'Obtain a recommendation from a faculty member.', 'D'),
(411, 1, 'Part A', NULL, 'question 16', 'What does the woman decide to do?', 'Use the online exhibit for her assignment.', 'Visit the museum in person on Thursday.', 'Ask the professor for a different assignment.', 'Pay for a museum ticket on the weekend.', 'B'),
(412, 1, 'Part A', NULL, 'question 17', 'What can be inferred about the man?', 'He has not started his lab report.', 'He regularly uses planners to organize his work.', 'He believes the woman\'s strategy is unrealistic.', 'He has difficulty applying organizational tools consistently.', 'D'),
(413, 1, 'Part A', NULL, 'question 18', 'What is the purpose of the conversation partner program?', 'To pair international students with local students for language practice.', 'To provide free English classes for new arrivals.', 'To help international students find housing near campus.', 'To train local students as language teachers.', 'A'),
(414, 1, 'Part A', NULL, 'question 19', 'What do the speakers decide to do?', 'Report their results exactly as they obtained them.', 'Ask the professor to correct the textbook.', 'Repeat the experiment while monitoring the conditions more carefully.', 'Replace the thermometer with a new one immediately.', 'C'),
(415, 1, 'Part A', NULL, 'question 20', 'What does the woman recommend?', 'Memorizing the speech word for word.', 'Using brief keyword notes to guide his talk.', 'Postponing the presentation until next week.', 'Practicing the speech in front of the instructor.', 'B'),
(416, 1, 'Part A', NULL, 'question 21', 'Why was the woman\'s phone bill so high?', 'She made a late payment last month.', 'She switched to a more expensive plan.', 'She used more mobile data than her plan allowed.', 'The company charged her by mistake.', 'C'),
(417, 1, 'Part A', NULL, 'question 22', 'What is the man\'s attitude toward the woman\'s idea?', 'He is delighted by it.', 'He believes it is impossible to carry out.', 'He thinks she should consult her family first.', 'He is concerned about whether she has enough time.', 'D'),
(418, 1, 'Part A', NULL, 'question 23', 'What does the woman suggest the man do?', 'Appeal the ticket and include a photograph.', 'Pay the fine before the end of the week.', 'Apply for a faculty parking permit.', 'Park in lot C only after five o\'clock.', 'A'),
(419, 1, 'Part A', NULL, 'question 24', 'What does the man suggest?', 'Reducing the number of survey questions.', 'Asking instructors to promote the survey in class.', 'Using only the responses she already has.', 'Offering a small reward to participants.', 'B'),
(420, 1, 'Part A', NULL, 'question 25', 'What surprised the woman about her internship?', 'The amount of time she spent traveling.', 'The low salary she was offered.', 'The friendliness of her coworkers.', 'The significance of the project she was assigned.', 'D'),
(421, 1, 'Part A', NULL, 'question 26', 'What does the woman say about replacing a student ID?', 'It is free for first-year students.', 'It can only be done through the library website.', 'It now costs money, unlike under the previous policy.', 'It requires approval from a professor.', 'C'),
(422, 1, 'Part A', NULL, 'question 27', 'What does the professor require from the student?', 'Application materials delivered before next Monday.', 'A meeting in her office this week.', 'A list of other professors who will write letters.', 'A completed form signed by the department chair.', 'A'),
(423, 1, 'Part A', NULL, 'question 28', 'Which option does the man mention that has no deadline?', 'Switching to a larger meal plan.', 'Receiving a refund for unused meals.', 'Moving to a plan with fewer meals.', 'Buying a small package of extra meals.', 'D'),
(424, 1, 'Part A', NULL, 'question 29', 'What does the woman suggest the man do?', 'Report the unresponsive members by name.', 'Ask the professor for advice without naming classmates.', 'Complete the entire project by himself.', 'Drop the course before the deadline.', 'B'),
(425, 1, 'Part A', NULL, 'question 30', 'Why was the lecture moved to a different building?', 'More students enrolled than the original room could hold.', 'The original room is being renovated.', 'The professor prefers a smaller room.', 'The chemistry building is closed for repairs.', 'A'),
(426, 1, 'Part A', NULL, 'question 31', 'What does the woman imply about the man\'s manager?', 'He is likely to refuse any change to the schedule.', 'He does not know that the man is a student.', 'He will probably be understanding if the man explains the situation.', 'He has already approved a shift swap.', 'C'),
(427, 1, 'Part A', NULL, 'question 32', 'What can be inferred about the man?', 'He has already applied for the scholarship.', 'He might not meet the scholarship\'s GPA requirement.', 'He plans to study abroad next semester.', 'He attended the information session.', 'B'),
(428, 1, 'Part A', NULL, 'question 33', 'What will the student most likely do?', 'Return to his dormitory to get his goggles.', 'Skip the laboratory session today.', 'Buy a pair of goggles at the campus store.', 'Borrow a spare pair from the lab.', 'D'),
(429, 1, 'Part A', NULL, 'question 34', 'What does the woman suggest?', 'Posting comments in the online forum.', 'Speaking more often in class.', 'Asking the professor to change the grading policy.', 'Writing an additional essay.', 'A'),
(430, 1, 'Part A', NULL, 'question 35', 'What does the woman suggest the man do?', 'Buy tickets from another student.', 'Attend a different performance on Saturday.', 'Check for extra tickets shortly before the concert.', 'Contact the concert organizers by email.', 'C'),
(431, 1, 'Part A', NULL, 'question 36', 'What does the woman imply about the professor\'s comments?', 'They are unusually harsh toward the man.', 'They are mostly about formatting.', 'They can be ignored when revising.', 'They usually lead to better final work.', 'D'),
(432, 1, 'Part A', NULL, 'question 37', 'Why did the man stop driving to campus?', 'His car broke down.', 'The parking permit became too expensive.', 'He wanted to avoid traffic.', 'The university banned cars on campus.', 'B'),
(433, 1, 'Part A', NULL, 'question 38', 'What does the woman suggest?', 'Waiting until six o\'clock for a room.', 'Meeting in the library the next day.', 'Using a lounge that does not need a reservation.', 'Asking the group to meet at five.', 'C'),
(434, 1, 'Part A', NULL, 'question 39', 'What does the man explain about language change?', 'Rapid change can occur when outside events intervene.', 'Languages never change suddenly.', 'Professors disagree about how languages change.', 'Invasions have no effect on language.', 'A'),
(435, 1, 'Part A', NULL, 'question 40', 'Why does the man recommend the installment plan?', 'It has no processing fee.', 'Its fee is lower than the penalty for paying late.', 'It reduces the total cost of tuition.', 'It extends the deadline for a full year.', 'B'),
(436, 1, 'Part A', NULL, 'question 41', 'What must the student do before the internship begins?', 'Submit a final reflective report.', 'Register for an additional course.', 'Pay a fee to the career center.', 'Find a faculty member to supervise the internship.', 'D'),
(437, 1, 'Part A', NULL, 'question 42', 'What is the woman\'s opinion?', 'Short work periods with breaks would serve him better than caffeine.', 'He should stop working and go to sleep immediately.', 'Coffee is the best way to stay focused during long study sessions.', 'He should finish one paper and postpone the other.', 'A'),
(438, 1, 'Part A', NULL, 'question 43', 'What must the man do to receive his poster by Thursday?', 'Pay an extra fee for rush printing.', 'Pick up the poster on Tuesday evening.', 'Send the file before the end of the day.', 'Reduce the size of the poster.', 'C'),
(439, 1, 'Part A', NULL, 'question 44', 'What does the man imply about the statistical terms?', 'They will not appear on any test.', 'They are explained in the lecture notes.', 'The professor will define them in the next class.', 'The woman will eventually need to learn them.', 'D'),
(440, 1, 'Part A', NULL, 'question 45', 'What will the woman do?', 'Move the man to another room.', 'Raise the priority of the request and send a technician.', 'Ask the man to submit a new request.', 'Refund part of his housing fee.', 'B'),
(441, 1, 'Part A', NULL, 'question 46', 'How will the route change affect the man?', 'He will have to walk a short distance to reach the library.', 'His trip to the science building will be shorter.', 'He will no longer be able to use the shuttle.', 'He will need to take a different bus from the north dorms.', 'A'),
(442, 1, 'Part A', NULL, 'question 47', 'What does the man recommend the woman do?', 'Bring several printed copies of her résumé.', 'Avoid speaking until recruiters ask questions.', 'Prepare a brief introduction of herself.', 'Research the salaries before the fair.', 'C'),
(443, 1, 'Part A', NULL, 'question 48', 'Why was the woman\'s paper flagged?', 'She copied several paragraphs without citation.', 'The software counted quotations that were properly cited.', 'She submitted it after the deadline.', 'The professor changed the acceptable limit.', 'B'),
(444, 1, 'Part A', NULL, 'question 49', 'What does the woman suggest the man do?', 'Appeal the committee\'s decision immediately.', 'Apply for a different grant.', 'Ask the committee for a larger budget.', 'Clarify the budget and apply again next cycle.', 'D'),
(445, 1, 'Part A', NULL, 'question 50', 'What does the man tell the woman?', 'It is acceptable to refer students elsewhere when she is unsure.', 'She should not volunteer if she is nervous.', 'She should memorize the orientation guide.', 'She must answer every question herself.', 'A');

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

--
-- Dumping data untuk tabel `hasil_ujian`
--

INSERT INTO `hasil_ujian` (`id`, `pengguna_id`, `sesi_id`, `benar_listening`, `benar_structure`, `benar_reading`, `skala_listening`, `skala_structure`, `skala_reading`, `total_skor_toefl`, `level_cefr`, `selesai_pada`) VALUES
(16, 62, 1, 0, 0, 0, 31, 31, 31, 310, 'A2', '2026-10-17 08:57:30'),
(20, 59, 1, 0, 0, 0, 31, 31, 31, 310, 'A2', '2026-10-17 09:02:47'),
(22, 61, 1, 1, 0, 0, 31, 31, 31, 310, 'A2', '2026-10-17 09:36:49');

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
  `sesi_id` int(10) UNSIGNED DEFAULT NULL,
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`id`, `nomor_induk`, `nama_lengkap`, `email`, `kata_sandi`, `peran`, `sesi_id`, `dibuat_pada`) VALUES
(1, 'admin', 'Dosen Pengawas Utama', 'proctor@stbtoefl.ac.id', '$2b$10$Hi.D5pkeZsmg4lPQteCJh.kn9mWRfzYzbgQ.8x2Km0YvzkB/jnTl6', 'pengawas', NULL, '2026-09-21 13:02:05'),
(38, '220101001', 'Ahmad Fauzi Rahman', 'ahmad.fauzi@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(39, '220101002', 'Siti Nur Aisyah', 'siti.aisyah@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(40, '220101003', 'Bima Satria Pratama', 'bima.satria@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(41, '220101004', 'Dewi Lestari Putri', 'dewi.lestari@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(42, '220101005', 'Rian Hidayatulloh', 'rian.hidayat@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(43, '220101006', 'Anisa Rahmawati', 'anisa.rahma@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(44, '220101007', 'Dimas Bagus Wicaksono', 'dimas.bagus@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(45, '220101008', 'Putri Ayu Wandira', 'putri.ayu@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(46, '220101009', 'Fajar Nugroho Saputra', 'fajar.nugroho@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(47, '220101010', 'Nabila Zahra Khairunnisa', 'nabila.zahra@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(48, '220101011', 'Muhammad Rizky Ramadhan', 'rizky.ramadhan@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(49, '220101012', 'Indah Permatasari', 'indah.permata@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(50, '220101013', 'Eko Prasetyo Utomo', 'eko.prasetyo@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(51, '220101014', 'Larasati Dwi Anggraeni', 'larasati.dwi@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(52, '220101015', 'Bayu Aji Pamungkas', 'bayu.aji@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(53, '220101016', 'Maya Anggraini', 'maya.anggraini@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(54, '220101017', 'Gilang Ramadhan', 'gilang.ramadhan@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(55, '220101018', 'Fitri Handayani', 'fitri.handayani@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(56, '220101019', 'Arif Wibowo Kusuma', 'arif.wibowo@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(57, '220101020', 'Tia Nurhasanah', 'tia.nurhasanah@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(58, '220101021', 'Yoga Pratama Hendrawan', 'yoga.pratama@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(59, '220101022', 'Zahra Amelia Santoso', 'zahra.amelia@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(60, '220101023', 'Kevin Christian Wijaya', 'kevin.wijaya@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 5, '2026-10-17 05:49:17'),
(61, '220101024', 'Nadine Aurelia', 'nadine.aurelia@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 1, '2026-10-17 05:49:17'),
(62, '220101025', 'Rangga Arya Sena', 'rangga.sena@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa', 5, '2026-10-17 05:49:17'),
(63, '432156273', 'Maman', 'Maman@gmail.com', '123456', 'mahasiswa', 5, '2026-10-17 08:12:23');

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
(1, 'Sesi 1', 'EGZWBR', 1, NULL, NULL, '2026-09-21 13:08:22'),
(5, 'sesi 2', '8BHKDF', 1, NULL, NULL, '2026-10-17 08:27:34');

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
(11, 'Wacana Import', 'Until the late 1970s, marine biologists assumed that all oceanic life ultimately depended upon solar energy captured through photosynthesis in sunlit surface waters. This fundamental assumption was shattered in 1977 with the discovery of hydrothermal vents along the Galápagos Rift, several miles beneath the ocean surface. These vents, located near tectonic plate boundaries, release mineral-rich hydrothermal fluids superheated by underlying magma chambers. In total darkness, intense hydrostatic pressure, and frigid surrounding waters, scientists discovered surprisingly dense communities of exotic organisms, including giant tube worms, vent crabs, and blind shrimp, thriving in conditions previously considered uninhabitable.\n\nAt the foundation of these unique ecosystems are chemotrophic bacteria. Unlike photosynthetic organisms, which harness sunlight to convert carbon dioxide and water into carbohydrates, chemolithoautotrophic bacteria derive metabolic energy by oxidizing inorganic compounds—primarily hydrogen sulfide dissolved in the scalding hydrothermal fluids. These microorganisms form the base of the deep-sea food web, existing either as free-floating mats grazed upon by snails and limpets, or as internal endosymbionts living inside host organisms. The giant tube worm, Riftia pachyptila, represents one of the most remarkable examples of this symbiotic relationship. Lacking a mouth, digestive tract, and gut, the adult worm relies entirely on billions of symbiotic sulfur-oxidizing bacteria housed within a specialized vascularized organ called the trophosome. The worm absorbs hydrogen sulfide, oxygen, and carbon dioxide from the surrounding water using its bright red plume and transports these substances via its circulatory system to the bacteria, which in turn synthesize organic nutrients for the host.\n\nHydrothermal vents are ephemeral environments. Because volcanic activity along tectonic rifts fluctuates constantly, venting sites can shut down abruptly when magma pathways shift, plunging dependent fauna into starvation. Conversely, new volcanic eruptions can create fresh vent systems miles away. Organisms specialized for vent life have consequently evolved specialized larval stages capable of drifting across vast stretches of barren ocean floor to locate and colonize newly opened hydrothermal fields.'),
(12, 'Wacana Import', 'The term \"Silk Road\" does not designate a single paved highway, but rather an expansive and shifting network of overland caravan routes that spanned Eurasia, linking East Asia with the Mediterranean basin from the Han Dynasty onward. Stretching over four thousand miles across treacherous terrains—including the arid Taklamakan Desert, the high mountain passes of the Pamirs, and the vast Central Asian steppes—this network facilitated an unprecedented exchange of commodities, technologies, and religious beliefs between civilizations that had previously existed in relative isolation.\n\nWhile Chinese silk was undeniably the most renowned luxury commodity transported westward—prized in imperial Rome as a symbol of status and opulence—the trade was far from unidirectional. Caravan traders brought glassware, purple dyes, woolen textiles, precious stones, and alfalfa westward into China, along with agricultural products such as grapes, walnuts, and pomegranates. Contrary to popular misconception, few individual merchants traveled the entire length of the Silk Road. Instead, trade operated through a relay system managed by regional intermediaries, most notably the Sogdians, an Iranian people based in the fertile oases of modern Uzbekistan and Tajikistan. The Sogdians established commercial outposts along the routes, provided linguistic translation, and organized multi-year camel caravans that moved cargo from one regional trading emporium to the next.\n\nBeyond material goods, the enduring significance of the Silk Road lay in its transmission of intangible cultural and technological innovations. Paper-making technology, developed in China during the Han period, traversed the route westward through Samarkand and Baghdad, eventually revolutionizing administrative and scholarly traditions in the Islamic world and Europe. Similarly, Buddhism spread from its birthplace in northern India through the Gandharan corridor and along the northern and southern branches of the Tarim Basin, profoundly transforming Chinese art, philosophy, and monastic culture. The exchange was not without perils, however; historical epidemiologists trace the catastrophic transmission of epidemic diseases, including bubonic plague strains, to the movement of commercial travelers along these interconnected conduits.'),
(13, 'Wacana Import', 'Glaciers are massive, perennial accumulations of crystalline ice, snow, rock, and sediment that originate on land and move perpetually downward under the influence of gravity. A glacier forms only in regions where the annual accumulation of snowfall exceeds the amount of snow lost through ablation—a collective term for melting, evaporation, sublimation, and iceberg calving. Over decades or centuries, newly fallen snow undergoes progressive compaction; as overlying layers exert increasing pressure, the loose flakes recrystallize into a granular intermediate form called firn, and eventually fuse into high-density glacial ice capable of internal plastic deformation.\n\nThe movement of a glacier occurs through two primary mechanisms: internal deformation and basal sliding. Internal deformation occurs when the weight of the ice causes ice crystals to slip past one another along microscopic shear planes without fracturing, enabling the glacier to behave like an extremely viscous fluid. Basal sliding, in contrast, occurs primarily in temperate glaciers whose basal ice reaches the pressure-melting point. At this interface, liquid water lubricates the bedrock surface, allowing the entire glacier to slide forward across the substrate. As glaciers advance, they reshape landscapes through two distinct erosional processes: plucking and abrasion. Plucking happens when meltwater penetrates fractures in the bedrock, freezes, expands, and shatters the rock, which is then incorporated into the advancing ice. Abrasion occurs when rocks embedded in the glacier\'s base scour and polish the underlying bedrock, leaving parallel gouges known as glacial striations.\n\nThese persistent erosional forces transform original river-carved V-shaped valleys into steep-sided, flat-bottomed U-shaped troughs. Where tributary glaciers merge with a larger trunk glacier, the lesser erosive power of the smaller ice stream results in hanging valleys that later produce spectacular waterfalls when the ice recedes. When glaciers melt completely, they deposit vast mixtures of unsorted debris, known as till, creating distinctive depositional landforms including lateral and terminal moraines that document the historical extent of past glaciations.'),
(14, 'Wacana Import', 'In the final decades of the nineteenth century, the city of Chicago became the undisputed cradle of modern skyscraper architecture. Following the Great Chicago Fire of 1871, which leveled over three square miles of the city\'s commercial district, architects and urban planners were confronted with the urgent necessity of rebuilding quickly. Concurrently, soaring land values in the central business district—an area hemmed in by Lake Michigan and the Chicago River known as the Loop—compelled property developers to maximize vertical space. However, traditional masonry construction severely restricted building heights. In load-bearing brick buildings, supporting walls had to become progressively thicker at the base as height increased, consuming valuable floor space on lower stories and leaving little room for ground-floor retail display windows.\n\nThe breakthrough came through the structural engineering innovations pioneered by the Chicago School of architecture, led by figures such as William Le Baron Jenney, Louis Sullivan, and Dankmar Adler. In 1885, Jenney completed the Home Insurance Building, widely recognized as the world\'s first skyscraper to employ a metal skeleton frame. Instead of relying on thick exterior masonry walls to bear the dead weight of the floors and roof, Jenney utilized an internal framework of structural iron and steel columns and beams. The exterior masonry was reduced to a non-load-bearing \"curtain wall\" that simply shielded the interior from weather elements. This structural innovation radically decreased building weight, allowed construction to ascend to unprecedented heights, and enabled architects to install expansive exterior windows, admitting abundant natural daylight into office interiors.\n\nTechnological advancements in companion industries were equally indispensable to the proliferation of tall buildings. Without safe vertical passenger transit, upper stories would have remained commercially unviable. The development of the hydraulic and electric elevator, incorporating Elisha Otis\'s crucial automatic safety brake mechanism, eliminated the physical barrier to occupying towering floors. Simultaneously, electric lighting and fireproof clay tile insulation made high-rise working environments both safe and functional. Architect Louis Sullivan provided the philosophical framework for this new typology with his famous maxim \"form follows function,\" arguing that the exterior ornament and three-part vertical division of a skyscraper should logically reflect its internal structural reality and social purpose.'),
(15, 'Wacana Import', 'For centuries, sleep was regarded as a purely passive state of neural dormancy, during which the brain shut down to recuperate metabolic resources. Over the past several decades, however, advances in electroencephalography (EEG) and neuroimaging have fundamentally revised this perspective. Far from being inactive, the sleeping brain engages in highly orchestrated, energy-intensive computational processes, among the most critical of which is memory consolidation—the physiological stabilization and transformation of newly acquired experiences into durable long-term neural representations.\n\nMemory consolidation relies on a dynamic, two-stage memory system involving the hippocampus and the neocortex. During wakefulness, novel experiences are rapidly encoded within the hippocampus, a seahorse-shaped structure situated in the medial temporal lobe. The hippocampus possesses high synaptic plasticity, allowing it to register information swiftly without overwriting preexisting memories. However, its storage capacity is inherently temporary. During subsequent non-rapid eye movement (NREM) sleep—specifically during slow-wave sleep (SWS)—the brain initiates an active dialogue between these regions. Low-frequency slow oscillations originating in the prefrontal cortex coordinate with sleep spindles from the thalamus and sharp-wave ripples from the hippocampus. This synchronized neural tri-coupling drives the repetitive replay of recently encoded neural firing patterns, gradually transferring information from the fragile hippocampal repository to permanent distributed neocortical circuits.\n\nWhereas slow-wave sleep is essential for the stabilization of declarative memories—factual knowledge and autobiographical events—rapid eye movement (REM) sleep appears to serve distinct cognitive functions. Characterized by low-voltage, desynchronized brainwaves and rapid saccadic eye movements, REM sleep has been implicated in the consolidation of procedural memories, such as complex motor skills, and the emotional modulation of traumatic memories. Furthermore, the neurochemical milieu of REM sleep, marked by elevated acetylcholine and negligible norepinephrine and serotonin, fosters widespread associative processing across remote cortical networks, facilitating creative problem-solving and the integration of novel information into preexisting cognitive schemas.');

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
  ADD UNIQUE KEY `uq_pengguna_email` (`email`),
  ADD KEY `fk_pengguna_sesi` (`sesi_id`);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=446;

--
-- AUTO_INCREMENT untuk tabel `hasil_ujian`
--
ALTER TABLE `hasil_ujian`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT untuk tabel `jawaban_mahasiswa`
--
ALTER TABLE `jawaban_mahasiswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=264;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT untuk tabel `sesi_ujian`
--
ALTER TABLE `sesi_ujian`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `wacana_reading`
--
ALTER TABLE `wacana_reading`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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

--
-- Ketidakleluasaan untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD CONSTRAINT `fk_pengguna_sesi_ujian` FOREIGN KEY (`sesi_id`) REFERENCES `sesi_ujian` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
