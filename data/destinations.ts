export interface Destination {
  id: string;
  name: string;
  location: string;
  tagline: string;
  icon: string;
  meeraQuestion: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'varanasi',
    name: 'Varanasi',
    location: 'Uttar Pradesh',
    tagline: 'City of moksha & Ganga darshan',
    icon: '🕉',
    meeraQuestion: 'I want to plan my Varanasi yatra',
  },
  {
    id: 'tirupati',
    name: 'Tirupati',
    location: 'Andhra Pradesh',
    tagline: 'Darshan of Lord Venkateswara',
    icon: '🪔',
    meeraQuestion: 'Help me plan my Tirupati Balaji yatra',
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath',
    location: 'Uttarakhand',
    tagline: 'Sacred Shiva jyotirlinga in the Himalayas',
    icon: '⛰',
    meeraQuestion: 'I want to visit Kedarnath Jyotirlinga',
  },
  {
    id: 'vrindavan',
    name: 'Vrindavan',
    location: 'Uttar Pradesh',
    tagline: "Krishna's divine playground",
    icon: '🦚',
    meeraQuestion: 'Plan my Vrindavan Mathura yatra',
  },
  {
    id: 'puri',
    name: 'Puri',
    location: 'Odisha',
    tagline: 'Jagannath dham on the Bay of Bengal',
    icon: '🌊',
    meeraQuestion: 'I want to visit Jagannath Puri',
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    location: 'Punjab',
    tagline: 'Golden Temple & the spirit of seva',
    icon: '✨',
    meeraQuestion: 'Plan my Golden Temple Amritsar trip',
  },
  {
    id: 'shirdi',
    name: 'Shirdi',
    location: 'Maharashtra',
    tagline: "Sai Baba's divine abode",
    icon: '🙏',
    meeraQuestion: 'Help me plan a Shirdi Sai Baba yatra',
  },
  {
    id: 'mathura',
    name: 'Mathura',
    location: 'Uttar Pradesh',
    tagline: 'Birthplace of Lord Krishna',
    icon: '🪈',
    meeraQuestion: 'I want to do Mathura Vrindavan yatra',
  },
];
