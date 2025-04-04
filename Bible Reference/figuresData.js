const figuresData = [
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
];