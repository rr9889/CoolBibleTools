// data.js
const bibleData = {
    figures: [
    {
        id: 1,
        name: "Moses",
        description: "Led the Israelites out of Egypt.",
        birth_year: "circa 1391 BC",
            death_year: "circa 1271 BC",
        fullDescription: "Moses, raised in Pharaoh's court, became the deliverer of the Israelites, parting the Red Sea and receiving the Ten Commandments.",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg",
        time_period: "1400 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Parting of the Red Sea", "Receiving the Ten Commandments"],
        related_locations: ["Mount Sinai", "Egypt"],
        role: "Prophet and Leader",
        scripture_references: ["Exodus 2-40", "Deuteronomy"],
        historical_context: "During the reign of an unnamed Pharaoh, possibly Ramses II.",
        significance: "Established the Law and covenant between God and Israel.",
        gender: "Male",
        tribe: "Levi",
        occupation: ["Shepherd", "Lawgiver"],
        family: "Son of Amram and Jochebed, brother of Aaron and Miriam",
        key_traits: "Humble, obedient, courageous"
    },
    {
        id: 2,
        name: "Jesus Christ",
        description: "Central figure of Christianity.",
        birth_year: "circa 4 BC",
            death_year: "circa 30 AD",
        fullDescription: "Born in Bethlehem, Jesus preached love and forgiveness, performed miracles, and was crucified and resurrected.",
        image: "https://www.deseret.com/resizer/v2/4PO37VLFI6QPTZV2VFMECJSVOY.jpg?auth=eba826d58f2fce8ae58fce290fedfa937d17f757a1619939916cbe857b822ee0&focal=2521%2C1332&width=800&height=533",
        time_period: "4 BC - 30 AD",
        testament: "new",
        importance: true,
        category: "figures",
        related_events: ["Crucifixion of Jesus", "Resurrection", "Birth of Jesus"],
        related_locations: ["Jerusalem", "Bethlehem", "Galilee"],
        role: "Messiah and Son of God",
        scripture_references: ["Matthew", "Mark", "Luke", "John"],
        historical_context: "Under Roman rule during the time of Herod and Pontius Pilate.",
        significance: "Foundation of Christian faith through his sacrifice and teachings.",
        gender: "Male",
        tribe: "Judah",
        occupation: ["Carpenter", "Teacher", "Preacher", "King of kings", "Lord of lords"],
        family: "Son of Mary and God, stepson of Joseph",
        key_traits: "Compassionate, divine, sacrificial"
    },
    {
        id: 3,
        name: "Abraham",
        description: "Father of many nations.",
        fullDescription: "Patriarch who received God's promise of descendants as numerous as the stars, father of Isaac.",
        birth_year: "circa 2000 BC",
death_year: "circa 1825 BC",
        image: "https://theinsightinternational.com/wp-content/uploads/2019/03/Jew-Jewish-Abraham-israel-Ibrahim-photo-jw-org.jpg",
        time_period: "2000 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Covenant with God"],
        related_locations: ["Canaan", "Ur"],
        role: "Patriarch",
        scripture_references: ["Genesis 12-25"],
        historical_context: "Early Bronze Age, migration from Mesopotamia.",
        significance: "Ancestor of Israelites, Ishmaelites, and other nations.",
        gender: "Male",
        tribe: "N/A (pre-tribal)",
        occupation: ["Patriarch"],
        family: "Husband of Sarah, father of Isaac and Ishmael",
        key_traits: "Faithful, obedient, hospitable"
    },
    {
        id: 4,
        name: "Mary",
        description: "Mother of Jesus.",
        fullDescription: "Chosen by God to bear Jesus through virgin birth, present at the crucifixion.",
        birth_year: "circa 20 BC",
death_year: "circa 40 AD",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/The_Madonna_in_Sorrow.jpg",
        time_period: "4 BC - 30 AD",
        testament: "new",
        importance: true,
        category: "figures",
        related_events: ["Birth of Jesus", "Crucifixion of Jesus"],
        related_locations: ["Bethlehem", "Jerusalem"],
        role: "Mother of the Messiah",
        scripture_references: ["Luke 1-2", "John 19"],
        historical_context: "Lived under Roman occupation in Judea.",
        significance: "Exemplifies faith and obedience to God.",
        gender: "Female",
        tribe: "Judah",
        occupation: ["Homemaker"],
        family: "Mother of Jesus, wife of Joseph",
        key_traits: "Humble, faithful, devoted"
    },
    {
        id: 5,
        name: "David",
        description: "King of Israel.",
        fullDescription: "Shepherd boy who killed Goliath and became Israel's greatest king, author of many Psalms.",
        birth_year: "circa 1040 BC",
death_year: "circa 970 BC",
        image: "https://www.riversedge.life/wp-content/uploads/elementor/thumbs/David-King-of-Israel-p1nz0xa0m14hhx91hnnmkjmonzdtx1kt2yivssj5tc.jpg",
        time_period: "1000 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["David vs. Goliath", "Establishment of Jerusalem"],
        related_locations: ["Jerusalem", "Bethlehem"],
        role: "King and Psalmist",
        scripture_references: ["1 Samuel 16-31", "2 Samuel", "Psalms"],
        historical_context: "United the tribes of Israel during a time of conflict with Philistines.",
        significance: "Model of a king after God's own heart.",
        gender: "Male",
        tribe: "Judah",
        occupation: ["Shepherd", "Warrior", "King"],
        family: "Son of Jesse, father of Solomon",
        key_traits: "Brave, poetic, repentant"
    },
    {
        id: 6,
        name: "Paul",
        description: "Apostle to the Gentiles.",
        fullDescription: "Former persecutor of Christians who converted and spread the gospel throughout the Roman world.",
        birth_year: "circa 5 AD",
death_year: "circa 67 AD",
        image: "https://publisher-ncreg.s3.us-east-2.amazonaws.com/pb-ncregister/swp/hv9hms/media/20200828110816_5f48cc28c2bf74d8cce3cd0ejpeg.jpeg",
        time_period: "5 AD - 67 AD",
        testament: "new",
        importance: true,
        category: "figures",
        related_events: ["Conversion of Paul", "Missionary Journeys"],
        related_locations: ["Damascus", "Rome"],
        role: "Apostle and Theologian",
        scripture_references: ["Acts 9-28", "Romans", "Corinthians", "Galatians"],
        historical_context: "First-century Roman Empire, post-resurrection era.",
        significance: "Key figure in spreading Christianity beyond Judaism.",
        gender: "Male",
        tribe: "Benjamin",
        occupation: ["Apostle", "Teacher"],
        family: "Unknown",
        key_traits: "Zealous, intellectual, resilient"
    },
    {
        id: 7,
        name: "Noah",
        description: "Builder of the Ark.",
        fullDescription: "Righteous man chosen by God to preserve life through the flood.",
        birth_year: "circa 2970 BC",
death_year: "circa 2020 BC",
        image: "https://cms-imgp.jw-cdn.org/img/p/1102013272/univ/art/1102013272_univ_lsr_lg.jpg",
        time_period: "2500 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Noah's Flood"],
        related_locations: ["Ararat"],
        role: "Patriarch",
        scripture_references: ["Genesis 6-9"],
        historical_context: "Prehistoric, pre-Abrahamic era.",
        significance: "Symbol of obedience and God's mercy.",
        gender: "Male",
        tribe: "N/A (pre-tribal)",
        occupation: ["Farmer", "Shipbuilder"],
        family: "Father of Shem, Ham, and Japheth",
        key_traits: "Righteous, obedient, patient"
    },
    {
        id: 8,
        name: "Esther",
        description: "Queen who saved her people.",
        fullDescription: "Jewish queen who risked her life to prevent the genocide of her people by Haman.",
        birth_year: "circa 500 BC",
death_year: "circa 460 BC",
        image: "https://www.grunge.com/img/gallery/weird-things-you-didnt-know-about-queen-esther/intro-1575494049.jpg",
        time_period: "480 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Purim"],
        related_locations: ["Persia"],
        role: "Queen and Deliverer",
        scripture_references: ["Esther"],
        historical_context: "Persian Empire under Xerxes I.",
        significance: "Example of courage and divine providence.",
        gender: "Female",
        tribe: "Benjamin",
        occupation: "Queen",
        family: "Cousin of Mordecai",
        key_traits: "Courageous, wise, selfless"
    },
    {
        id: 9,
        name: "Peter",
        description: "Apostle.",
        fullDescription: "Fisherman turned disciple of Jesus, denied Christ thrice, later led the early church.",
        birth_year: "circa 1 BC",
death_year: "circa 64 AD",
        image: "https://wp.en.aleteia.org/wp-content/uploads/sites/2/2018/02/web3-fresco-of-st-peter-the-apostle-shutterstock_189843137.jpg?resize=620,350&q=75",
        time_period: "4 BC - 64 AD",
        testament: "new",
        importance: true,
        category: "figures",
        related_events: ["Pentecost", "Denial of Jesus"],
        related_locations: ["Galilee", "Jerusalem"],
        role: "Apostle",
        scripture_references: ["Matthew 16", "Acts 2-12", "1 Peter", "2 Peter"],
        historical_context: "Early Christian era under Roman rule.",
        significance: "One of the Twelve Apostles of Jesus",
        gender: "Male",
        tribe: "Unknown",
        occupation: ["Apostle", "Fisherman", "Teacher"],
        family: "Brother of Andrew",
        key_traits: "Impulsive, loyal, repentant"
    },
    {
        id: 10,
        name: "Joshua",
        description: "Conqueror of Canaan.",
        fullDescription: "Successor to Moses, led the Israelites into the Promised Land, conquering Jericho.",
        birth_year: "circa 1355 BC",
death_year: "circa 1245 BC",
        image: "https://www.preceptaustin.org/files/images/joshuabeforelord.jpg",
        time_period: "1400 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Conquest of Canaan", "Fall of Jericho"],
        related_locations: ["Canaan", "Jericho"],
        role: "Military Leader",
        scripture_references: ["Joshua"],
        historical_context: "Post-Exodus, entry into Canaan.",
        significance: "Fulfillment of God's promise to Abraham.",
        gender: "Male",
        tribe: "Ephraim",
        occupation: ["Warrior", "Leader"],
        family: "Son of Nun",
        key_traits: "Bold, faithful, strategic"
    },
    {
        id: 11,
        name: "Sarah",
        description: "Mother of Isaac.",
        fullDescription: "Wife of Abraham, bore Isaac in old age, fulfilling God's promise.",
        birth_year: "circa 2020 BC",
death_year: "circa 1880 BC",
        image: "https://bookofmormoncentral.org/sites/default/files/pictures/gospel-doctrine/come-follow-me-old-testament-2022-sarah-isaac-scott-snow.jpg",
        time_period: "2000 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Covenant with God"],
        related_locations: ["Canaan"],
        role: "Matriarch",
        scripture_references: ["Genesis 11-23"],
        historical_context: "Early Bronze Age, nomadic period.",
        significance: "Mother of the Israelite nation.",
        gender: "Female",
        tribe: "N/A (pre-tribal)",
        occupation: "Homemaker",
        family: "Wife of Abraham, mother of Isaac",
        key_traits: "Faithful, patient, beautiful"
    },
    {
        id: 12,
        name: "Joseph",
        description: "Ruler in Egypt.",
        fullDescription: "Sold into slavery by his brothers, rose to power in Egypt, saving his family during famine.",
        birth_year: "circa 1915 BC",
death_year: "circa 1805 BC",
        image: "https://highwaygospelhall.com/wp-content/uploads/2018/07/Joseph-Ruler-of-Egypt-e1535434904188.jpg",
        time_period: "1800 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Joseph's Rise to Power"],
        related_locations: ["Egypt", "Canaan"],
        role: "Dreamer and Administrator",
        scripture_references: ["Genesis 37-50"],
        historical_context: "Middle Kingdom of Egypt.",
        significance: "Preserved the Israelite family.",
        gender: "Male",
        tribe: "Israel (Jacob's son)",
        occupation: ["Shepherd", "Vizier"],
        family: "Son of Jacob and Rachel, father of Ephraim and Manasseh",
        key_traits: "Forgiving, wise, prophetic"
    },
    {
        id: 13,
        name: "Deborah",
        description: "Prophetess and judge.",
        fullDescription: "Led Israel to victory against Canaanites, judged the people under a palm tree.",
        birth_year: "circa 1200 BC",
death_year: "circa 1140 BC",
        image: "https://i.ytimg.com/vi/viXzuxhc6WE/hqdefault.jpg",
        time_period: "1200 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Battle of Mount Tabor"],
        related_locations: ["Canaan"],
        role: "Judge and Prophetess",
        scripture_references: ["Judges 4-5"],
        historical_context: "Period of the Judges.",
        significance: "Rare female leader in ancient Israel.",
        gender: "Female",
        tribe: "Ephraim",
        occupation: ["Judge"],
        family: "Wife of Lappidoth",
        key_traits: "Wise, authoritative, inspirational"
    },
    {
        id: 14,
        name: "Solomon",
        description: "Wise king of Israel.",
        fullDescription: "Son of David, built the First Temple, known for his wisdom and wealth.",
        birth_year: "circa 990 BC",
death_year: "circa 931 BC",
        image: "https://i.ytimg.com/vi/_LlDW__ygAE/hqdefault.jpg",
        time_period: "970 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Building of the Temple"],
        related_locations: ["Jerusalem"],
        role: "King and Sage",
        scripture_references: ["1 Kings 1-11", "Proverbs", "Ecclesiastes"],
        historical_context: "Height of Israelite monarchy.",
        significance: "Pinnacle of Israel's golden age.",
        gender: "Male",
        tribe: "Judah",
        occupation: ["King"],
        family: "Son of David and Bathsheba",
        key_traits: "Wise, wealthy, flawed"
    },
    {
        id: 15,
        name: "Ruth",
        description: "Loyal Moabite convert.",
        fullDescription: "Left her homeland to stay with Naomi, became ancestor of David.",
        birth_year: "circa 1150 BC",
death_year: "circa 1100 BC",
        image: "https://cdn.prod.website-files.com/5b8fd783bee52c8fb59b1fac/5ec6a5c6fe1f689008b03189_ruth-kinship3.jpeg",
        time_period: "1100 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Redemption by Boaz"],
        related_locations: ["Moab", "Bethlehem"],
        role: "Ancestor",
        scripture_references: ["Ruth"],
        historical_context: "Period of the Judges.",
        significance: "In the lineage of Jesus.",
        gender: "Female",
        tribe: "Moabite (adopted into Judah)",
        occupation: ["Gleaner"],
        family: "Wife of Boaz, mother of Obed",
        key_traits: "Loyal, humble, hardworking"
    },
    {
        id: 16,
        name: "John the Baptist",
        description: "Forerunner of Jesus.",
        fullDescription: "Preached repentance and baptized Jesus, preparing the way for the Messiah.",
        birth_year: "circa 5 BC",
death_year: "circa 30 AD",
        image: "https://zondervanacademic.nyc3.cdn.digitaloceanspaces.com/production/transforms/zondervanacademic_nyc3_cdn_digitaloceanspaces_com/production/general/john-the-baptist_bcccff05c25f7a936ec8e7afd5e552fc.jpg",
        time_period: "4 BC - 30 AD",
        testament: "new",
        importance: true,
        category: "figures",
        related_events: ["Baptism of Jesus"],
        related_locations: ["Jordan River"],
        role: "Prophet",
        scripture_references: ["Matthew 3", "Mark 1", "Luke 3", "John 1"],
        historical_context: "Roman Judea, pre-ministry of Jesus.",
        significance: "Announced the coming of Christ.",
        gender: "Male",
        tribe: "Levi",
        occupation: ["Preacher"],
        family: "Son of Zechariah and Elizabeth",
        key_traits: "Bold, ascetic, prophetic"
    },
    {
        id: 17,
        name: "Samuel",
        description: "Last judge and prophet.",
        fullDescription: "Dedicated to God as a child, anointed Saul and David as kings.",
        image: "https://media.swncdn.com/via/images/2023/05/22/30806/30806-bibleprimeroldtestamentforuseintheprimarydepa_source_file.jpg",
        birth_year: "circa 1105 BC",
death_year: "circa 1020 BC",
        time_period: "1100 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Anointing of Saul", "Anointing of David"],
        related_locations: ["Shiloh"],
        role: "Judge and Prophet",
        scripture_references: ["1 Samuel 1-25"],
        historical_context: "Transition from judges to monarchy.",
        significance: "Bridge between eras of Israel.",
        gender: "Male",
        tribe: "Levi",
        occupation: ["Priest", "Seer"],
        family: "Son of Elkanah and Hannah",
        key_traits: "Devout, discerning, authoritative"
    },
    {
        id: 18,
        name: "Rachel",
        description: "Mother of Joseph and Benjamin.",
        fullDescription: "Beloved wife of Jacob, died giving birth to Benjamin.",
        birth_year: "circa 1925 BC",
death_year: "circa 1885 BC",
        image: "https://jweekly.com/wp-content/uploads/2018/12/wp-1496479110561WEB.jpg",
        time_period: "1800 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Birth of Joseph"],
        related_locations: ["Canaan"],
        role: "Matriarch",
        scripture_references: ["Genesis 29-35"],
        historical_context: "Patriarchal period.",
        significance: "Mother of key tribes.",
        gender: "Female",
        tribe: "N/A (pre-tribal)",
        occupation: "Shepherdess",
        family: "Wife of Jacob, mother of Joseph and Benjamin",
        key_traits: "Beautiful, loving, tragic"
    },
    {
        id: 19,
        name: "Elijah",
        description: "Prophet who challenged Baal.",
        fullDescription: "Performed miracles, confronted Ahab and Jezebel, taken up to heaven in a whirlwind.",
        birth_year: "circa 900 BC",
death_year: "circa 850 BC",
        image: "https://bibleway.org/wp-content/uploads/2019/04/Prophet2-CTT-Header.jpg",
        time_period: "870 BC",
        testament: "old",
        importance: true,
        category: "figures",
        related_events: ["Contest on Mount Carmel"],
        related_locations: ["Mount Carmel"],
        role: "Prophet",
        scripture_references: ["1 Kings 17-19", "2 Kings 2"],
        historical_context: "Northern Kingdom during idolatry.",
        significance: "Defender of true worship.",
        gender: "Male",
        tribe: "Unknown",
        occupation: "Prophet",
        family: "Unknown",
        key_traits: "Fearless, miraculous, zealous"
    },
    {
        id: 20,
        name: "Mary Magdalene",
        description: "Witness to the resurrection.",
        fullDescription: "Freed from demons by Jesus, first to see him risen from the dead.",
        birth_year: "circa 5 AD",
death_year: "circa 50 AD",
        image: "https://hallow.com/wp-content/uploads/2023/07/Saints-in-7-Days-Mary-Magdalene-edit-2-1024x717.png",
        time_period: "4 BC - 30 AD",
        testament: "new",
        importance: true,
        category: "figures",
        related_events: ["Resurrection"],
        related_locations: ["Jerusalem"],
        role: "Disciple",
        scripture_references: ["Luke 8", "John 20"],
        historical_context: "Early Christian era.",
        significance: "First witness to the risen Christ.",
        gender: "Female",
        tribe: "Unknown",
        occupation: "Follower",
        family: "Unknown",
        key_traits: "Devoted, faithful, redeemed"
    }
],
events: [
    {
        id: 1,
        name: "Parting of the Red Sea",
        description: "Moses parted the sea to escape Pharaoh’s army.",
        fullDescription: "God miraculously parted the Red Sea, allowing the Israelites to escape Egypt, then closed it on their pursuers.",
        image: "https://www.rainbowtoken.com/wp-content/uploads/2017/09/Exodus-14-15-31-Parting-the-Red-Sea.jpg",
        time_period: "1400 BC",
        testament: "old",
        category: "events",
        related_figures: ["Moses"],
        related_locations: ["Egypt", "Red Sea"],
        scripture_references: ["Exodus 14"],
        historical_context: "Escape from Egyptian bondage.",
        significance: "Demonstration of God's power and deliverance.",
        typeofevent: "Miracle"
    },
    {
        id: 2,
        name: "Crucifixion of Jesus",
        description: "Jesus died on the cross.",
        fullDescription: "Pivotal event where Jesus was crucified, fulfilling prophecy and atoning for humanity's sins.",
        image: "https://i.guim.co.uk/img/media/f1696eece1e8baeb6ff15f9f181cb378ffae2844/1504_631_2868_1721/master/2868.jpg?width=480&dpr=1&s=none&crop=none",
        time_period: "30 AD",
        testament: "new",
        category: "events",
        related_figures: ["Jesus Christ", "Mary"],
        related_locations: ["Jerusalem"],
        scripture_references: ["Matthew 27", "Mark 15", "Luke 23", "John 19"],
        historical_context: "Under Roman governor Pontius Pilate.",
        significance: "Central to Christian salvation.",
        typeofevent: "Salvation"
    },
    {
        id: 3,
        name: "Noah's Flood",
        description: "Great flood that covered the earth.",
        fullDescription: "God sent a worldwide flood to destroy the wicked, preserving Noah and his family in the ark.",
        image: "https://cdn.mos.cms.futurecdn.net/NqeaQsAQMPCr2viN3M6uGk.jpg",
        time_period: "2500 BC",
        testament: "old",
        category: "events",
        related_figures: ["Noah"],
        related_locations: ["Ararat"],
        scripture_references: ["Genesis 6-9"],
        historical_context: "Prehistoric judgment on humanity.",
        significance: "God's judgment and promise of renewal.",
        typeofevent: "Judgment"
    },
    {
        id: 4,
        name: "Resurrection",
        description: "Jesus rose from the dead.",
        fullDescription: "Three days after crucifixion, Jesus rose, proving his divinity and victory over death.",
        image: "https://www.bookofmormoncentral.org/sites/default/files/pictures/page-images/blog-entry/2019/friberg-christ-america-resurrection-book-of-mormon.jpg",
        time_period: "30 AD",
        testament: "new",
        category: "events",
        related_figures: ["Jesus Christ"],
        related_locations: ["Jerusalem"],
        scripture_references: ["Matthew 28", "Mark 16", "Luke 24", "John 20"],
        historical_context: "Post-crucifixion, early Christian era.",
        significance: "Cornerstone of Christian hope.",
        typeofevent: "Salvation"
    },
    {
        id: 5,
        name: "David vs. Goliath",
        description: "David defeated the giant Goliath.",
        fullDescription: "Young David defeated the Philistine giant with a sling and stone, showing God's favor.",
        image: "https://img1.wsimg.com/isteam/ip/c787bd1f-ee40-4810-83a2-7cea1301bd7a/david-and-goliath.jpg",
        time_period: "1000 BC",
        testament: "old",
        category: "events",
        related_figures: ["David"],
        related_locations: ["Valley of Elah"],
        scripture_references: ["1 Samuel 17"],
        historical_context: "Israel-Philistine conflict.",
        significance: "Victory through faith in God.",
        typeofevent: "Battle"
    },
    {
        id: 6,
        name: "Creation",
        description: "God created the world.",
        fullDescription: "In six days, God created the heavens, earth, and all living things, resting on the seventh.",
        image: "https://miro.medium.com/v2/resize:fit:981/0*GlTVNHK8Oc867E3Y.jpeg",
        time_period: "Beginning",
        testament: "old",
        category: "events",
        related_figures: ["Adam","Eve","God"],
        related_locations: ["Garden of Eden"],
        scripture_references: ["Genesis 1-2"],
        historical_context: "Origin of existence.",
        significance: "Foundation of biblical cosmology.",
        typeofevent: "Creation"
    },
    {
        id: 7,
        name: "Birth of Jesus",
        description: "Jesus was born in Bethlehem.",
        fullDescription: "Born to Mary in a manger, heralded by angels and visited by shepherds and wise men.",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Adoration_of_the_sheperds_-_Matthias_Stomer.jpg",
        time_period: "4 BC",
        testament: "new",
        category: "events",
        related_figures: ["Jesus Christ", "Mary", "Joseph"],
        related_locations: ["Bethlehem"],
        scripture_references: ["Luke 2", "Matthew 2"],
        historical_context: "During Herod the Great's reign.",
        significance: "Incarnation of God as man.",
        typeofevent: "Birth"
    },
    {
        id: 8,
        name: "Pentecost",
        description: "Holy Spirit descended on the apostles.",
        fullDescription: "After Jesus' ascension, the Holy Spirit empowered the apostles to speak in tongues.",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Vienna_Karlskirche_frescos4b.jpg",
        time_period: "30 AD",
        testament: "new",
        category: "events",
        related_figures: ["Peter", "Jesus Christ"],
        related_locations: ["Jerusalem"],
        scripture_references: ["Acts 2"],
        historical_context: "Birth of the Christian church.",
        significance: "Empowerment of the early church.",
        typeofevent: "Spiritual Empowerment"
    },
    {
        id: 9,
        name: "Fall of Jericho",
        description: "Walls of Jericho fell.",
        fullDescription: "Joshua led the Israelites to march around Jericho, and God caused the walls to collapse.",
        image: "https://www.ellenwhite.info/images/chapt-illus/PP/RH-FallOfJericho3.jpg",
        time_period: "1400 BC",
        testament: "old",
        category: "events",
        related_figures: ["Joshua"],
        related_locations: ["Jericho"],
        scripture_references: ["Joshua 6"],
        historical_context: "Conquest of Canaan.",
        significance: "God's miraculous intervention.",
        typeofevent: "Miracle"
    },
    {
        id: 10,
        name: "Covenant with God",
        description: "God made a covenant with Abraham.",
        fullDescription: "God promised Abraham land and descendants, sealed with circumcision.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Double-alaskan-rainbow.jpg/1200px-Double-alaskan-rainbow.jpg",
        time_period: "2000 BC",
        testament: "old",
        category: "events",
        related_figures: ["Abraham"],
        related_locations: ["Canaan"],
        scripture_references: ["Genesis 15-17"],
        historical_context: "Early patriarchal period.",
        significance: "Basis of Israelite identity.",
        typeofevent: "Covenant"
        }
    ],
    locations: [
        {
            id: 1,
            name: "Mount Sinai",
            description: "Where Moses received the Ten Commandments.",
            fullDescription: "Mountain where God gave Moses the Ten Commandments, establishing the covenant with Israel.",
            image: "https://media.swncdn.com/via/20987-gettyimages-523617777.jpg",
            time_period: "1400 BC",
            testament: "old",
            importance: false,
            category: "locations",
            related_figures: ["Moses"],
            related_events: ["Parting of the Red Sea", "Receiving the Ten Commandments"],
            scripture_references: ["Exodus 19-20"],
            historical_context: "Post-Exodus wilderness period.",
            significance: "Site of divine revelation."
        },
        {
            id: 2,
            name: "Jerusalem",
            description: "Holy city in both testaments.",
            fullDescription: "Central city of biblical history, home to the Temple, and site of Jesus' ministry and crucifixion.",
            image: "https://wol.jw.org/en/wol/mp/r1/lp-e/it-1/2018/402",
            time_period: "1000 BC - 30 AD",
            testament: "both",
            importance: true,
            category: "locations",
            related_figures: ["David", "Jesus Christ", "Solomon"],
            related_events: ["Crucifixion of Jesus", "Resurrection", "Establishment of Jerusalem"],
            scripture_references: ["2 Samuel 5", "Matthew 27", "Acts 2"],
            historical_context: "Capital of Israel and Judea.",
            significance: "Spiritual and political center."
        },
        {
            id: 3,
            name: "Bethlehem",
            description: "Birthplace of Jesus.",
            fullDescription: "Small town where Jesus was born, fulfilling prophecy as the city of David.",
            image: "https://www.jesus-story.net/wp-content/uploads/2019/01/Houses_Native_village.jpg",
            time_period: "4 BC",
            testament: "new",
            importance: true,
            category: "locations",
            related_figures: ["Jesus Christ", "Mary", "David"],
            related_events: ["Birth of Jesus"],
            scripture_references: ["Micah 5:2", "Luke 2"],
            historical_context: "Roman-era Judea.",
            significance: "Messianic prophecy fulfilled."
        },
        {
            id: 4,
            name: "Egypt",
            description: "Land of Israelite slavery.",
            fullDescription: "Where the Israelites were enslaved before the Exodus, ruled by Pharaoh.",
            image: "https://images.theconversation.com/files/396859/original/file-20210423-13-7dpil7.jpg?ixlib=rb-4.1.0&rect=0%2C109%2C1585%2C792&q=45&auto=format&w=1356&h=668&fit=crop",
            time_period: "1400 BC",
            testament: "old",
            importance: true,
            category: "locations",
            related_figures: ["Moses", "Joseph"],
            related_events: ["Parting of the Red Sea", "Joseph's Rise to Power"],
            scripture_references: ["Exodus 1-15", "Genesis 39-50"],
            historical_context: "New Kingdom period of Egypt.",
            significance: "Setting for Israel's formation."
        },
        {
            id: 5,
            name: "Canaan",
            description: "Promised Land.",
            fullDescription: "Land promised to Abraham's descendants, conquered by Joshua after the Exodus.",
            image: "https://cdn.prod.website-files.com/5b8fd783bee52c8fb59b1fac/651d85eb1c55b7f3d1d60206_Viewing%2520the%2520Promised%2520Land%252C%2520Moses%2520Looks%2520Even%2520at%2520the%2520Transjordan.jpeg",
            time_period: "1400 BC",
            testament: "old",
            importance: true,
            category: "locations",
            related_figures: ["Abraham", "Joshua"],
            related_events: ["Conquest of Canaan", "Covenant with God"],
            scripture_references: ["Genesis 12", "Joshua"],
            historical_context: "Late Bronze Age.",
            significance: "Fulfillment of divine promise."
        },
        {
            id: 6,
            name: "Galilee",
            description: "Region of Jesus' ministry.",
            fullDescription: "Northern region of Israel where Jesus performed many miracles and taught.",
            image: "https://cbnisrael.org/wp-content/uploads/2021/11/2021-11-16-Galilee-Marc-Turnage-958x653.jpg",
            time_period: "4 BC - 30 AD",
            testament: "new",
            importance: false,
            category: "locations",
            related_figures: ["Jesus Christ", "Peter"],
            related_events: ["Ministry of Jesus"],
            scripture_references: ["Matthew 4", "Mark 1"],
            historical_context: "Roman province of Judea.",
            significance: "Center of Jesus' teachings."
        },
        {
            id: 7,
            name: "Damascus",
            description: "Site of Paul's conversion.",
            fullDescription: "Ancient city where Paul encountered Jesus on the road, leading to his conversion.",
            image: "https://via.placeholder.com/250x150?text=Damascus",
            time_period: "5 AD - 67 AD",
            testament: "new",
            importance: false,
            category: "locations",
            related_figures: ["Paul"],
            related_events: ["Conversion of Paul"],
            scripture_references: ["Acts 9"],
            historical_context: "Roman Syria.",
            significance: "Turning point in Christian expansion."
        },
        {
            id: 8,
            name: "Jericho",
            description: "City conquered by Joshua.",
            fullDescription: "Ancient city whose walls fell after the Israelites marched around it.",
            image: "https://via.placeholder.com/250x150?text=Jericho",
            time_period: "1400 BC",
            testament: "old",
            importance: true,
            category: "locations",
            related_figures: ["Joshua"],
            related_events: ["Fall of Jericho"],
            scripture_references: ["Joshua 6"],
            historical_context: "Entry into Canaan.",
            significance: "First victory in the Promised Land."
        },
        {
            id: 9,
            name: "Rome",
            description: "Center of Paul's later ministry.",
            fullDescription: "Capital of the Roman Empire where Paul preached and was eventually martyred.",
            image: "https://via.placeholder.com/250x150?text=Rome",
            time_period: "5 AD - 67 AD",
            testament: "new",
            importance: true,
            category: "locations",
            related_figures: ["Paul"],
            related_events: ["Missionary Journeys"],
            scripture_references: ["Acts 28", "Romans"],
            historical_context: "Height of Roman Empire.",
            significance: "Spread of Christianity to the Gentile world."
        },
        {
            id: 10,
            name: "Ararat",
            description: "Resting place of Noah's Ark.",
            fullDescription: "Mountain range where the ark came to rest after the flood.",
            image: "https://via.placeholder.com/250x150?text=Ararat",
            time_period: "2500 BC",
            testament: "old",
            importance: false,
            category: "locations",
            related_figures: ["Noah"],
            related_events: ["Noah's Flood"],
            scripture_references: ["Genesis 8"],
            historical_context: "Post-flood era.",
            significance: "Symbol of God's new beginning."
        }
    ]
};

console.log("bibleData loaded:", bibleData);