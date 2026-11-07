/*
 * Agomoni 2026 — Event Report content.
 *
 * Transcribed from the official Event Report document:
 * AGOMONI 2026, organized and hosted by RCC Talkies and the Art and
 * Cultural Club of RCCIIT, 9 October 2026, Dr. Jaya Deb Roy Auditorium.
 * Layout reads from this file only — edit here to update the section.
 */

export type Proceeding = {
  slot: string;
  participants: string[];
  performance: string;
  type: "Dance" | "Music" | "Drama" | "Recitation" | "Beatbox" | "Instrumental" | "Ceremony";
  time?: string;
};

export const AGOMONI_REPORT: {
  eyebrow: string;
  title: string;
  edition: string;
  standfirst: string;
  meta: readonly { label: string; value: string }[];
  introduction: readonly { heading: string; body: string }[];
  objectives: readonly string[];
  proceedingsIntro: string;
  proceedings: Proceeding[];
  proceedingsNote: string;
  roleOfClubs: { heading: string; body: string[] };
  materials: { heading: string; items: string[] }[];
  materialsNote: string;
  conclusion: string;
  submittedBy: readonly { name: string; role: string }[];
  stats: readonly { value: string; label: string }[];
} = {
  eyebrow: "Event Report · Agomoni 2026",
  title: "Event Report",
  edition: "Agomoni 2026",
  standfirst:
    "A pre-Durga Puja celebration of Bengali culture, art and togetherness — organized and hosted by RCC Talkies and the Art and Cultural Club of RCCIIT.",

  meta: [
    { label: "Date", value: "9 October 2026" },
    { label: "Time", value: "14:00 – 17:00" },
    { label: "Venue", value: "Dr. Jaya Deb Roy Auditorium" },
    { label: "Organized & Hosted By", value: "RCC Talkies and Art and Cultural Club of RCCIIT" },
  ] as const,

  introduction: [
    {
      heading: "Introduction",
      body: "Agomoni 2026 was organized and hosted by RCC Talkies and the Art and Cultural Club of RCC Institute of Information Technology (RCCIIT) on 9th October 2026. The event celebrated the spirit of Durga Puja, embracing the rich cultural heritage, artistic traditions, and festive enthusiasm associated with the arrival of Goddess Durga.",
    },
    {
      heading: "Bringing Students Together",
      body: "The event aimed to bring students together through cultural expression, creativity, and shared celebration, fostering a sense of unity and strengthening the cultural spirit within the RCCIIT community.",
    },
  ] as const,

  objectives: [
    "Celebrate the cultural significance and traditions associated with Durga Puja.",
    "Provide students with a platform to express their artistic and creative talents.",
    "Encourage participation in cultural activities and promote collaboration among students.",
    "Foster a sense of community, unity, and belonging within the institution.",
    "Preserve and promote the cultural heritage of Bengal through collective celebration.",
  ] as const,

  proceedingsIntro:
    "The programme brought together students and members of the college community to celebrate the festive spirit of Agomoni — through dance, drama, music, and recitation that showcased student creativity and the essence of Bengali culture.",
  proceedings: [
    {
      slot: "Lamplighting",
      participants: ["Inaugural: Dona Guha", "Kasturi Bhattacharya"],
      performance: "Lamplighting / Inaugural",
      type: "Ceremony",
    },
    { slot: "1", participants: ["Samadrita Saha", "Sreyoshi Guha"], performance: "Music (Vocal)", type: "Music", time: "5 min" },
    { slot: "2", participants: ["Shreyashi Dubey", "Ashmita Mishra", "Koel Bhattacharya", "Swastika Polley"], performance: "Dance", type: "Dance", time: "3.5 min" },
    { slot: "3", participants: ["Sreejit Mondal", "Sushweta Ghosh", "Sukanya Mukherjee"], performance: "Recitation", type: "Recitation", time: "3 min" },
    { slot: "4", participants: ["Meghna Banerjee", "Mohana Ghosh"], performance: "Dance", type: "Dance", time: "5 min" },
    { slot: "5", participants: ["Swapnanil Chakraborty", "Srijit Bose", "Rohan Pahari", "Niladri Saha"], performance: "Music (Vocal)", type: "Music", time: "8 min" },
    { slot: "6", participants: ["Saniya Yeasmin", "Disha Bhuniya", "Shreya Chakraborty", "Sampurna Sit", "Aparajita Mazumder"], performance: "Dance", type: "Dance", time: "5 min" },
    { slot: "7", participants: ["Ayushi Muhury", "Ankita Halder"], performance: "Dance", type: "Dance", time: "5 min" },
    { slot: "8", participants: ["Pabany Kirtania", "Disha Mondal", "Arshisman Paul", "Niladri Saha", "Rohan Pahari"], performance: "Music", type: "Music", time: "5 min" },
    { slot: "9", participants: ["Brishni Das", "Plaboni Pal", "Magnolia Bera", "Antika Ghosh"], performance: "Dance", type: "Dance", time: "5 min" },
    { slot: "10", participants: ["Swagata Ganguly", "Debarghya Aich", "Arpan Aon"], performance: "Audio Drama", type: "Drama", time: "12 min" },
    { slot: "11", participants: ["Snehasish Bhattacharyya", "Prithwisha Biswas"], performance: "Music (Vocal)", type: "Music", time: "10 min" },
    { slot: "12", participants: ["Koushani Chakraborty", "Srija Ray", "Adrija Routh"], performance: "Dance", type: "Dance", time: "5 min" },
    { slot: "13", participants: ["Shrijato Das", "Rohan Pahari"], performance: "Beatbox", type: "Beatbox" },
    { slot: "14", participants: ["Upasana Roy", "Sayantika Das", "Ishika Ghosh", "Sayan Das", "Eshaan Roy", "Rajdeep Ghosh", "Ratul Mukherjee", "Disha Verma", "Aditya Shaw"], performance: "Drama", type: "Drama", time: "10 min" },
    { slot: "15", participants: ["Upayan Moitra", "Niladri Saha"], performance: "Violin & Tabla", type: "Instrumental", time: "10 min" },
    { slot: "16", participants: ["Prithwisha Biswas", "Subhradeep Bhattacharya", "Meghna Santra", "Prantar Phattacharya", "Arko Chakraborty", "Debabrata Barman"], performance: "Drama", type: "Drama", time: "20 min" },
    { slot: "17", participants: ["Dayita Mondal", "Sirsho Biswas", "Sujit Halder", "Souvik Dey"], performance: "Music (Vocal)", type: "Music", time: "5 min" },
    { slot: "18", participants: ["Debabrata Barman", "Asmita Das", "Sagnik Ghosh"], performance: "Dance", type: "Dance", time: "3 min" },
    { slot: "End", participants: ["—"], performance: "Dhak & Dhunuchi", type: "Ceremony" },
  ] as Proceeding[],

  proceedingsNote:
    "The organizers worked collaboratively to coordinate and host the event, creating an environment that encouraged participation, creativity, and togetherness.",

  roleOfClubs: {
    heading: "Role of the Organizing Clubs",
    body: [
      "RCC Talkies and the Art and Cultural Club of RCCIIT jointly organized and hosted Agomoni 2026. Their collaboration reflected the importance of student-led initiatives in promoting cultural activities and enriching campus life.",
      "Through their collective efforts, the clubs contributed to creating an engaging platform for cultural celebration and student participation.",
    ],
  } as const,

  materials: [
    {
      heading: "Art and Painting Supplies",
      items: [
        "Camel Acrylic Colours (12-colour set)",
        "Additional acrylic colours: 4 white, 3 red, 2 orange, 2 brown, 2 black, 3 skin-colour, 4 yellow, 5 ochre, and 1 green",
        "DOMS sketch pen set",
        "Flat brushes, 38 mm (3 pieces)",
        "Round brushes, size 4 (2 pieces)",
        "White chart paper",
        "Coloured paper and red chart paper (4 sheets)",
      ],
    },
    {
      heading: "Decoration and Display Materials",
      items: [
        "Sticky notes (Post-it notes)",
        "Pinboard display materials",
        "Flex banners (5 pieces)",
        "Thermocol plates",
        "Thermocol sheets / pieces (2 pieces)",
        "Glue",
        "Double-sided tape and cello tape",
      ],
    },
    {
      heading: "Cultural and Traditional Materials",
      items: [
        "Dhunuchi (6–8 pieces)",
        "Hand fans (8 pieces)",
        "Khori mati (traditional white clay / chalk material)",
        "Alta (used as an alternative to red paint)",
      ],
    },
    {
      heading: "Additional Supplies",
      items: ["Two pen boxes"],
    },
  ] as const,

  materialsNote:
    "These materials supported the event's artistic, decorative, and cultural requirements and helped facilitate the preparation of displays and other event-related arrangements.",

  conclusion:
    "Agomoni 2026, held on 9th October 2026, celebrated cultural heritage, artistic expression, and the festive spirit of Durga Puja at RCCIIT. Organized and hosted by RCC Talkies and the Art and Cultural Club of RCCIIT, the event featured vibrant cultural performances and encouraged student participation. The successful organization of the event was supported by the guidance of Raushan Pandey, Student Adviser of RCC Talkies, and Meghna Santra, President of the Art and Cultural Club of RCCIIT. Their contributions, along with the collective efforts of the organizing teams and participants, helped make the celebration a memorable occasion, fostering creativity, cultural appreciation, and a sense of togetherness within the RCCIIT community.",

  submittedBy: [
    { name: "Soumyajit Samanta", role: "President, RCC Talkies" },
    { name: "Swagata Ganguly", role: "Secretary, RCC Talkies" },
    { name: "Meghna Santra", role: "President, Art and Cultural Club of RCCIIT" },
    { name: "Kasturi Bhattacharya", role: "Secretary, Art and Cultural Club of RCCIIT" },
  ] as const,

  stats: [
    { value: "18", label: "Acts on stage" },
    { value: "7", label: "Dance performances" },
    { value: "5", label: "Music performances" },
    { value: "3", label: "Drama performances" },
  ] as const,
};

export type AgomoniReport = typeof AGOMONI_REPORT;
