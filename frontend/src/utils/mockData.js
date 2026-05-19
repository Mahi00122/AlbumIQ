export const dashboardStats = [
  { label: "Total Events", value: "38", change: "+12% this month" },
  { label: "Total Uploads", value: "82.4K", change: "6,420 photos this week" },
  { label: "Guest Searches", value: "14.9K", change: "1.8K searches today" },
  { label: "AI Match Rate", value: "97.8%", change: "Median in 11 seconds" }
];

export const recentEvents = [
  {
    id: 1,
    name: "Aarav & Siya Wedding",
    code: "AARAV24",
    venue: "Jaipur Palace",
    guests: 420,
    photos: 12460,
    status: "Live"
  },
  {
    id: 2,
    name: "Neel & Tara Reception",
    code: "NEELTARA",
    venue: "The Imperial Lawn",
    guests: 280,
    photos: 8160,
    status: "Processing"
  },
  {
    id: 3,
    name: "Khurana Family Sangeet",
    code: "SANGEET7",
    venue: "The Grand Orchid",
    guests: 350,
    photos: 10120,
    status: "Ready"
  }
];

export const analyticsSeries = [
  { label: "Mon", searches: 120, uploads: 900 },
  { label: "Tue", searches: 180, uploads: 1120 },
  { label: "Wed", searches: 260, uploads: 1380 },
  { label: "Thu", searches: 340, uploads: 1820 },
  { label: "Fri", searches: 420, uploads: 2400 },
  { label: "Sat", searches: 520, uploads: 2960 },
  { label: "Sun", searches: 470, uploads: 2840 }
];

export const uploadQueue = [
  { title: "Haldi Morning Set", count: 1240, status: "Indexed", eventCode: "AARAV24" },
  { title: "Baraat Drone Batch", count: 860, status: "Face extraction", eventCode: "AARAV24" },
  { title: "Reception Portraits", count: 1560, status: "Queued", eventCode: "NEELTARA" },
  { title: "Family Sangeet Stage", count: 930, status: "Indexed", eventCode: "SANGEET7" },
  { title: "Mehendi Candids", count: 540, status: "Queued", eventCode: "SANGEET7" }
];

export const galleryMatches = [
  {
    id: "1",
    eventCode: "AARAV24",
    title: "Couple Entry",
    time: "7:42 PM",
    score: "99.1%",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "2",
    eventCode: "AARAV24",
    title: "Dance Floor Smile",
    time: "8:05 PM",
    score: "98.7%",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "3",
    eventCode: "DEMO24",
    title: "Family Portrait",
    time: "6:18 PM",
    score: "97.9%",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "4",
    eventCode: "DEMO24",
    title: "Mandap Arrival",
    time: "5:48 PM",
    score: "98.3%",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "5",
    eventCode: "SANGEET7",
    title: "Stage Moment",
    time: "9:12 PM",
    score: "96.8%",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "6",
    eventCode: "NEELTARA",
    title: "Reception Cheers",
    time: "10:02 PM",
    score: "95.9%",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80"
  }
];
