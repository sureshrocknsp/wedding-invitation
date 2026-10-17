export interface WeddingData {
  couple: {
    bride: {
      name: string;
      formalTitle: string;
      fullName: string;
      aliasName?: string;
      teluguName: string;
      role: string;
      teluguRole: string;
      parents: string;
      teluguParents: string;
      grandparents?: string;
      quote: string;
      photo: string;
    };
    groom: {
      name: string;
      formalTitle: string;
      fullName: string;
      teluguName: string;
      role: string;
      teluguRole: string;
      parents: string;
      teluguParents: string;
      residence: string;
      teluguResidence: string;
      grandparents?: string;
      quote: string;
      photo: string;
    };
    hashtag: string;
  };
  weddingDate: string;
  weddingDateFormatted: string;
  weddingDateTelugu: string;
  muhurthamTime: string;
  muhurthamTimeTelugu: string;
  cardDateNote?: string;
  invitationNoteEnglish: string;
  invitationNoteTelugu: string;
  astrology: {
    lagnam: string;
    teluguLagnam: string;
    nakshatram: string;
    teluguNakshatram: string;
    tithi: string;
    teluguTithi: string;
    samvatsaram: string;
    shloka: string;
    shlokaMeaning: string;
  };
  venue: {
    name: string;
    teluguName: string;
    address: string;
    teluguAddress: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    landmark: string;
    googleMapsUrl: string;
    embedMapUrl: string;
    amenities: string[];
  };
  invitesBy: {
    titleEnglish: string;
    titleTelugu: string;
    parentsEnglish: string[];
    parentsTelugu: string[];
  };
  bestWishesFrom: {
    titleEnglish: string;
    titleTelugu: string;
    membersEnglish: string[];
    membersTelugu: string[];
  };
  events: Array<{
    id: string;
    dayTag: string;
    name: string;
    teluguName?: string;
    time: string;
    venue: string;
    description: string;
    icon: string;
    isPrimary?: boolean;
  }>;
  rituals: Array<{
    id: string;
    name: string;
    sanskritName: string;
    time: string;
    image: string;
    description: string;
  }>;
  gallery: Array<{
    src: string;
    title: string;
    caption: string;
    category: string;
  }>;
  rsvp: {
    enabled: boolean;
    deadline: string;
    initialBlessings: Array<{
      name: string;
      time: string;
      text: string;
    }>;
  };
}

export const weddingData: WeddingData = {
  couple: {
    bride: {
      name: "Lahari (Shireesha)",
      formalTitle: "Chi.La.Sow.",
      fullName: "Chi.La.Sow. Lahari (Shireesha)",
      aliasName: "Shireesha",
      teluguName: "చి॥ల॥సౌ॥ లహరి (శిరీష)",
      role: "The Bride (Younger Daughter)",
      teluguRole: "మా కనిష్ట పుత్రిక",
      parents: "Smt. Devarakonda Anjamma & Sri Devarakonda Yadaiah Yadav",
      teluguParents: "శ్రీమతి దేవరకొండ అంజమ్మ - శ్రీ దేవరకొండ యాదయ్య యాదవ్",
      quote: "Two souls united by destiny, blessed by traditions, and bound by timeless love.",
      photo: "/assets/images/couple_portrait.jpg"
    },
    groom: {
      name: "Shiva Kumar Yadav",
      formalTitle: "Chi.",
      fullName: "Chi. Shiva Kumar Yadav",
      teluguName: "చి॥ శివకుమార్ యాదవ్",
      role: "The Groom (Only Son)",
      teluguRole: "ఏకైక పుత్రుడు",
      parents: "Smt. Gadde Yashodha & Sri Gadde Aantaiah Yadav",
      teluguParents: "శ్రీమతి గద్దె యశోద - శ్రీ గద్దె అనంతయ్య యాదవ్",
      residence: "Residents of Raghavapur",
      teluguResidence: "రాఘవాపూర్ వాసులు",
      quote: "Stepping into a sacred lifelong journey with divine grace, loving family blessings, and eternal devotion.",
      photo: "/assets/images/couple_portrait.jpg"
    },
    hashtag: "#ShivaWedsLahari"
  },
  weddingDate: "2026-11-01T11:47:00+05:30",
  weddingDateFormatted: "Sunday, 1st November 2026",
  weddingDateTelugu: "ఆదివారము, తేది: 01-11-2026",
  muhurthamTime: "11:47 AM",
  muhurthamTimeTelugu: "ఉదయం గం॥ 11-47 ని॥లకు",
  cardDateNote: "Sunday, 01-11-2026 at 11:47 AM",
  invitationNoteEnglish:
    "We solicit your gracious presence with family and friends on the auspicious occasion of the marriage of our Younger Daughter.",
  invitationNoteTelugu:
    "వివాహం జరిపించుటకు పెద్దలు నిశ్చయించినారు, కావున తామెల్లరు బంధుమిత్ర సపరివార సమేతముగా విచ్చేసి నూతన వధూవరులను ఆశీర్వదించి భోజన తాంబూలాలను స్వీకరించి మమ్మల్నానందింపజేయ ప్రార్థన.",
  astrology: {
    lagnam: "Dhanur Lagnam (Pushkaramsha Sumuhurtham)",
    teluguLagnam: "ధనుర్ లగ్న పుష్కరాంశ సుముహూర్తము",
    nakshatram: "Punarvasu Nakshatram",
    teluguNakshatram: "పునర్వసు నక్షత్రయుక్త",
    tithi: "Ashwayuja Masa Bahula Saptami",
    teluguTithi: "ఆశ్వీయుజ మాస బహుళ సప్తమి",
    samvatsaram: "Swasti Sri Chandramana Parabhava Nama Samvatsaram (స్వస్తిశ్రీ చాంద్రమాన పరాభవ నామ సంవత్సరం)",
    shloka: "శ్లో॥ ఆదిత్యాది గ్రహాస్సర్వే స్వనక్షత్ర స్వరాశయః ।\nకుర్వంతు మంగళం తాభ్యాం యయోరుద్వాహ పత్రికా ॥",
    shlokaMeaning:
      "May Aditya (the Sun) and all divine celestial planets situated in their auspicious signs and constellations bestow boundless harmony, prosperity, and blessings upon this sacred wedding union."
  },
  venue: {
    name: "Brundavan Gardens",
    teluguName: "బృందావన్ గార్డెన్స్ (కళ్యాణవేదిక)",
    address: "Kodangal Road, Parigi",
    teluguAddress: "కోడంగల్ రోడ్, పరిగి",
    city: "Parigi",
    district: "Vikarabad Dist.",
    state: "Telangana",
    pincode: "501501",
    landmark: "Kodangal Road, Parigi, Vikarabad Dist, Telangana",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Brundavan+Gardens+Kodangal+Road+Parigi+Vikarabad",
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.9634732187684!2d77.8876!3d17.1818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbd8b7f8c1b2c3%3A0x1c8b9d3e8e1f5678!2sParigi%2C%20Telangana%20501501!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    amenities: [
      "Spacious Traditional Kalyana Vedika & Open Lawn Gardens",
      "Ample Guest & Vehicle Parking on Kodangal Road",
      "Traditional Telugu Kalyana Vindu Bhojanam Dining Hall",
      "Dedicated Nadaswaram, Mangala Vadyam & Sannai Melam"
    ]
  },
  invitesBy: {
    titleEnglish: "Invited by (మీ ఆగమనాభిలాషులు)",
    titleTelugu: "మీ ఆగమనాభిలాషులు",
    parentsEnglish: [
      "Smt. Devarakonda Anjamma",
      "Sri Devarakonda Yadaiah Yadav"
    ],
    parentsTelugu: [
      "శ్రీమతి దేవరకొండ అంజమ్మ",
      "శ్రీ దేవరకొండ యాదయ్య యాదవ్"
    ]
  },
  bestWishesFrom: {
    titleEnglish: "With Best Wishes From : Near and Dear",
    titleTelugu: "బంధుమిత్రుల అభినందనలతో",
    membersEnglish: [
      "Sailu Yadav",
      "Shiva Yadav",
      "Naveen Yadav",
      "Mallesh Yadav",
      "Ramulu Yadav",
      "Yadaiah Yadav",
      "Srisailam Yadav",
      "Family & Near and Dear"
    ],
    membersTelugu: [
      "సాయిలు యాదవ్",
      "శివ యాదవ్",
      "నవీన్ యాదవ్",
      "మల్లేష్ యాదవ్",
      "రాములు యాదవ్",
      "యాదయ్య యాదవ్",
      "శ్రీశైలం యాదవ్ గార్లు",
      "మరియు బంధుమిత్రులు"
    ]
  },
  events: [
    {
      id: "event-haldi",
      dayTag: "Sunday Morning — 07:30 AM",
      name: "Mangala Snanam & Haldi Ceremony",
      teluguName: "మంగళ స్నానం & పసుపు వేడుక",
      time: "07:30 AM onwards",
      venue: "Family Residence",
      description: "Purification rites, fragrant turmeric paste blessings, and traditional songs to prepare the bride & groom for the sacred union.",
      icon: "🌼"
    },
    {
      id: "event-edurukollu",
      dayTag: "Sunday Morning — 10:00 AM",
      name: "Edurukollu & Welcoming the Barat",
      teluguName: "ఎదురుకోళ్ళు & వరుని స్వాగతం",
      time: "10:00 AM",
      venue: "Brundavan Gardens Entrance",
      description: "Ceremonial welcoming of Groom Chi. Shiva Kumar Yadav and family from Raghavapur with mangala vadyam and floral garlands.",
      icon: "🎺"
    },
    {
      id: "event-muhurtham",
      dayTag: "Sunday Auspicious Muhurtham — 11:47 AM",
      name: "Auspicious Wedding Sumuhurtham",
      teluguName: "పునర్వసు నక్షత్రయుక్త ధనుర్ లగ్న పుష్కరాంశ సుముహూర్తం",
      time: "11:47 AM sharp",
      venue: "Brundavan Gardens Kalyana Vedika",
      description: "The divine tying of the sacred Mangalasutra, Jeelakarra-Bellam, and holy Talambralu amidst Vedic chants and shower of Akshatalu.",
      icon: "✨",
      isPrimary: true
    },
    {
      id: "event-bhojanam",
      dayTag: "Sunday Afternoon — 12:45 PM",
      name: "Kalyana Vindu Bhojanam",
      teluguName: "కళ్యాణ విందు భోజనం",
      time: "12:45 PM onwards",
      venue: "Brundavan Gardens Dining Hall",
      description: "Sumptuous traditional Telugu wedding feast served with warm hospitality, delicacies, and bhojana tamboolam.",
      icon: "🍲"
    },
    {
      id: "event-reception",
      dayTag: "Sunday Evening — 06:30 PM",
      name: "Blessings & Felicitation Reception",
      teluguName: "శుభాశీర్వాదములు & అభినందన సభ",
      time: "06:30 PM onwards",
      venue: "Brundavan Gardens Stage & Lawns",
      description: "An evening of celebration, congratulations, music, and congratulations with friends and relatives.",
      icon: "👑"
    }
  ],
  rituals: [
    {
      id: "mangalyadharanam",
      name: "Jeelakarra Bellam & Mangalyadharanam",
      sanskritName: "జీలకర్ర బెల్లం & మాంగళ్యధారణం (Sacred Muhurtham)",
      time: "11:47 AM Exact Muhurtham",
      image: "/assets/images/ritual_muhurtham.jpg",
      description: "At the stroke of 11:47 AM, the bride and groom place Jeelakarra and Bellam on each other's heads symbolizing sweetness and indivisible union, followed by tying the holy Mangalasutra with three sacred knots amidst nadaswaram music and elders' akshata blessings."
    },
    {
      id: "talambralu",
      name: "Talambralu (Sacred Akshata Shower)",
      sanskritName: "తలంబ్రాలు సంబరం",
      time: "12:15 PM onwards",
      image: "/assets/images/mandapam_stage.jpg",
      description: "A joyful ritual where Lahari and Shiva Kumar shower each other with sanctified pearls and turmeric rice, symbolizing an overflowing life of prosperity, joy, and mutual affection."
    },
    {
      id: "saptapadi",
      name: "Saptapadi & Pradakshinam",
      sanskritName: "సప్తపది (Seven Sacred Vows)",
      time: "12:30 PM onwards",
      image: "/assets/images/mandapam_stage.jpg",
      description: "The newlyweds take seven holy steps around the sacred Agni fire, solemnizing their vows of nourishment, strength, dharma, prosperity, harmony, friendship, and lifelong devotion."
    },
    {
      id: "haldi-nalangu",
      name: "Mangala Snanam & Pasupu Ceremony",
      sanskritName: "పసుపు వేడుక & మంగళ స్నానం",
      time: "Morning 07:30 AM",
      image: "/assets/images/ritual_haldi.jpg",
      description: "Beloved family members apply auspicious golden turmeric paste and aromatic oils, showering good health and joyful blessings for the holy marriage."
    }
  ],
  gallery: [
    {
      src: "/assets/images/original_wedding_card.jpg",
      title: "Official Wedding Card (ఆహ్వాన శుభ పత్రిక)",
      caption: "Original English & Telugu Marriage Invitation Card",
      category: "Invitation"
    },
    {
      src: "/assets/images/divine_blessings.jpg",
      title: "సర్వదేవతా ఆశీర్వచనం (Divine Celestial Blessings)",
      caption: "Deities Showering Sacred Akshatas & Flowers upon the Couple",
      category: "Divine"
    },
    {
      src: "/assets/images/couple_portrait.jpg",
      title: "The Blessed Couple",
      caption: "Chi. Shiva Kumar Yadav & Chi.La.Sow. Lahari (Shireesha)",
      category: "Couple"
    },
    {
      src: "/assets/images/ritual_muhurtham.jpg",
      title: "Sacred Sumuhurtham",
      caption: "Divine Mangalyadharanam at 11:47 AM",
      category: "Ritual"
    },
    {
      src: "/assets/images/mandapam_stage.jpg",
      title: "Brundavan Gardens Vedika",
      caption: "Decorated Kalyana Vedika, Kodangal Road, Parigi",
      category: "Mandapam"
    },
    {
      src: "/assets/images/ritual_haldi.jpg",
      title: "Joyous Haldi & Pasupu",
      caption: "Golden turmeric rituals and happy laughter",
      category: "Celebration"
    },
    {
      src: "/assets/images/ritual_reception.jpg",
      title: "Evening Felicitation",
      caption: "Welcoming loved ones under festive lights",
      category: "Reception"
    },
    {
      src: "/assets/images/grand_doors.jpg",
      title: "Grand Entrance Portal",
      caption: "Traditional carved temple double doors",
      category: "Entrance"
    }
  ],
  rsvp: {
    enabled: true,
    deadline: "October 30, 2026",
    initialBlessings: [
      {
        name: "Devarakonda Family (Bride's Parents)",
        time: "Just now",
        text: "May Lord Vinayaka shower divine grace, eternal joy, and great health upon dear Lahari and Shiva Kumar!"
      },
      {
        name: "Gadde Family (Raghavapur - Groom's Parents)",
        time: "2 hours ago",
        text: "Heartfelt blessings to our beloved son Shiva Kumar and dear daughter Lahari for a blessed married life."
      },
      {
        name: "Sailu Yadav, Naveen Yadav & Family",
        time: "Yesterday",
        text: "Warmest congratulations and best wishes for a lifetime of love, happiness, and prosperity!"
      }
    ]
  }
};
