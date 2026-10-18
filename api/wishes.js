// Vercel Serverless Function: GET / POST /api/wishes
const INITIAL_WISHES = [
  {
    id: "wish-demo-1",
    name: "Pip (Dream Engineer)",
    message: "Welcome to my little workshop! Leave a bedtime wish before you sleep, and I will pack a warm star for your dreams.",
    seal: "⭐ Star Wish",
    date: "Midnight Nursery Ledger",
    isLocalOnly: false
  },
  {
    id: "wish-demo-2",
    name: "Sleepy Cloudlet #07",
    message: "Thank you for the warm B-flat lullaby. All the little storm clouds turned into lavender puffballs.",
    seal: "☁️ Cloud Hug",
    date: "Yesterday at Twilight",
    isLocalOnly: false
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(INITIAL_WISHES);
  }

  if (req.method === 'POST') {
    const { name, message, seal } = req.body || {};
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const newWish = {
      id: `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: String(name).slice(0, 50),
      message: String(message).slice(0, 200),
      seal: seal || '⭐ Star Wish',
      date: 'Just now in Midnight Ledger',
      isLocalOnly: false
    };

    return res.status(201).json({ success: true, entry: newWish });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
