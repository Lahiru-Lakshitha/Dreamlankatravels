import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';

export interface Tour {
    id: string;
    slug: string;
    name: string;
    short_description: string | null;
    duration: string | null;
    price: number | null;
    image_url: string | null;
    rating: number | null;
    review_count: number | null;
    tour_type: string | null;
    destinations: string[] | null;
    highlights: string[] | null;
    featured: boolean | null;
    group_size_max: number | null;
}

export const FALLBACK_TOURS: Tour[] = [
    {
        id: 'fallback-1',
        slug: 'cultural-triangle-explorer',
        name: 'Cultural Triangle Explorer',
        short_description: 'Explore the ancient kingdoms of Sri Lanka through UNESCO World Heritage sites.',
        duration: '7 Days / 6 Nights',
        price: 899,
        image_url: templeImage.src,
        rating: 4.9,
        review_count: 124,
        tour_type: 'cultural',
        destinations: ['Colombo', 'Sigiriya', 'Kandy'],
        highlights: ['Sigiriya Rock Fortress', 'Temple of the Tooth', 'Dambulla Cave Temple'],
        featured: true,
        group_size_max: 12,
    },
    {
        id: 'fallback-2',
        slug: 'beach-paradise-getaway',
        name: 'Beach Paradise Getaway',
        short_description: 'Relax on pristine beaches and discover the charming coastal towns.',
        duration: '5 Days / 4 Nights',
        price: 699,
        image_url: beachImage.src,
        rating: 4.8,
        review_count: 89,
        tour_type: 'beach',
        destinations: ['Mirissa', 'Unawatuna', 'Galle'],
        highlights: ['Mirissa Beach', 'Whale Watching', 'Galle Fort'],
        featured: true,
        group_size_max: 8,
    },
    {
        id: 'fallback-3',
        slug: 'wildlife-safari-adventure',
        name: 'Wildlife Safari Adventure',
        short_description: 'Encounter elephants, leopards, and incredible wildlife in their natural habitat.',
        duration: '6 Days / 5 Nights',
        price: 999,
        image_url: wildlifeImage.src,
        rating: 4.9,
        review_count: 156,
        tour_type: 'wildlife',
        destinations: ['Yala', 'Udawalawe', 'Minneriya'],
        highlights: ['Yala National Park', 'Elephant Gathering', 'Leopard Spotting'],
        featured: true,
        group_size_max: 6,
    },
    {
        id: 'fallback-4',
        slug: 'hill-country-tea-trails',
        name: 'Hill Country & Tea Trails',
        short_description: 'Journey through misty mountains and lush tea plantations.',
        duration: '5 Days / 4 Nights',
        price: 749,
        image_url: trainImage.src,
        rating: 4.7,
        review_count: 78,
        tour_type: 'adventure',
        destinations: ['Ella', 'Nuwara Eliya', 'Kandy'],
        highlights: ['Scenic Train Ride', 'Tea Plantation Visit', 'Ella Rock Hike'],
        featured: false,
        group_size_max: 10,
    },
    {
        id: 'fallback-5',
        slug: 'complete-sri-lanka',
        name: 'Complete Sri Lanka',
        short_description: 'The ultimate Sri Lankan experience covering all highlights.',
        duration: '14 Days / 13 Nights',
        price: 1899,
        image_url: templeImage.src,
        rating: 5.0,
        review_count: 67,
        tour_type: 'cultural',
        destinations: ['Colombo', 'Sigiriya', 'Kandy', 'Ella', 'Yala', 'Mirissa'],
        highlights: ['Cultural Triangle', 'Hill Country', 'Wildlife Safari', 'Beach Relaxation'],
        featured: true,
        group_size_max: 8,
    },
    {
        id: 'fallback-6',
        slug: 'romantic-honeymoon',
        name: 'Romantic Honeymoon',
        short_description: 'Create unforgettable memories with your loved one.',
        duration: '8 Days / 7 Nights',
        price: 1299,
        image_url: beachImage.src,
        rating: 4.9,
        review_count: 45,
        tour_type: 'honeymoon',
        destinations: ['Bentota', 'Kandy', 'Nuwara Eliya'],
        highlights: ['Private Tours', 'Luxury Stays', 'Candlelit Dinners'],
        featured: false,
        group_size_max: 2,
    },
];
