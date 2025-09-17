/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Chart } from 'chart.js/auto';
import { GoogleGenAI } from "@google/genai";

declare const L: any;

// --- MOCK DATA (for initial seeding) ---
const mockUsers = {
    'farmer@demo.com': {
        name: 'Ali Ahmed',
        plan: 'Free',
        profilePicture: 'https://i.imgur.com/8b2Yj3G.png',
        bio: 'A passionate wheat farmer from the Nile Delta, focused on sustainable agriculture and adopting new technologies.',
        preferredUnits: 'metric', // 'metric' or 'imperial'
        fields: [
            { id: 1, name: 'West Field', size: 1.5, crop: 'Wheat', location: { lat: 29.976, lng: 31.131 }, irrigation: 'Drip', boundary: [[29.977, 31.130], [29.975, 31.130], [29.975, 31.132], [29.977, 31.132]], ndvi: 0.85, yield: 2.5, plantingDate: '2024-05-15', waterSaved: 15300, carbonSaved: 45, ndviHistory: [0.65, 0.68, 0.72, 0.75, 0.81, 0.79, 0.85], moistureHistory: [45, 48, 46, 55, 60, 58, 62], yieldHistory: [2.1, 2.2, 2.2, 2.3, 2.4, 2.5, 2.5], weather: { current: { temp: 34, condition: 'Sunny', icon: '☀️', precipitation: 0, wind: 12 }, forecast: [{ day: 'Tomorrow', temp: 35, icon: '☀️' }, { day: 'Fri', temp: 36, icon: '☀️' }, { day: 'Sat', temp: 34, icon: '⛅' }] }, npkLevels: [70, 50, 60], evi: 0.65, gci: 5.5, ndre: 0.5, gndvi: 0.7, ndwi: 0.3, msi: 0.9, eviHistory: [0.55, 0.58, 0.60, 0.62, 0.64, 0.63, 0.65], gciHistory: [4.1, 4.3, 4.5, 4.8, 5.2, 5.3, 5.5], ndreHistory: [0.40, 0.42, 0.45, 0.48, 0.51, 0.49, 0.50], gndviHistory: [0.60, 0.62, 0.64, 0.66, 0.68, 0.69, 0.70], ndwiHistory: [0.25, 0.26, 0.28, 0.31, 0.32, 0.29, 0.30], msiHistory: [1.1, 1.0, 1.0, 0.95, 0.9, 0.92, 0.9] },
        ]
    },
    'premium@demo.com': {
        name: 'Fatima Zahra',
        plan: 'Premium',
        profilePicture: 'https://i.imgur.com/O1bQvYt.png',
        bio: 'Agricultural engineer specializing in precision irrigation for large-scale corn and vegetable farms.',
        preferredUnits: 'metric',
        fields: [
            { id: 1, name: 'Nile Delta Plot A', size: 25, crop: 'Corn', location: { lat: 31.15, lng: 30.80 }, irrigation: 'Pivot', boundary: [[31.155, 30.795], [31.145, 30.795], [31.145, 30.805], [31.155, 30.805]], ndvi: 0.78, yield: 3.1, plantingDate: '2024-05-20', waterSaved: 210500, carbonSaved: 350, ndviHistory: [0.60, 0.62, 0.65, 0.70, 0.75, 0.77, 0.78], moistureHistory: [50, 55, 53, 58, 62, 60, 64], yieldHistory: [2.5, 2.6, 2.6, 2.8, 2.9, 3.0, 3.1], weather: { current: { temp: 31, condition: 'Partly Cloudy', icon: '⛅', precipitation: 10, wind: 18 }, forecast: [{ day: 'Tomorrow', temp: 32, icon: '⛅' }, { day: 'Fri', temp: 30, icon: '🌧️' }, { day: 'Sat', temp: 31, icon: '⛅' }] }, npkLevels: [80, 65, 75], evi: 0.68, gci: 8.2, ndre: 0.6, gndvi: 0.75, ndwi: 0.4, msi: 0.85, eviHistory: [0.58, 0.60, 0.62, 0.64, 0.66, 0.67, 0.68], gciHistory: [6.5, 6.8, 7.1, 7.5, 7.8, 8.0, 8.2], ndreHistory: [0.50, 0.52, 0.54, 0.56, 0.58, 0.59, 0.60], gndviHistory: [0.65, 0.67, 0.68, 0.70, 0.72, 0.74, 0.75], ndwiHistory: [0.30, 0.32, 0.35, 0.38, 0.41, 0.39, 0.40], msiHistory: [0.95, 0.92, 0.90, 0.88, 0.86, 0.87, 0.85] },
            { id: 2, name: 'Nile Delta Plot B', size: 30, crop: 'Tomato', location: { lat: 31.20, lng: 30.85 }, irrigation: 'Sprinkler', boundary: [[31.205, 30.845], [31.195, 30.845], [31.195, 30.855], [31.205, 30.855]], ndvi: 0.82, yield: 4.5, plantingDate: '2024-04-25', waterSaved: 350000, carbonSaved: 510, ndviHistory: [0.70, 0.71, 0.75, 0.78, 0.80, 0.81, 0.82], moistureHistory: [70, 75, 78, 80, 79, 82, 80], yieldHistory: [3.8, 3.9, 4.0, 4.1, 4.3, 4.4, 4.5], weather: { current: { temp: 32, condition: 'Cloudy', icon: '☁️', precipitation: 20, wind: 22 }, forecast: [{ day: 'Tomorrow', temp: 31, icon: '🌧️' }, { day: 'Fri', temp: 30, icon: '🌧️' }, { day: 'Sat', temp: 31, icon: '⛅' }] }, npkLevels: [75, 70, 80], evi: 0.72, gci: 9.5, ndre: 0.7, gndvi: 0.80, ndwi: 0.5, msi: 0.80, eviHistory: [0.62, 0.64, 0.66, 0.68, 0.70, 0.71, 0.72], gciHistory: [7.5, 7.8, 8.2, 8.6, 9.0, 9.2, 9.5], ndreHistory: [0.60, 0.62, 0.64, 0.66, 0.68, 0.69, 0.70], gndviHistory: [0.70, 0.72, 0.74, 0.76, 0.78, 0.79, 0.80], ndwiHistory: [0.40, 0.43, 0.45, 0.48, 0.51, 0.49, 0.50], msiHistory: [0.90, 0.88, 0.85, 0.82, 0.80, 0.81, 0.80] },
            { id: 3, name: 'Faiyum Oasis Field', size: 15, crop: 'Cucumber', location: { lat: 29.31, lng: 30.84 }, irrigation: 'Drip', boundary: [[29.313, 30.838], [29.307, 30.838], [29.307, 30.842], [29.313, 30.842]], ndvi: 0.75, yield: 3.0, plantingDate: '2024-06-01', waterSaved: 95000, carbonSaved: 180, ndviHistory: [0.55, 0.59, 0.63, 0.68, 0.72, 0.73, 0.75], moistureHistory: [48, 50, 45, 34, 32, 30, 28], yieldHistory: [2.2, 2.3, 2.4, 2.6, 2.7, 2.9, 3.0], weather: { current: { temp: 36, condition: 'Sunny', icon: '☀️', precipitation: 0, wind: 15 }, forecast: [{ day: 'Tomorrow', temp: 37, icon: '☀️', precipitation: 0 }, { day: 'Fri', temp: 38, icon: '☀️', precipitation: 5 }, { day: 'Sat', temp: 36, icon: '☀️', precipitation: 0 }] }, npkLevels: [65, 55, 70], evi: 0.60, gci: 6.0, ndre: 0.55, gndvi: 0.68, ndwi: 0.2, msi: 1.2, eviHistory: [0.45, 0.48, 0.51, 0.54, 0.57, 0.58, 0.60], gciHistory: [4.0, 4.2, 4.5, 4.8, 5.2, 5.5, 6.0], ndreHistory: [0.45, 0.47, 0.49, 0.51, 0.53, 0.54, 0.55], gndviHistory: [0.58, 0.60, 0.62, 0.64, 0.66, 0.67, 0.68], ndwiHistory: [0.10, 0.12, 0.15, 0.18, 0.22, 0.21, 0.20], msiHistory: [1.0, 1.05, 1.1, 1.15, 1.18, 1.19, 1.2] },
            { id: 4, name: 'Western Desert Plot', size: 10, crop: 'Barley', location: { lat: 29.5, lng: 30.5 }, irrigation: 'Flood', boundary: [[29.505, 30.495], [29.495, 30.495], [29.495, 30.505], [29.505, 30.505]], ndvi: 0.35, yield: 1.2, plantingDate: '2024-05-10', waterSaved: 45000, carbonSaved: 90, ndviHistory: [0.30, 0.32, 0.35, 0.33, 0.36, 0.45, 0.35], moistureHistory: [30, 32, 35, 33, 38, 36, 40], yieldHistory: [1.0, 1.1, 1.1, 1.2, 1.2, 1.2, 1.2], weather: { current: { temp: 38, condition: 'Clear', icon: '☀️', precipitation: 0, wind: 25 }, forecast: [{ day: 'Tomorrow', temp: 39, icon: '☀️', precipitation: 0 }, { day: 'Fri', temp: 40, icon: '☀️', precipitation: 0 }, { day: 'Sat', temp: 38, icon: '☀️', precipitation: 0 }] }, npkLevels: [50, 40, 45], evi: 0.25, gci: 3.0, ndre: 0.2, gndvi: 0.4, ndwi: 0.1, msi: 1.5, eviHistory: [0.15, 0.18, 0.20, 0.22, 0.24, 0.26, 0.25], gciHistory: [2.0, 2.1, 2.2, 2.4, 2.6, 2.8, 3.0], ndreHistory: [0.10, 0.12, 0.14, 0.16, 0.18, 0.19, 0.20], gndviHistory: [0.30, 0.32, 0.34, 0.36, 0.38, 0.39, 0.40], ndwiHistory: [0.05, 0.06, 0.08, 0.10, 0.12, 0.11, 0.10], msiHistory: [1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5] }
        ]
    },
    'mohamed.wael@premium.com': {
        name: 'Mohamed Wael',
        plan: 'Premium',
        profilePicture: 'https://i.imgur.com/Q9q2b3B.png',
        bio: 'Managing a family-owned cotton farm. Always looking for ways to improve yield and sustainability.',
        preferredUnits: 'metric',
        fields: [
            { id: 101, name: 'Wael Cotton Field', size: 40, crop: 'Cotton', location: { lat: 29.8, lng: 31.0 }, irrigation: 'Drip', boundary: [[29.805, 30.995], [29.795, 30.995], [29.795, 31.005], [29.805, 31.005]], ndvi: 0.80, yield: 3.5, plantingDate: '2024-04-15', waterSaved: 420000, carbonSaved: 610, ndviHistory: [0.62, 0.65, 0.68, 0.72, 0.76, 0.78, 0.80], moistureHistory: [55, 58, 56, 60, 64, 62, 65], yieldHistory: [2.8, 2.9, 2.9, 3.1, 3.2, 3.4, 3.5], weather: { current: { temp: 33, condition: 'Sunny', icon: '☀️', precipitation: 5, wind: 14 }, forecast: [{ day: 'Tomorrow', temp: 34, icon: '☀️' }, { day: 'Fri', temp: 33, icon: '⛅' }, { day: 'Sat', temp: 32, icon: '⛅' }] }, npkLevels: [78, 68, 72], evi: 0.70, gci: 8.8, ndre: 0.65, gndvi: 0.78, ndwi: 0.45, msi: 0.82, eviHistory: [0.60, 0.62, 0.64, 0.66, 0.68, 0.69, 0.70], gciHistory: [7.0, 7.2, 7.5, 7.8, 8.2, 8.5, 8.8], ndreHistory: [0.55, 0.57, 0.59, 0.61, 0.63, 0.64, 0.65], gndviHistory: [0.68, 0.70, 0.72, 0.74, 0.76, 0.77, 0.78], ndwiHistory: [0.35, 0.37, 0.39, 0.41, 0.43, 0.44, 0.45], msiHistory: [0.9, 0.88, 0.86, 0.84, 0.83, 0.82, 0.82] }
        ]
    },
    'abdelrhman.mahmoud@premium.com': {
        name: 'Abdelrhman Mahmoud',
        plan: 'Premium',
        profilePicture: 'https://i.imgur.com/k2P0JtS.png',
        bio: 'Third-generation sugarcane farmer from Upper Egypt. Focused on maximizing tonnage and sugar content.',
        preferredUnits: 'imperial',
        fields: [
            { id: 102, name: 'Mahmoud Sugarcane Plot', size: 50, crop: 'Sugarcane', location: { lat: 25.5, lng: 32.6 }, irrigation: 'Flood', boundary: [[25.505, 32.595], [25.495, 32.595], [25.495, 32.605], [25.505, 32.605]], ndvi: 0.88, yield: 5.0, plantingDate: '2024-03-20', waterSaved: 850000, carbonSaved: 950, ndviHistory: [0.75, 0.78, 0.80, 0.82, 0.85, 0.87, 0.88], moistureHistory: [60, 62, 65, 68, 70, 68, 72], yieldHistory: [4.2, 4.3, 4.4, 4.6, 4.7, 4.9, 5.0], weather: { current: { temp: 37, condition: 'Hot', icon: '☀️', precipitation: 0, wind: 20 }, forecast: [{ day: 'Tomorrow', temp: 38, icon: '☀️' }, { day: 'Fri', temp: 39, icon: '☀️' }, { day: 'Sat', temp: 37, icon: '☀️' }] }, npkLevels: [85, 70, 80], evi: 0.78, gci: 10.5, ndre: 0.75, gndvi: 0.85, ndwi: 0.55, msi: 0.75, eviHistory: [0.68, 0.70, 0.72, 0.74, 0.76, 0.77, 0.78], gciHistory: [8.5, 8.8, 9.1, 9.5, 9.9, 10.2, 10.5], ndreHistory: [0.65, 0.67, 0.69, 0.71, 0.73, 0.74, 0.75], gndviHistory: [0.75, 0.77, 0.79, 0.81, 0.83, 0.84, 0.85], ndwiHistory: [0.45, 0.47, 0.49, 0.51, 0.53, 0.54, 0.55], msiHistory: [0.85, 0.83, 0.81, 0.79, 0.77, 0.76, 0.75] }
        ]
    },
    'mohamed.ahmed@premium.com': {
        name: 'Mohamed Ahmed',
        plan: 'Premium',
        profilePicture: 'https://i.imgur.com/G4fdeJg.png',
        bio: 'Potato farmer specializing in high-yield varieties for the export market.',
        preferredUnits: 'metric',
        fields: [
            { id: 103, name: 'Ahmed Potato Farm', size: 20, crop: 'Potato', location: { lat: 30.5, lng: 31.5 }, irrigation: 'Sprinkler', boundary: [[30.505, 31.495], [30.495, 31.495], [30.495, 31.505], [30.505, 31.505]], ndvi: 0.76, yield: 4.0, plantingDate: '2024-05-01', waterSaved: 180000, carbonSaved: 250, ndviHistory: [0.60, 0.63, 0.66, 0.70, 0.72, 0.74, 0.76], moistureHistory: [50, 52, 55, 54, 58, 56, 60], yieldHistory: [3.1, 3.2, 3.3, 3.5, 3.7, 3.8, 4.0], weather: { current: { temp: 30, condition: 'Partly Cloudy', icon: '⛅', precipitation: 15, wind: 16 }, forecast: [{ day: 'Tomorrow', temp: 31, icon: '⛅' }, { day: 'Fri', temp: 29, icon: '🌧️' }, { day: 'Sat', temp: 30, icon: '⛅' }] }, npkLevels: [70, 75, 65], evi: 0.66, gci: 7.5, ndre: 0.58, gndvi: 0.72, ndwi: 0.38, msi: 0.92, eviHistory: [0.56, 0.58, 0.60, 0.62, 0.64, 0.65, 0.66], gciHistory: [6.0, 6.2, 6.5, 6.8, 7.0, 7.2, 7.5], ndreHistory: [0.48, 0.50, 0.52, 0.54, 0.56, 0.57, 0.58], gndviHistory: [0.62, 0.64, 0.66, 0.68, 0.70, 0.71, 0.72], ndwiHistory: [0.28, 0.30, 0.32, 0.34, 0.36, 0.37, 0.38], msiHistory: [1.0, 0.98, 0.96, 0.94, 0.93, 0.92, 0.92] }
        ]
    },
    'mostafa.saber@premium.com': {
        name: 'Mostafa Saber',
        plan: 'Premium',
        profilePicture: 'https://i.imgur.com/kP0q7tH.png',
        bio: 'Rice farmer with expertise in water management and flood irrigation techniques.',
        preferredUnits: 'metric',
        fields: [
            { id: 104, name: 'Saber Rice Paddy', size: 35, crop: 'Rice', location: { lat: 31.0, lng: 31.0 }, irrigation: 'Flood', boundary: [[31.005, 30.995], [30.995, 30.995], [30.995, 31.005], [31.005, 31.005]], ndvi: 0.85, yield: 4.8, plantingDate: '2024-05-05', waterSaved: 550000, carbonSaved: 700, ndviHistory: [0.70, 0.72, 0.75, 0.78, 0.81, 0.83, 0.85], moistureHistory: [75, 78, 80, 82, 80, 83, 85], yieldHistory: [3.9, 4.0, 4.1, 4.3, 4.5, 4.7, 4.8], weather: { current: { temp: 32, condition: 'Humid', icon: '☁️', precipitation: 25, wind: 12 }, forecast: [{ day: 'Tomorrow', temp: 31, icon: '🌧️' }, { day: 'Fri', temp: 30, icon: '🌧️' }, { day: 'Sat', temp: 32, icon: '⛅' }] }, npkLevels: [82, 65, 78], evi: 0.75, gci: 9.8, ndre: 0.72, gndvi: 0.82, ndwi: 0.6, msi: 0.78, eviHistory: [0.65, 0.67, 0.69, 0.71, 0.73, 0.74, 0.75], gciHistory: [8.0, 8.3, 8.6, 9.0, 9.3, 9.5, 9.8], ndreHistory: [0.62, 0.64, 0.66, 0.68, 0.70, 0.71, 0.72], gndviHistory: [0.72, 0.74, 0.76, 0.78, 0.80, 0.81, 0.82], ndwiHistory: [0.50, 0.52, 0.54, 0.56, 0.58, 0.59, 0.60], msiHistory: [0.88, 0.86, 0.84, 0.82, 0.80, 0.79, 0.78] }
        ]
    },
    'ahmed.sayed@premium.com': {
        name: 'Ahmed Sayed',
        plan: 'Premium',
        profilePicture: 'https://i.imgur.com/8zW3b5A.png',
        bio: 'Onion and garlic specialist with a focus on curing and storage techniques.',
        preferredUnits: 'metric',
        fields: [
            { id: 105, name: 'Sayed Onion Field', size: 18, crop: 'Onion', location: { lat: 29.0, lng: 31.1 }, irrigation: 'Drip', boundary: [[29.005, 31.095], [28.995, 31.095], [28.995, 31.105], [29.005, 31.105]], ndvi: 0.79, yield: 3.8, plantingDate: '2024-04-22', waterSaved: 165000, carbonSaved: 220, ndviHistory: [0.65, 0.68, 0.70, 0.73, 0.75, 0.77, 0.79], moistureHistory: [48, 50, 53, 55, 54, 57, 58], yieldHistory: [3.0, 3.1, 3.2, 3.4, 3.5, 3.7, 3.8], weather: { current: { temp: 34, condition: 'Clear', icon: '☀️', precipitation: 0, wind: 17 }, forecast: [{ day: 'Tomorrow', temp: 35, icon: '☀️' }, { day: 'Fri', temp: 36, icon: '☀️' }, { day: 'Sat', temp: 34, icon: '☀️' }] }, npkLevels: [72, 60, 70], evi: 0.69, gci: 8.0, ndre: 0.62, gndvi: 0.76, ndwi: 0.42, msi: 0.88, eviHistory: [0.59, 0.61, 0.63, 0.65, 0.67, 0.68, 0.69], gciHistory: [6.5, 6.7, 7.0, 7.3, 7.6, 7.8, 8.0], ndreHistory: [0.52, 0.54, 0.56, 0.58, 0.60, 0.61, 0.62], gndviHistory: [0.66, 0.68, 0.70, 0.72, 0.74, 0.75, 0.76], ndwiHistory: [0.32, 0.34, 0.36, 0.38, 0.40, 0.41, 0.42], msiHistory: [0.98, 0.96, 0.94, 0.92, 0.90, 0.89, 0.88] }
        ]
    },
    'dr.yasser@premium.com': {
        name: 'DR Yasser',
        plan: 'Premium',
        profilePicture: 'https://i.imgur.com/kP0q7tH.png',
        bio: 'Agronomist and consultant with a focus on large citrus groves and modernizing orchard management.',
        preferredUnits: 'imperial',
        fields: [
            { id: 106, name: 'Yasser Citrus Grove', size: 60, crop: 'Citrus', location: { lat: 30.8, lng: 30.5 }, irrigation: 'Sprinkler', boundary: [[30.805, 30.495], [30.795, 30.495], [30.795, 30.505], [30.805, 30.505]], ndvi: 0.83, yield: 6.2, plantingDate: '2023-10-10', waterSaved: 1250000, carbonSaved: 1800, ndviHistory: [0.72, 0.74, 0.76, 0.78, 0.80, 0.82, 0.83], moistureHistory: [58, 60, 62, 65, 63, 66, 68], yieldHistory: [5.1, 5.3, 5.4, 5.6, 5.8, 6.0, 6.2], weather: { current: { temp: 31, condition: 'Breezy', icon: '💨', precipitation: 10, wind: 25 }, forecast: [{ day: 'Tomorrow', temp: 32, icon: '⛅' }, { day: 'Fri', temp: 30, icon: '⛅' }, { day: 'Sat', temp: 31, icon: '☀️' }] }, npkLevels: [80, 72, 85], evi: 0.73, gci: 9.2, ndre: 0.70, gndvi: 0.81, ndwi: 0.58, msi: 0.8, eviHistory: [0.63, 0.65, 0.67, 0.69, 0.71, 0.72, 0.73], gciHistory: [7.8, 8.0, 8.3, 8.6, 8.8, 9.0, 9.2], ndreHistory: [0.60, 0.62, 0.64, 0.66, 0.68, 0.69, 0.70], gndviHistory: [0.71, 0.73, 0.75, 0.77, 0.79, 0.80, 0.81], ndwiHistory: [0.48, 0.50, 0.52, 0.54, 0.56, 0.57, 0.58], msiHistory: [0.92, 0.90, 0.88, 0.85, 0.83, 0.81, 0.8] }
        ]
    }
};

const mockCommunityPosts = [
    { id: 1, author: 'Youssef Hassan', title: 'Best time to plant corn in Upper Egypt?', content: 'I have a field near Luxor and I was wondering if it\'s too late to plant corn for this season. What are your experiences with the timing?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), replies: [{id: 101, author: 'Fatima Zahra', content: 'You should be fine if you plant within the next week!', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)}] },
    { id: 2, author: 'Amina Khalil', title: 'Advice on dealing with tomato blight?', content: 'I\'ve noticed some early signs of blight on my tomato plants in the Delta region. What are the most effective organic treatments you\'ve used? I want to avoid harsh chemicals.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), replies: [] },
    { id: 3, author: 'Ali Ahmed', title: 'Question about irrigation schedules', content: 'What is the optimal irrigation frequency for wheat during the heading stage? I am using drip irrigation.', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), replies: [{id: 102, author: 'Youssef Hassan', content: 'I usually water every 2-3 days at that stage, but it depends on soil moisture.', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)}, {id: 103, author: 'Ali Ahmed', content: 'Thanks, that is helpful!', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 3600000)}] }
];

const translations = {
    en: {
        // Auth
        appTitle: 'Agri-Optimize',
        appSubtitle: 'Your AI Farming Assistant',
        emailLabel: 'Email Address',
        passwordLabel: 'Password',
        login: 'Login',
        registerPrompt: "Don't have an account?",
        registerLink: 'Register',
        // Header & Nav
        welcome: 'Welcome',
        dashboard: 'Dashboard',
        myFields: 'My Fields',
        reports: 'Reports',
        community: 'Community',
        profile: 'Profile',
        freePlan: 'Free Plan',
        premiumPlan: 'Premium Plan',
        upgrade: 'Upgrade',
        logout: 'Logout',
        switchLanguage: 'العربية',
        // Dashboard
        myFieldsOverview: 'My Fields Overview',
        noFieldsOnMap: 'No fields to display. Add a field to see it on the map.',
        ndviHealth: 'NDVI (Plant Health)',
        soilMoisture: 'Soil Moisture',
        npkLevels: 'NPK Levels',
        heatStress: 'Heat Stress Temp',
        cropYieldPotential: 'Crop Yield Potential',
        premiumFeature: 'Premium Feature',
        upgradeNow: 'Upgrade Now',
        aiRecommendations: 'AI Recommendations',
        harvestPredictionTitle: '🌾 Harvest Prediction',
        harvestPredictionText: 'Expected harvest in 12 days with an estimated yield of {yield} tons/{unit}.',
        fertilizerAlertTitle: '❗ Fertilizer Alert',
        // General UI
        refreshData: 'Refresh Data',
        refreshing: 'Refreshing...',
        // New Indices
        evi: 'Enhanced Vegetation Index (EVI)',
        gci: 'Green Chlorophyll Index (GCI)',
        ndre: 'Red Edge Index (NDRE)',
        gndvi: 'Green NDVI (GNDVI)',
        ndwi: 'Water Index (NDWI)',
        msi: 'Moisture Stress Index (MSI)',
        // Alerts
        criticalAlerts: 'Critical Alerts',
        warningsTitle: 'Warnings',
        alertMessages: {
            ndviDrop: 'Significant NDVI drop of **{percentage}%** detected. **Immediate inspection** is recommended.',
            lowMoisture: 'Prolonged low soil moisture detected with no rain expected. **Irrigation is urgently needed.**',
            ndviIncrease: 'Unusual rapid NDVI increase of **{percentage}%** detected. This could indicate **weed growth** or over-fertilization. Field check suggested.',
            heatStress: 'Extreme heat warning: Temperatures above **{temp}** are forecasted for the next 3 days. Ensure **adequate irrigation** to prevent heat stress.',
            diseaseRisk: 'High disease risk detected due to prolonged high humidity and warm temperatures. **Scout the field** for signs of fungal infections like blight or mildew.',
            irrigationAlert: 'Scheduled irrigation for **{crop}** is due **{dueDate}**. Apply **{amount} L/m²**.'
        },
        emailAlertSent: 'An email alert for {fieldName} has been sent to {email}.',
        // Fields
        noFieldsFound: 'No fields found.',
        addFirstFieldPrompt: 'Add your first field to start monitoring.',
        addNewField: 'Add New Field',
        editField: 'Edit Field',
        deleteField: 'Delete Field',
        fieldDetails: {
            crop: 'Crop',
            size: 'Size',
            location: 'Location',
            irrigation: 'Irrigation',
            feddanUnit: 'feddan',
            acresUnit: 'acres'
        },
        fieldLocation: 'Field Location',
        noFieldsToDisplay: 'No fields to display. Please add a field.',
        mapLoadError: 'Could not load map.',
        healthStatus: 'Health Status',
        healthLegend: 'Health Legend',
        healthy: 'Healthy',
        moderate: 'Moderate',
        poor: 'Poor',
        aiFieldAnalysis: 'AI Field Analysis',
        analyzingData: 'Analyzing field data...',
        aiError: 'An error occurred while fetching the AI analysis.',
        // Water Management
        waterManagement: 'Water & Impact Management',
        cropAge: 'Crop Age',
        daysOld: 'days old',
        nextIrrigation: 'Next Irrigation',
        waterSaved: 'Water Saved',
        waterFootprint: 'Water Footprint',
        carbonFootprint: 'Carbon Saved',
        soilTexture: 'Soil Texture',
        soilTypes: {
            sandy: 'Sandy',
            sandyLoam: 'Sandy Loam',
            loam: 'Loam',
            clayLoam: 'Clay Loam',
            clay: 'Clay',
            unknown: 'N/A'
        },
        soilHealthScore: 'Soil Health Score',
        healthRatings: {
            good: 'Good',
            moderate: 'Moderate',
            poor: 'Poor'
        },
        // Weather
        weatherForecast: 'Weather Forecast',
        today: 'Today',
        precipitation: 'Precip',
        wind: 'Wind',
        // Add/Edit Field Modal
        addFieldModalTitle: 'Add a New Field',
        editFieldModalTitle: 'Edit Field Details',
        selectFieldLocation: 'Select Field Location',
        clearDrawing: 'Clear Drawing',
        fieldName: 'Field Name',
        fieldSize: 'Field Size',
        cropType: 'Crop Type',
        irrigationType: 'Irrigation Type',
        plantingDate: 'Planting Date',
        saveField: 'Save Field',
        saveChanges: 'Save Changes',
        cancel: 'Cancel',
        gettingLocation: 'Loading map...',
        detectLocation: 'Detect My Location',
        geolocationError: 'Could not detect location. Please enable permissions and try again.',
        enterLocationManually: 'Please enter location manually',
        geolocationNotSupported: 'Geolocation not supported',
        fieldNameRequired: 'Field name is required.',
        fieldNameInvalid: 'Field name can only contain letters, numbers, and spaces.',
        fieldSizeRequired: 'Field size is required.',
        fieldSizeInvalid: 'Please enter a valid positive number for the size.',
        drawBoundaryPrompt: 'Please draw the field boundary on the map.',
        aiLandValidationError: 'AI analysis indicates this is not an active agricultural area. Please select a valid farmland.',
        planLimitError: 'Field size of <strong>{size}</strong> exceeds your <strong>Free Plan limit of {limit}</strong>. Please draw a smaller field or upgrade your plan.',
        upgradePlan: 'Upgrade Plan',
        selectCrop: 'Select a crop',
        cropTypes: {
            wheat: 'Wheat',
            corn: 'Corn',
            tomato: 'Tomato',
            cucumber: 'Cucumber',
            cotton: 'Cotton',
            sugarcane: 'Sugarcane',
            potato: 'Potato',
            rice: 'Rice',
            onion: 'Onion',
            citrus: 'Citrus',
            barley: 'Barley',
        },
        selectSize: 'Select a size',
        fieldSizes: {
            '1': '1 feddan',
            '2': '2 feddans',
            '5': '5 feddans',
            '10': '10 feddans',
            '20': '20 feddans',
            '50': '50 feddans',
            '100': '100+ feddans'
        },
        // Delete Confirmation Modal
        confirmDeletionTitle: 'Confirm Deletion',
        confirmDeletionText: 'Are you sure you want to permanently delete',
        confirmDeletionWarning: 'This action cannot be undone.',
        confirmDelete: 'Confirm Delete',
        // Reports
        reportsTitle: 'Farm Performance Reports',
        overallAnalytics: 'Overall Analytics',
        fieldSpecificAnalysis: 'Field-Specific Analysis',
        selectFieldPrompt: 'Select a field to see details',
        totalFields: 'Total Fields',
        totalAcreage: 'Total Acreage',
        avgPlantHealth: 'Avg. Plant Health (NDVI)',
        totalEstYield: 'Total Estimated Yield',
        yieldUnit: 'tons',
        downloadPDF: 'Download PDF',
        downloadCSV: 'Download CSV',
        // Community
        communityTitle: 'Community Forum',
        askQuestion: 'Ask a Question',
        newPostTitle: 'Create a New Post',
        postTitleLabel: 'Title / Subject',
        postContentLabel: 'Your Question or Comment',
        submitPost: 'Submit Post',
        repliesCount: 'Replies',
        noPosts: 'No community posts yet. Be the first to ask a question!',
        postedBy: 'Posted by',
        ago: 'ago',
        days: 'days',
        day: 'day',
        hours: 'hours',
        hour: 'hour',
        minutes: 'minutes',
        minute: 'minute',
        justNow: 'Just now',
        titleRequired: 'Title is required.',
        contentRequired: 'Content is required.',
        viewReplies: 'View Replies',
        hideReplies: 'Hide Replies',
        addReply: 'Add Reply',
        yourReply: 'Your Reply...',
        edit: 'Edit',
        save: 'Save',
        // Profile
        profileTitle: 'My Profile',
        editProfile: 'Edit Profile',
        bio: 'Bio',
        profilePictureURL: 'Profile Picture URL',
        preferredUnits: 'Preferred Units',
        metric: 'Metric (°C, feddan)',
        imperial: 'Imperial (°F, acres)',
        // Tooltips
        tooltips: {
            ndvi: 'Normalized Difference Vegetation Index: Measures plant health and vigor based on how the plant reflects light. Higher values indicate healthier vegetation.',
            soilMoisture: 'The amount of water present in the soil. Crucial for plant growth and scheduling irrigation.',
            npk: 'Represents the levels of Nitrogen (N), Phosphorus (P), and Potassium (K) - essential macronutrients for plant growth.',
            heatStress: 'Indicates when temperatures are high enough to negatively impact crop growth and yield potential.',
            cropYield: 'A dynamic estimation of the total crop production per unit of area, based on health, weather, and growth stage. Helps in forecasting revenue and planning logistics.',
            totalFields: 'The total number of distinct fields registered under your account.',
            totalAcreage: 'The sum of the area of all your fields.',
            avgNdvi: "The average NDVI value across all your fields, providing a quick overview of your entire farm's health.",
            evi: 'Enhanced Vegetation Index: Similar to NDVI but corrects for atmospheric and soil background noise. It is more sensitive to changes in dense canopy areas.',
            gci: 'Green Chlorophyll Index: Measures the chlorophyll content in leaves, which is a key indicator of plant nitrogen levels and overall health during the growing season.',
            ndre: 'Normalized Difference Red Edge Index: Uses the red-edge band to measure health in mature crops when NDVI can become saturated. Good for late-season monitoring.',
            gndvi: 'Green Normalized Difference Vegetation Index: Similar to NDVI but more sensitive to chlorophyll concentration. Useful for detecting subtle changes in plant health.',
            ndwi: 'Normalized Difference Water Index: Measures the water content within plant leaves. Useful for monitoring drought stress and irrigation effectiveness.',
            msi: 'Moisture Stress Index: Indicates the level of water stress in plants. Lower values are better, indicating less stress.'
        }
    },
    ar: {
        // Auth
        appTitle: 'أجري-أوبتمايز',
        appSubtitle: 'مساعدك الزراعي الذكي',
        emailLabel: 'البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        login: 'تسجيل الدخول',
        registerPrompt: 'ليس لديك حساب؟',
        registerLink: 'سجل الآن',
        // Header & Nav
        welcome: 'أهلاً بك',
        dashboard: 'لوحة التحكم',
        myFields: 'حقولي',
        reports: 'التقارير',
        community: 'المجتمع',
        profile: 'ملفي الشخصي',
        freePlan: 'الخطة المجانية',
        premiumPlan: 'الخطة المميزة',
        upgrade: 'ترقية',
        logout: 'تسجيل الخروج',
        switchLanguage: 'English',
        // Dashboard
        myFieldsOverview: 'نظرة عامة على حقولي',
        noFieldsOnMap: 'لا توجد حقول لعرضها. أضف حقلاً لرؤيته على الخريطة.',
        ndviHealth: 'مؤشر NDVI (صحة النبات)',
        soilMoisture: 'رطوبة التربة',
        npkLevels: 'مستويات NPK',
        heatStress: 'حرارة الإجهاد',
        cropYieldPotential: 'إمكانية إنتاجية المحصول',
        premiumFeature: 'ميزة مميزة',
        upgradeNow: 'الترقية الآن',
        aiRecommendations: 'توصيات الذكاء الاصطناعي',
        harvestPredictionTitle: '🌾 توقعات الحصاد',
        harvestPredictionText: 'الحصاد المتوقع خلال 12 يومًا بإنتاجية تقدر بـ {yield} طن/{unit}.',
        fertilizerAlertTitle: '❗ تنبيه التسميد',
        // General UI
        refreshData: 'تحديث البيانات',
        refreshing: 'جاري التحديث...',
        // New Indices
        evi: 'مؤشر الغطاء النباتي المحسن (EVI)',
        gci: 'مؤشر الكلوروفيل الأخضر (GCI)',
        ndre: 'مؤشر الحافة الحمراء (NDRE)',
        gndvi: 'مؤشر NDVI الأخضر (GNDVI)',
        ndwi: 'مؤشر المياه (NDWI)',
        msi: 'مؤشر إجهاد الرطوبة (MSI)',
        // Alerts
        criticalAlerts: 'تنبيهات حرجة',
        warningsTitle: 'تحذيرات',
        alertMessages: {
            ndviDrop: 'تم اكتشاف انخفاض كبير في مؤشر NDVI بنسبة **{percentage}%**. يوصى **بالفحص الفوري**.',
            lowMoisture: 'رطوبة التربة منخفضة لفترة طويلة مع عدم توقع هطول أمطار. **الري مطلوب بشكل عاجل**.',
            ndviIncrease: 'تم اكتشاف زيادة سريعة وغير طبيعية في مؤشر NDVI بنسبة **{percentage}%**. قد يشير هذا إلى **نمو الأعشاب الضارة** أو الإفراط في التسميد. يوصى بفحص الحقل.',
            heatStress: 'تحذير من الحرارة الشديدة: من المتوقع أن تتجاوز درجات الحرارة **{temp}** خلال الأيام الثلاثة القادمة. تأكد من **الري الكافي** لمنع الإجهاد الحراري.',
            diseaseRisk: 'تم اكتشاف خطر مرتفع للإصابة بالأمراض بسبب الرطوبة العالية لفترة طويلة ودرجات الحرارة الدافئة. يوصى **بتفقد الحقل** بحثًا عن علامات العدوى الفطرية مثل اللفحة أو البياض الدقيقي.',
            irrigationAlert: 'الري المجدول لمحصول **{crop}** مستحق **{dueDate}**. استخدم **{amount} لتر/م²**.'
        },
        emailAlertSent: 'تم إرسال تنبيه عبر البريد الإلكتروني بخصوص {fieldName} إلى {email}.',
        // Fields
        noFieldsFound: 'لم يتم العثور على حقول.',
        addFirstFieldPrompt: 'أضف حقلك الأول لبدء المراقبة.',
        addNewField: 'أضف حقلًا جديدًا',
        editField: 'تعديل الحقل',
        deleteField: 'حذف الحقل',
        fieldDetails: {
            crop: 'المحصول',
            size: 'المساحة',
            location: 'الموقع',
            irrigation: 'الري',
            feddanUnit: 'فدان',
            acresUnit: 'فدان أمريكي'
        },
        fieldLocation: 'موقع الحقل',
        noFieldsToDisplay: 'لا توجد حقول لعرضها. يرجى إضافة حقل.',
        mapLoadError: 'تعذر تحميل الخريطة.',
        healthStatus: 'الحالة الصحية',
        healthLegend: 'مفتاح الحالة',
        healthy: 'صحي',
        moderate: 'متوسط',
        poor: 'ضعيف',
        aiFieldAnalysis: 'تحليل الذكاء الاصطناعي',
        analyzingData: 'جاري تحليل بيانات الحقل...',
        aiError: 'حدث خطأ أثناء جلب تحليل الذكاء الاصطناعي.',
        // Water Management
        waterManagement: 'إدارة المياه والأثر البيئي',
        cropAge: 'عمر المحصول',
        daysOld: 'يوم',
        nextIrrigation: 'الري التالي',
        waterSaved: 'المياه الموفرة',
        waterFootprint: 'البصمة المائية',
        carbonFootprint: 'الكربون الموفر',
        soilTexture: 'قوام التربة',
        soilTypes: {
            sandy: 'رملية',
            sandyLoam: 'رملية طميية',
            loam: 'طميية',
            clayLoam: 'طينية طميية',
            clay: 'طينية',
            unknown: 'غير متاح'
        },
        soilHealthScore: 'صحة التربة',
        healthRatings: {
            good: 'جيدة',
            moderate: 'متوسطة',
            poor: 'ضعيفة'
        },
        // Weather
        weatherForecast: 'توقعات الطقس',
        today: 'اليوم',
        precipitation: 'هطول',
        wind: 'رياح',
        // Add/Edit Field Modal
        addFieldModalTitle: 'إضافة حقل جديد',
        editFieldModalTitle: 'تعديل تفاصيل الحقل',
        selectFieldLocation: 'حدد موقع الحقل',
        clearDrawing: 'مسح الرسم',
        fieldName: 'اسم الحقل',
        fieldSize: 'مساحة الحقل',
        cropType: 'نوع المحصول',
        irrigationType: 'نوع الري',
        plantingDate: 'تاريخ الزراعة',
        saveField: 'حفظ الحقل',
        saveChanges: 'حفظ التغييرات',
        cancel: 'إلغاء',
        gettingLocation: 'جاري تحميل الخريطة...',
        detectLocation: 'تحديد موقعي',
        geolocationError: 'تعذر تحديد موقعك. يرجى تفعيل الأذونات والمحاولة مرة أخرى.',
        enterLocationManually: 'يرجى إدخال الموقع يدويًا',
        geolocationNotSupported: 'تحديد الموقع الجغرافي غير مدعوم',
        fieldNameRequired: 'اسم الحقل مطلوب.',
        fieldNameInvalid: 'يمكن أن يحتوي اسم الحقل على أحرف وأرقام ومسافات فقط.',
        fieldSizeRequired: 'مساحة الحقل مطلوبة.',
        fieldSizeInvalid: 'الرجاء إدخال رقم موجب صالح للمساحة.',
        drawBoundaryPrompt: 'يرجى رسم حدود الحقل على الخريطة.',
        aiLandValidationError: 'يشير تحليل الذكاء الاصطناعي إلى أن هذه ليست منطقة زراعية نشطة. يرجى تحديد أرض زراعية صالحة.',
        planLimitError: 'مساحة الحقل <strong>{size}</strong> تتجاوز حد <strong>الخطة المجانية وهو {limit}</strong>. يرجى رسم حقل أصغر أو ترقية خطتك.',
        upgradePlan: 'ترقية الخطة',
        selectCrop: 'اختر محصولًا',
        cropTypes: {
            wheat: 'قمح',
            corn: 'ذرة',
            tomato: 'طماطم',
            cucumber: 'خيار',
            cotton: 'قطن',
            sugarcane: 'قصب السكر',
            potato: 'بطاطس',
            rice: 'أرز',
            onion: 'بصل',
            citrus: 'موالح',
            barley: 'شعير',
        },
        selectSize: 'اختر المساحة',
        fieldSizes: {
            '1': '1 فدان',
            '2': '2 فدان',
            '5': '5 أفدنة',
            '10': '10 أفدنة',
            '20': '20 فدانًا',
            '50': '50 فدانًا',
            '100': '100+ فدان'
        },
        // Delete Confirmation Modal
        confirmDeletionTitle: 'تأكيد الحذف',
        confirmDeletionText: 'هل أنت متأكد أنك تريد حذف',
        confirmDeletionWarning: 'لا يمكن التراجع عن هذا الإجراء.',
        confirmDelete: 'تأكيد الحذف',
        // Reports
        reportsTitle: 'تقارير أداء المزرعة',
        overallAnalytics: 'التحليلات الإجمالية',
        fieldSpecificAnalysis: 'تحليل خاص بالحقل',
        selectFieldPrompt: 'اختر حقلاً لرؤية التفاصيل',
        totalFields: 'إجمالي الحقول',
        totalAcreage: 'إجمالي المساحة',
        avgPlantHealth: 'متوسط صحة النبات (NDVI)',
        totalEstYield: 'إجمالي الإنتاج المقدر',
        yieldUnit: 'طن',
        downloadPDF: 'تحميل PDF',
        downloadCSV: 'تحميل CSV',
        // Community
        communityTitle: 'منتدى المجتمع',
        askQuestion: 'اطرح سؤالاً',
        newPostTitle: 'إنشاء منشور جديد',
        postTitleLabel: 'العنوان / الموضوع',
        postContentLabel: 'سؤالك أو تعليقك',
        submitPost: 'إرسال المنشور',
        repliesCount: 'ردود',
        noPosts: 'لا توجد منشورات في المجتمع حتى الآن. كن أول من يطرح سؤالاً!',
        postedBy: 'نشر بواسطة',
        ago: 'منذ',
        days: 'أيام',
        day: 'يوم',
        hours: 'ساعات',
        hour: 'ساعة',
        minutes: 'دقائق',
        minute: 'دقيقة',
        justNow: 'الآن',
        titleRequired: 'العنوان مطلوب.',
        contentRequired: 'المحتوى مطلوب.',
        viewReplies: 'عرض الردود',
        hideReplies: 'إخفاء الردود',
        addReply: 'أضف رداً',
        yourReply: 'ردك...',
        edit: 'تعديل',
        save: 'حفظ',
        // Profile
        profileTitle: 'ملفي الشخصي',
        editProfile: 'تعديل الملف الشخصي',
        bio: 'نبذة تعريفية',
        profilePictureURL: 'رابط صورة الملف الشخصي',
        preferredUnits: 'الوحدات المفضلة',
        metric: 'متري (مئوية، فدان)',
        imperial: 'إمبراطوري (فهرنهايت، فدان أمريكي)',
        // Tooltips
        tooltips: {
            ndvi: 'مؤشر اختلاف الغطاء النباتي الطبيعي: يقيس صحة النبات وحيويته بناءً على كيفية عكس النبات للضوء. القيم الأعلى تشير إلى غطاء نباتي أكثر صحة.',
            soilMoisture: 'كمية الماء الموجودة في التربة. ضرورية لنمو النبات وجدولة الري.',
            npk: 'يمثل مستويات النيتروجين (N) والفوسفور (P) والبوتاسيوم (K) - وهي مغذيات أساسية لنمو النبات.',
            heatStress: 'يشير إلى متى تكون درجات الحرارة مرتفعة بما يكفي للتأثير سلبًا على نمو المحاصيل والإنتاجية المحتملة.',
            cropYield: 'تقدير ديناميكي لإجمالي إنتاج المحصول لكل وحدة مساحة، بناءً على الصحة والطقس ومرحلة النمو. يساعد في توقع الإيرادات وتخطيط الخدمات اللوجستية.',
            totalFields: 'العدد الإجمالي للحقول المسجلة في حسابك.',
            totalAcreage: 'مجموع مساحة جميع حقولك.',
            avgNdvi: 'متوسط قيمة مؤشر NDVI عبر جميع حقولك، مما يوفر نظرة عامة سريعة على صحة مزرعتك بأكملها.',
            evi: 'مؤشر الغطاء النباتي المحسن: مشابه لمؤشر NDVI ولكنه يصحح بعض الظروف الجوية وضوضاء خلفية التربة. وهو أكثر حساسية للتغيرات في المناطق ذات الغطاء النباتي الكثيف.',
            gci: 'مؤشر الكلوروفيل الأخضر: يقيس محتوى الكلوروفيل في الأوراق، وهو مؤشر رئيسي لمستويات النيتروجين في النبات والصحة العامة خلال موسم النمو.',
            ndre: 'مؤشر اختلاف الحافة الحمراء المعياري: يستخدم نطاق الحافة الحمراء لقياس صحة المحاصيل الناضجة عندما يصل NDVI إلى مرحلة التشبع. جيد للمراقبة في أواخر الموسم.',
            gndvi: 'مؤشر اختلاف الغطاء النباتي الطبيعي الأخضر: مشابه لمؤشر NDVI ولكنه أكثر حساسية لتركيز الكلوروفيل. مفيد للكشف عن التغيرات الطفيفة في صحة النبات.',
            ndwi: 'مؤشر اختلاف المياه المعياري: يقيس محتوى الماء داخل أوراق النبات. مفيد لمراقبة إجهاد الجفاف وفعالية الري.',
            msi: 'مؤشر إجهاد الرطوبة: يشير إلى مستوى إجهاد الماء في النباتات. القيم المنخفضة أفضل، مما يشير إلى إجهاد أقل.'
        }
    }
};

// --- PERSISTENT APP DATA ---
let allUsers = {};
let allPosts = [];
let allUserSettings = {};

// --- APPLICATION STATE ---
let state = {
    currentUser: null,
    currentUserEmail: null,
    currentView: 'dashboard',
    selectedFieldId: null,
    editingFieldId: null,
    reportSelectedFieldId: null,
    lang: 'en',
    communitySelectedPostId: null,
    editingContent: { type: null, id: null }, // { type: 'post' | 'reply', id: number }
    editText: '', // Holds the text for the currently edited item
    isRefreshing: false,
    sentAlerts: [], // Tracks sent alerts to avoid duplicates, e.g., ['fieldId-alertType']
    aiAnalysisCache: {}, // { [cacheKey]: { analysis: '...', timestamp: Date.now() } }
    isEditingProfile: false,
};

let aiAnalysisDebounceTimer = null;
let reportAiAnalysisDebounceTimer = null; // for report view
let landValidationDebounceTimer = null; // for add field view
let newFieldBoundary: any[] | null = null;
let fieldMapInstance: any = null;
let dashboardMapInstance: any = null;


// --- DOM ELEMENTS ---
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const langSwitcher = document.getElementById('lang-switcher');
const welcomeMessage = document.getElementById('welcome-message');
const planStatusContainer = document.getElementById('plan-status');
const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');
const addFieldModal = document.getElementById('add-field-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const newPostModal = document.getElementById('new-post-modal');
const toastContainer = document.getElementById('toast-container');

// --- DATA PERSISTENCE ---
/**
 * Saves the entire application data and session state to localStorage.
 */
function saveAppData() {
    const appData = {
        users: allUsers,
        posts: allPosts,
        userSettings: allUserSettings,
        session: {
            lang: state.lang,
            lastUserEmail: state.currentUserEmail
        }
    };
    localStorage.setItem('agriOptimizeData', JSON.stringify(appData));
}

/**
 * Loads application data from localStorage. If not found, initializes with mock data.
 */
function loadAppData() {
    const savedData = localStorage.getItem('agriOptimizeData');
    if (savedData) {
        const appData = JSON.parse(savedData);
        // Date strings in posts need to be converted back to Date objects
        if (appData.posts) {
            appData.posts.forEach(post => {
                post.timestamp = new Date(post.timestamp);
                post.replies.forEach(reply => reply.timestamp = new Date(reply.timestamp));
            });
        }
        allUsers = appData.users || {};
        allPosts = appData.posts || [];
        allUserSettings = appData.userSettings || {};
        state.lang = appData.session?.lang || 'en';
        state.currentUserEmail = appData.session?.lastUserEmail || null;
    } else {
        // First time load: deep copy mock data
        allUsers = JSON.parse(JSON.stringify(mockUsers));
        allPosts = JSON.parse(JSON.stringify(mockCommunityPosts));
        // Convert date strings from JSON.stringify back to Date objects
        allPosts.forEach(post => {
            post.timestamp = new Date(post.timestamp);
            post.replies.forEach(reply => reply.timestamp = new Date(reply.timestamp));
        });
        allUserSettings = {};
        saveAppData(); // Initial save
    }
}

/**
 * Updates a specific setting for the current user and persists it.
 * @param {string} key - The setting key to update.
 * @param {any} value - The new value for the setting.
 */
function updateCurrentUserSetting(key, value) {
    if (!state.currentUserEmail) return;

    if (!allUserSettings[state.currentUserEmail]) {
        allUserSettings[state.currentUserEmail] = {};
    }
    allUserSettings[state.currentUserEmail][key] = value;
    saveAppData();
}

/**
 * Applies persisted settings for a given user to the global state.
 * @param {string} email - The user's email.
 */
function applyUserSettings(email) {
    const settings = allUserSettings[email] || {};
    state.lang = settings.lang || state.lang || 'en';
    state.currentView = settings.lastView || 'dashboard';
    state.selectedFieldId = settings.lastSelectedFieldId || null;
    state.reportSelectedFieldId = settings.lastReportSelectedFieldId || null;
    state.communitySelectedPostId = settings.lastCommunitySelectedPostId || null;
}


// --- RENDER FUNCTIONS ---

/**
 * Generates a descriptive analysis and recommendations for a single field using the Gemini AI.
 * Implements a caching mechanism to avoid repeated API calls.
 * @param {object} field - The field data object.
 * @param {string} lang - The current language ('en' or 'ar').
 * @returns {Promise<string>} A promise that resolves to the AI-generated text or a specific error message.
 */
async function getAIFieldAnalysis(field, lang) {
    const t = translations[lang];
    const cacheKey = `${field.id}-${lang}-${state.currentUser.preferredUnits}`;
    const cachedItem = state.aiAnalysisCache[cacheKey];
    const CACHE_DURATION_MS = 3600 * 1000; // 1 hour cache validity

    // Return cached data if it's fresh
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION_MS)) {
        return cachedItem.analysis;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const language = lang === 'ar' ? 'Arabic' : 'English';
    const cropAge = calculateCropAge(field.plantingDate);

    const prompt = `
        You are an expert agricultural AI assistant named "Agri-Optimize".
        Your goal is to provide a concise, insightful analysis of a farm field's current status and offer actionable advice to the farmer.
        Analyze the provided data and generate a descriptive summary in 1-2 well-structured paragraphs.
        - Start with a general assessment of the field's health, considering its age.
        - Mention any potential issues or positive trends based on the data history (NDVI, moisture, yield).
        - Provide one or two clear, actionable recommendations relevant to the crop's current growth stage.
        - Use markdown to **bold** key terms, metrics, and recommendations for better readability.
        - Your tone should be helpful, professional, and encouraging.
        - IMPORTANT: Respond exclusively in ${language}.

        Field Data:
        - Field Name: ${field.name}
        - Crop Type: ${field.crop}
        - Crop Age: ${cropAge} days
        - Size: ${displaySize(field.size)}
        - Current NDVI (Plant Health): ${field.ndvi.toFixed(2)}. (Recent 7 readings: ${field.ndviHistory.join(', ')})
        - Current Soil Moisture: ${field.moistureHistory[field.moistureHistory.length - 1]}%. (Recent 7 readings: ${field.moistureHistory.join(', ')})
        - NPK Levels (Nitrogen, Phosphorus, Potassium): N: ${field.npkLevels[0]}, P: ${field.npkLevels[1]}, K: ${field.npkLevels[2]}
        - Current Weather: ${displayTemp(field.weather.current.temp)}, ${field.weather.current.condition}
        - Weather Forecast (next 3 days): ${field.weather.forecast.map(f => `${f.day}: ${displayTemp(f.temp)}`).join(', ')}
        - Yield History (Recent 7 readings): ${field.yieldHistory.join(', ')}

        Now, provide your analysis.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const analysisText = response.text;
        
        // Cache the successful response
        state.aiAnalysisCache[cacheKey] = {
            analysis: analysisText,
            timestamp: Date.now()
        };
        return analysisText;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        
        const errorMessage = error.toString();
        // Handle rate limiting specifically
        if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
            const userFriendlyError = lang === 'ar' 
                ? "خدمة التحليل الذكي غير متاحة مؤقتًا بسبب كثرة الطلبات. يرجى المحاولة مرة أخرى لاحقًا."
                : "The AI analysis service is temporarily unavailable due to high demand. Please try again later.";
            
            // Return a prefixed error message for the UI to handle
            return `RATE_LIMIT_ERROR:${userFriendlyError}`;
        }

        // For all other errors, throw to be caught by the caller
        throw new Error("Failed to generate AI analysis.");
    }
}

/**
 * Simulates analyzing satellite imagery for a given boundary to validate if it's agricultural land.
 * @param {any[]} boundary - An array of [lat, lng] coordinates.
 * @param {string} lang - The current language ('en' or 'ar').
 * @returns {Promise<string>} A promise resolving to "VALID", "INVALID: [reason]", "RATE_LIMIT_ERROR", or "API_ERROR".
 */
async function getAILandValidation(boundary: any[], lang: string): Promise<string> {
    // Simulate different land types based on the center of the drawn polygon.
    // This is a stand-in for actual image analysis.
    const centerLat = boundary.reduce((sum, p) => sum + p[0], 0) / boundary.length;
    const centerLng = boundary.reduce((sum, p) => sum + p[1], 0) / boundary.length;

    let simulatedLandType: string;
    // Giza Pyramids Plateau (unfarmable)
    if (centerLat > 29.974 && centerLat < 29.980 && centerLng > 31.130 && centerLng < 31.137) {
        simulatedLandType = "a sandy, arid plateau with historical structures";
    }
    // Nile River (unfarmable)
    else if (centerLat > 29.99 && centerLat < 30.05 && centerLng > 31.23 && centerLng < 31.24) {
        simulatedLandType = "a wide body of water, appearing to be the Nile River";
    }
    // New Cairo (urban, unfarmable)
    else if (centerLat > 30.02 && centerLat < 30.06 && centerLng > 31.45 && centerLng < 31.50) {
        simulatedLandType = "a dense urban area with buildings, roads, and infrastructure";
    }
    // Typical Nile Delta farmland (valid)
    else {
        simulatedLandType = "a lush green agricultural field with visible crop rows";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const language = lang === 'ar' ? 'Arabic' : 'English';

    const prompt = `
        You are a satellite imagery analysis AI for an agricultural application.
        The system has analyzed a plot of land in Egypt and described it as follows: "${simulatedLandType}".

        Based ONLY on this description, is this a valid, active agricultural area suitable for farming?
        - If yes, respond ONLY with the word "VALID".
        - If no, respond with "INVALID" followed by a colon and a very brief reason. The reason must be in ${language}.
        Example responses: "VALID", "INVALID: The area is a body of water.", "INVALID: The area contains buildings and roads."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini AI Land Validation Failed:", error);
        const errorMessage = error.toString();
        if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
            return "RATE_LIMIT_ERROR";
        }
        return "API_ERROR";
    }
}


function getAIRecommendations(field) {
    const t = translations[state.lang];
    const { weather, moistureHistory, npkLevels } = field;
    const recommendations = [];
    
    // Get full analytics data, including irrigation and yield prediction
    const analyticsData = getWaterAndFootprintData(field);

    // --- 1. Irrigation Recommendation ---
    const latestMoisture = moistureHistory[moistureHistory.length - 1];
    const temp = weather.current.temp;
    const nextRain = weather.forecast.find(day => (day.precipitation || 0) > 30 || day.icon === '🌧️');

    if (latestMoisture < 35 && !nextRain) {
        recommendations.push({ 
            title: '❗ Critical Irrigation Alert', 
            text: `Soil moisture is critically low (${latestMoisture}%) with no significant rain expected. Immediate irrigation is required to prevent crop stress. Apply ${analyticsData.nextIrrigationAmount} L/m².`, 
            type: 'critical' 
        });
    } else if (analyticsData.daysUntilNextIrrigation <= 2) {
        recommendations.push({ 
            title: '💧 Irrigation Advisory', 
            text: `Irrigation is scheduled for ${analyticsData.nextIrrigationDate}. High temperatures (${displayTemp(temp)}) are increasing evaporation. Irrigate early in the morning to minimize water loss.`, 
            type: 'info' 
        });
    } else if (nextRain) {
        recommendations.push({ 
            title: '💧 Irrigation Plan', 
            text: `Rain is expected on ${nextRain.day}. The system has automatically postponed irrigation to conserve water. Monitor moisture levels after the rain.`, 
            type: 'info' 
        });
    } else if (latestMoisture > 70) {
        recommendations.push({
            title: '💧 Soil Saturated',
            text: `Soil moisture is high (${latestMoisture}%). No irrigation needed. Overwatering can lead to root issues.`,
            type: 'info'
        });
    }

    // --- 2. Fertilizer Recommendation (Premium) ---
    if (state.currentUser.plan !== 'Free' && npkLevels) {
        const [n, p, k] = npkLevels;
        const rainForecast = field.weather.forecast.find(f => (f.precipitation || 0) > 20 || f.icon === '🌧️');
        const rainMessage = rainForecast ? `With rain expected on ${rainForecast.day}, it's an ideal time for application to improve nutrient absorption.` : 'Apply before your next scheduled irrigation cycle.';
        
        const deficiencies = [
            { name: 'Nitrogen', symbol: 'N', value: n, threshold: 70, benefit: 'leafy growth', fertilizer: 'Urea (46-0-0)' },
            { name: 'Phosphorus', symbol: 'P', value: p, threshold: 60, benefit: 'root development and flowering', fertilizer: 'DAP (18-46-0)' },
            { name: 'Potassium', symbol: 'K', value: k, threshold: 65, benefit: 'fruit quality and disease resistance', fertilizer: 'Potassium Sulfate (0-0-50)' }
        ].filter(nutrient => nutrient.value < nutrient.threshold)
         .sort((a, b) => (a.value / a.threshold) - (b.value / b.threshold)); // Sort by severity

        if (deficiencies.length > 0) {
            const mostDeficient = deficiencies[0];
            let fertilizerText = `Analysis indicates your ${mostDeficient.name} (${mostDeficient.symbol}) level is low at ${mostDeficient.value}. To improve ${mostDeficient.benefit}, an application of ${mostDeficient.fertilizer} is recommended. ${rainMessage}`;
            recommendations.push({ title: t.fertilizerAlertTitle, text: fertilizerText, type: 'warning' });
        }
    }
    
    const hasActionableAlerts = recommendations.some(rec => rec.type === 'critical' || rec.type === 'warning');

    // --- 3. Harvest Prediction ---
    const isTrendingUp = field.yieldHistory.length > 2 && analyticsData.predictedYield > field.yieldHistory[field.yieldHistory.length - 3];
    const sizeUnit = state.currentUser.preferredUnits === 'imperial' ? t.fieldDetails.acresUnit : t.fieldDetails.feddanUnit;
    
    let harvestText;
    if(isTrendingUp) {
        harvestText = `Yield potential is trending positively. ` + t.harvestPredictionText
            .replace('{yield}', `<strong>${analyticsData.predictedYield.toFixed(2)}</strong>`)
            .replace('{unit}', sizeUnit);
    } else {
        harvestText = `Yield potential is stable. ` + t.harvestPredictionText
            .replace('{yield}', `<strong>${analyticsData.predictedYield.toFixed(2)}</strong>`)
            .replace('{unit}', sizeUnit);
    }
    recommendations.push({ title: t.harvestPredictionTitle, text: harvestText, type: 'success' });
    
    // If no actionable recommendations, add a success message.
    if (!hasActionableAlerts) {
        recommendations.unshift({
            title: '✅ All Systems Green',
            text: 'Your field is in optimal condition. Continue with your current management plan and monitor daily.',
            type: 'success'
        });
    }

    return recommendations;
}


function generateCriticalAlertsForField(field) {
    const t = translations[state.lang].alertMessages;
    const alerts = [];
    const units = state.currentUser.preferredUnits || 'metric';

    // Configurable thresholds
    const alertThresholds = {
        ndviDropPercent: 15,
        ndviIncreasePercent: 20,
        lowMoisture: 35,
        highMoisture: 75,
        heatWaveTempC: 38,
        diseaseMinTempC: 25,
        diseaseMaxTempC: 35
    };
    const heatWaveTemp = units === 'metric' ? alertThresholds.heatWaveTempC : celsiusToFahrenheit(alertThresholds.heatWaveTempC);

    // 1. Check for significant NDVI changes (drop or increase)
    if (field.ndviHistory && field.ndviHistory.length >= 2) {
        const last = field.ndviHistory[field.ndviHistory.length - 1];
        const secondLast = field.ndviHistory[field.ndviHistory.length - 2];
        const change = ((last - secondLast) / secondLast) * 100;

        if (change < -alertThresholds.ndviDropPercent) {
            alerts.push({
                type: 'ndvi_drop',
                severity: 'critical',
                icon: '📉',
                message: t.ndviDrop.replace('{percentage}', Math.abs(change).toFixed(0))
            });
        } else if (change > alertThresholds.ndviIncreasePercent) {
             alerts.push({
                type: 'ndvi_increase',
                severity: 'warning',
                icon: '📈',
                message: t.ndviIncrease.replace('{percentage}', change.toFixed(0))
            });
        }
    }

    // 2. Check for prolonged low soil moisture (Irrigation Need)
    if (field.moistureHistory && field.moistureHistory.length >= 3) {
        const recentMoisture = field.moistureHistory.slice(-3);
        const isDry = recentMoisture.every(m => m < alertThresholds.lowMoisture);
        const noRainExpected = field.weather.forecast.every(day => (day.precipitation || 0) < 20);

        if (isDry && noRainExpected) {
            alerts.push({
                type: 'moisture',
                severity: 'warning',
                icon: '💧',
                message: t.lowMoisture
            });
        }
    }

    // 3. Check for heat stress
    const isHeatWave = (field.weather.current.temp > alertThresholds.heatWaveTempC) && 
                      field.weather.forecast.slice(0, 2).every(day => day.temp > alertThresholds.heatWaveTempC);
    if (isHeatWave) {
        alerts.push({
            type: 'heat_stress',
            severity: 'critical',
            icon: '🔥',
            message: t.heatStress.replace('{temp}', displayTemp(alertThresholds.heatWaveTempC))
        });
    }

    // 4. Check for disease risk (fungal)
    if (field.moistureHistory && field.moistureHistory.length >= 3) {
        const recentMoisture = field.moistureHistory.slice(-3);
        const isHumid = recentMoisture.every(m => m > alertThresholds.highMoisture);
        const tempC = field.weather.current.temp;
        const isWarm = tempC > alertThresholds.diseaseMinTempC && tempC < alertThresholds.diseaseMaxTempC;

        if (isHumid && isWarm) {
            alerts.push({
                type: 'disease_risk',
                severity: 'warning',
                icon: '🍄',
                message: t.diseaseRisk
            });
        }
    }
    
    // 5. Check for scheduled irrigation
    const waterData = getWaterAndFootprintData(field);
    if (waterData.daysUntilNextIrrigation <= 1) {
        const dueDate = waterData.daysUntilNextIrrigation === 0 ? 'Today' : 'Tomorrow';
        alerts.push({
            type: 'irrigation',
            severity: 'warning',
            icon: '📅',
            message: t.irrigationAlert
                .replace('{crop}', field.crop)
                .replace('{dueDate}', dueDate)
                .replace('{amount}', waterData.nextIrrigationAmount.toString())
        });
    }


    return alerts;
}

function renderFieldAlerts(alerts) {
    if (alerts.length === 0) {
        return '';
    }
    const t = translations[state.lang];
    
    /**
     * Helper to convert markdown-style bolding to HTML `<strong>` tags.
     * @param {string} text The text to format.
     * @returns {string} The HTML formatted text.
     */
    const formatMessage = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    };

    const severities = {
        critical: {
            title: t.criticalAlerts,
            containerClasses: 'bg-red-100 border-red-500 text-red-800',
            iconClasses: 'text-red-500',
        },
        warning: {
            title: t.warningsTitle,
            containerClasses: 'bg-yellow-100 border-yellow-500 text-yellow-800',
            iconClasses: 'text-yellow-500',
        }
    };
    
    const icons = {
        ndvi_drop: 'M13 17h8m-8-4h5m-5-4h2', // Trend down
        ndvi_increase: 'M13 7h8m-8 4h5m-5 4h2', // Trend up
        moisture: 'M12 2.69l-5.66 5.66a8 8 0 1011.31 0z', // Drop
        heat_stress: 'M17.66 17.66A8 8 0 016.34 6.34', // Sun
        disease_risk: 'M12 15v2m-3-3v3m6-3v3M4 11a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z' // Fungi-like
    };

    const groupedAlerts = alerts.reduce((acc, alert) => {
        const severity = alert.severity || 'warning';
        if (!acc[severity]) {
            acc[severity] = [];
        }
        acc[severity].push(alert);
        return acc;
    }, {});
    
    const severityOrder = ['critical', 'warning'];
    
    return severityOrder.map(severity => {
        const alertGroup = groupedAlerts[severity];
        if (!alertGroup || alertGroup.length === 0) return '';
        
        const styles = severities[severity];
        if (!styles) return '';

        return `
            <div class="${styles.containerClasses} border-l-4 p-4 rounded-md shadow-sm mt-6" role="alert">
                <h4 class="font-bold text-lg mb-2">${styles.title}</h4>
                <ul class="space-y-2">
                    ${alertGroup.map(alert => {
                        const iconPath = icons[alert.type] || 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
                        return `
                            <li class="flex items-start">
                                <div class="flex-shrink-0 w-6 h-6 text-2xl text-center leading-6">${alert.icon || '⚠️'}</div>
                                <span class="ml-2 rtl:mr-2 rtl:ml-0">${formatMessage(alert.message)}</span>
                            </li>
                        `
                    }).join('')}
                </ul>
            </div>
        `;
    }).join('');
}


function renderDashboard() {
    const dashboardView = document.getElementById('dashboard-view');
    const isPremium = state.currentUser.plan !== 'Free';
    const t = translations[state.lang];
    const firstField = state.currentUser.fields[0];
    
    const aiRecommendations = firstField ? getAIRecommendations(firstField) : [];

    dashboardView.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column: Map and Fields -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Map Card -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-semibold">${t.myFieldsOverview}</h3>
                        <button id="refresh-dashboard-btn" class="px-4 py-2 text-sm font-medium text-green-700 bg-white border border-green-700 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-wait flex items-center" ${state.isRefreshing ? 'disabled' : ''}>
                            <svg class="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${state.isRefreshing ? 'animate-spin' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" />
                            </svg>
                            <span>${state.isRefreshing ? t.refreshing : t.refreshData}</span>
                        </button>
                    </div>
                     <div id="dashboard-map-container" class="bg-gray-200 h-96 rounded-md"></div>
                </div>
                <!-- Data Visualization -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${firstField ? renderStatCard('🌿', t.ndviHealth, firstField.ndvi.toFixed(2), t.tooltips.ndvi) : renderStatCard('🌿', t.ndviHealth, 'N/A', t.tooltips.ndvi)}
                    ${firstField ? renderStatCard('💧', t.soilMoisture, `${firstField.moistureHistory[firstField.moistureHistory.length - 1]}%`, t.tooltips.soilMoisture) : renderStatCard('💧', t.soilMoisture, 'N/A', t.tooltips.soilMoisture)}
                    ${isPremium ? (firstField ? renderStatCard('🧪', t.npkLevels, `N:${firstField.npkLevels[0]} P:${firstField.npkLevels[1]} K:${firstField.npkLevels[2]}`, t.tooltips.npk) : renderStatCard('🧪', t.npkLevels, 'N/A', t.tooltips.npk)) : renderDisabledStatCard(t.npkLevels, t.tooltips.npk, '🧪')}
                    ${isPremium ? (firstField ? renderStatCard('🔥', t.heatStress, displayTemp(firstField.weather.current.temp), t.tooltips.heatStress) : renderStatCard('🔥', t.heatStress, 'N/A', t.tooltips.heatStress)) : renderDisabledStatCard(t.heatStress, t.tooltips.heatStress, '🔥')}
                </div>
            </div>
            <!-- Right Column: AI & Weather -->
            <div class="space-y-6">
                <!-- AI Recommendations -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4 text-green-700">${t.aiRecommendations}</h3>
                    <div class="space-y-4">
                        ${aiRecommendations.map(rec => renderRecommendation(rec.title, rec.text, rec.type)).join('')}
                    </div>
                </div>
                <!-- Weather -->
                ${firstField ? renderWeatherWidget(firstField.weather, t.weatherForecast) : ''}
            </div>
        </div>
    `;
    // Render charts and add event listeners after the elements are in the DOM
    setTimeout(() => {
        renderDashboardMap();
        // Chart rendering removed from dashboard
        document.getElementById('refresh-dashboard-btn')?.addEventListener('click', handleRefreshData);
    }, 0);
}


function renderDashboardMap() {
    const mapContainer = document.getElementById('dashboard-map-container');
    if (!mapContainer) return;
    const t = translations[state.lang];

    if (dashboardMapInstance) {
        dashboardMapInstance.remove();
        dashboardMapInstance = null;
    }

    const fieldsWithBoundaries = state.currentUser.fields.filter(f => f.boundary && f.boundary.length > 0);

    if (fieldsWithBoundaries.length === 0) {
        mapContainer.innerHTML = `<div class="flex items-center justify-center h-full"><p class="text-gray-500">${t.noFieldsOnMap}</p></div>`;
        return;
    }

    requestAnimationFrame(() => {
        const currentContainer = document.getElementById('dashboard-map-container');
        if (!currentContainer) return;

        try {
            dashboardMapInstance = L.map(currentContainer);

            // Create a pane for labels to ensure they appear on top of polygons
            dashboardMapInstance.createPane('labels');
            dashboardMapInstance.getPane('labels').style.zIndex = 650;
            dashboardMapInstance.getPane('labels').style.pointerEvents = 'none';

            // Satellite Layer (base layer)
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(dashboardMapInstance);

            // Labels Layer on the new pane
            L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Labels &copy; Esri',
                pane: 'labels'
            }).addTo(dashboardMapInstance);

            const fieldPolygons = fieldsWithBoundaries.map(field => {
                return L.polygon(field.boundary, { color: '#2E7D32', weight: 2 });
            });

            if (fieldPolygons.length > 0) {
                const featureGroup = L.featureGroup(fieldPolygons).addTo(dashboardMapInstance);
                dashboardMapInstance.fitBounds(featureGroup.getBounds().pad(0.1));
            } else {
                 // Fallback if no valid polygons were created
                dashboardMapInstance.setView([26.8206, 30.8025], 6); // Center of Egypt
            }

        } catch (e) {
            console.error("Error initializing dashboard map:", e);
            currentContainer.innerHTML = `<p class="p-4 text-center text-red-500">${t.mapLoadError}</p>`;
        }
    });
}

function renderFieldMap(field: any, mapContainerId: string) {
    const mapContainer = document.getElementById(mapContainerId);
    if (!mapContainer) return;

    if (fieldMapInstance) {
        try {
            fieldMapInstance.remove();
        } catch(e) {
            // Ignore errors if map was already removed
        }
        fieldMapInstance = null;
    }
    
    requestAnimationFrame(() => {
        const currentContainer = document.getElementById(mapContainerId);
        if (!currentContainer) {
            return;
        }

        try {
            fieldMapInstance = L.map(currentContainer).setView(field.location, 16);
            
            fieldMapInstance.createPane('labels');
            fieldMapInstance.getPane('labels').style.zIndex = 650;
            fieldMapInstance.getPane('labels').style.pointerEvents = 'none';

            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(fieldMapInstance);
            
            L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Labels &copy; Esri',
                pane: 'labels'
            }).addTo(fieldMapInstance);

            if (field.boundary && field.boundary.length > 0) {
                const polygon = L.polygon(field.boundary, { color: '#2E7D32', weight: 2 }).addTo(fieldMapInstance);
                fieldMapInstance.fitBounds(polygon.getBounds().pad(0.1));
            }
        } catch (e) {
            console.error("Error initializing field map:", e);
            const t = translations[state.lang];
            currentContainer.innerHTML = `<p class="p-4 text-center text-red-500">${t.mapLoadError}</p>`;
        }
    });
}

function getNdviStatus(ndvi) {
    const t = translations[state.lang];
    if (ndvi >= 0.7) {
        return { status: t.healthy, color: 'bg-green-500', textClass: 'text-green-700' };
    } else if (ndvi >= 0.4) {
        return { status: t.moderate, color: 'bg-yellow-500', textClass: 'text-yellow-700' };
    } else {
        return { status: t.poor, color: 'bg-red-500', textClass: 'text-red-700' };
    }
}

function renderFieldCharts(field) {
    const t = translations[state.lang];
    const isPremium = state.currentUser.plan === 'Premium';
    const analyticsData = getWaterAndFootprintData(field);

    renderLineChart('field-ndvi-chart', 'NDVI Index', field.ndviHistory);
    renderLineChart('field-soil-moisture-chart', 'Moisture (%)', field.moistureHistory);
    renderLineChart('field-yield-chart', 'Yield (tons/feddan)', field.yieldHistory, 'blue');

    if (isPremium) {
        if (field.npkLevels) renderBarChart('field-npk-chart', ['N', 'P', 'K'], field.npkLevels);
        if (field.eviHistory) renderLineChart('field-evi-chart', 'EVI', field.eviHistory, 'purple');
        if (field.gciHistory) renderLineChart('field-gci-chart', 'GCI', field.gciHistory, 'teal');
        if (field.ndreHistory) renderLineChart('field-ndre-chart', 'NDRE', field.ndreHistory, 'orange');
        if (field.gndviHistory) renderLineChart('field-gndvi-chart', 'GNDVI', field.gndviHistory, 'lime');
        if (field.ndwiHistory) renderLineChart('field-ndwi-chart', 'NDWI', field.ndwiHistory, 'cyan');
        if (field.msiHistory) renderLineChart('field-msi-chart', 'MSI', field.msiHistory, 'brown');
    }
}


function renderFields() {
    const fieldsView = document.getElementById('fields-view');
    const { fields } = state.currentUser;
    const t = translations[state.lang];
    const isPremium = state.currentUser.plan !== 'Free';

    if (!fields || fields.length === 0) {
        fieldsView.innerHTML = `<div class="text-center p-8 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold">${t.noFieldsFound}</h3>
            <p class="text-gray-500 mt-2">${t.addFirstFieldPrompt}</p>
            <button id="add-field-btn-empty" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">${t.addNewField}</button>
        </div>`;
        document.getElementById('add-field-btn-empty')?.addEventListener('click', showAddFieldModal);
        return;
    }

    // If no field is selected or selected field doesn't exist, default to the first one
    if (state.selectedFieldId === null || !fields.some(f => f.id === state.selectedFieldId)) {
        state.selectedFieldId = fields.length > 0 ? fields[0].id : null;
    }

    const selectedField = fields.find(f => f.id === state.selectedFieldId);

    const fieldsListHtml = fields.map(field => {
        const { status, color } = getNdviStatus(field.ndvi);
        return `
        <li data-field-id="${field.id}" class="field-item p-4 border-b cursor-pointer hover:bg-gray-50 ${field.id === state.selectedFieldId ? 'selected-field' : ''}">
            <div class="flex items-center justify-between">
                <h4 class="font-semibold">${field.name}</h4>
                <span class="health-indicator ${color}" title="${status}"></span>
            </div>
            <p class="text-sm text-gray-500">${field.crop} - ${displaySize(field.size)}</p>
        </li>
    `}).join('');

    let locationText = '';
    if (selectedField) {
         if (typeof selectedField.location === 'string') {
            locationText = selectedField.location;
        } else if (selectedField.location && typeof selectedField.location.lat === 'number') {
            locationText = `Lat: ${selectedField.location.lat.toFixed(5)}, Lon: ${selectedField.location.lng.toFixed(5)}`;
        }
    }

    let selectedFieldDetailsHtml = `<div class="text-center p-8 bg-white rounded-lg shadow-md"><h3 class="text-xl font-semibold">${t.noFieldsToDisplay}</h3></div>`;

    if (selectedField) {
        const { status, color, textClass } = getNdviStatus(selectedField.ndvi);
        const fieldAlerts = generateCriticalAlertsForField(selectedField);
        
        // Check for critical alerts and simulate sending an email
        for (const alert of fieldAlerts) {
            if (alert.severity === 'critical') {
                const alertKey = `${selectedField.id}-${alert.type}`;
                if (!state.sentAlerts.includes(alertKey)) {
                    sendEmailAlert(state.currentUser, selectedField, alert);
                    state.sentAlerts.push(alertKey);
                }
            }
        }
        
        const currentMoisture = selectedField.moistureHistory[selectedField.moistureHistory.length - 1];
        const cropAge = calculateCropAge(selectedField.plantingDate);
        const waterData = getWaterAndFootprintData(selectedField);
        const soilTextureKey = getSoilTexture(selectedField);
        const soilHealthData = getSoilHealthScore(selectedField);


        selectedFieldDetailsHtml = `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-2xl font-bold text-green-800">${selectedField.name}</h3>
                        <div class="mt-2 flex items-center">
                            <span class="health-indicator ${color} mr-2 rtl:ml-2 rtl:mr-0"></span>
                            <span class="font-semibold ${textClass}">${t.healthStatus}: ${status}</span>
                        </div>
                        <div class="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-gray-600">
                            <span><strong>${t.fieldDetails.crop}:</strong> ${selectedField.crop}</span>
                            <span><strong>${t.fieldDetails.size}:</strong> ${displaySize(selectedField.size)}</span>
                            <span><strong>${t.fieldDetails.location}:</strong> ${locationText}</span>
                            <span><strong>${t.fieldDetails.irrigation}:</strong> ${selectedField.irrigation}</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 flex-shrink-0">
                         <button id="edit-field-btn" class="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">${t.editField}</button>
                         <button id="delete-field-btn" class="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">${t.deleteField}</button>
                    </div>
                </div>
                ${renderFieldAlerts(fieldAlerts)}
            </div>
             <details class="bg-white rounded-lg shadow-md overflow-hidden" open>
                <summary class="p-6 cursor-pointer text-xl font-semibold text-green-700">${t.healthStatus} & Vigor</summary>
                <div class="p-6 pt-0">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${renderChartCard(t.ndviHealth, 'field-ndvi-chart', t.tooltips.ndvi, selectedField.ndvi, 'ndvi')}
                        ${isPremium ? renderChartCard(t.gndvi, 'field-gndvi-chart', t.tooltips.gndvi, selectedField.gndvi, 'gndvi') : renderDisabledCard(t.gndvi, t.tooltips.gndvi)}
                        ${isPremium ? renderChartCard(t.evi, 'field-evi-chart', t.tooltips.evi, selectedField.evi, 'evi') : renderDisabledCard(t.evi, t.tooltips.evi)}
                        ${isPremium ? renderChartCard(t.gci, 'field-gci-chart', t.tooltips.gci, selectedField.gci, 'gci') : renderDisabledCard(t.gci, t.tooltips.gci)}
                        ${isPremium ? renderChartCard(t.ndre, 'field-ndre-chart', t.tooltips.ndre, selectedField.ndre, 'ndre') : renderDisabledCard(t.ndre, t.tooltips.ndre)}
                        <div class="bg-white p-6 rounded-lg shadow-inner md:col-span-2">
                            <h3 class="text-xl font-semibold mb-4 text-green-700">${t.aiFieldAnalysis}</h3>
                            <div id="ai-field-analysis-content" class="min-h-[100px]">
                                <div class="flex flex-col items-center justify-center text-gray-500">
                                    <div class="loader-spinner-small"></div>
                                    <span class="mt-2">${t.analyzingData}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
             <details class="bg-white rounded-lg shadow-md overflow-hidden" open>
                <summary class="p-6 cursor-pointer text-xl font-semibold text-green-700">${t.waterManagement}</summary>
                <div class="p-6 pt-0">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div class="md:col-span-3 lg:col-span-3">
                            ${renderWeatherWidget(selectedField.weather)}
                         </div>

                        <div class="col-span-full p-4 rounded-lg shadow-inner ${soilHealthData.colorClass}">
                            <p class="text-sm font-semibold text-center">${t.soilHealthScore}</p>
                            <div class="flex items-baseline justify-center text-center mt-1">
                                <p class="text-4xl font-bold">${soilHealthData.score}</p>
                                <p class="text-lg ml-1 rtl:mr-1 rtl:ml-0">/ 10</p>
                            </div>
                            <p class="text-center font-medium">${soilHealthData.rating}</p>
                        </div>

                        ${renderChartCard(t.soilMoisture, 'field-soil-moisture-chart', t.tooltips.soilMoisture, currentMoisture, 'soilMoisture')}
                        ${isPremium ? renderChartCard(t.ndwi, 'field-ndwi-chart', t.tooltips.ndwi, selectedField.ndwi, 'ndwi') : renderDisabledCard(t.ndwi, t.tooltips.ndwi)}
                        ${isPremium ? renderChartCard(t.msi, 'field-msi-chart', t.tooltips.msi, selectedField.msi, 'msi') : renderDisabledCard(t.msi, t.tooltips.msi)}
                        ${isPremium ? renderChartCard(t.npkLevels, 'field-npk-chart', t.tooltips.npk) : renderDisabledCard(t.npkLevels, t.tooltips.npk)}
                        <div class="bg-green-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.nextIrrigation}</p>
                            <p class="text-2xl font-bold text-blue-700">
                                ${waterData.nextIrrigationDate}
                            </p>
                             <span class="text-sm font-medium text-gray-700">~${waterData.nextIrrigationAmount} L/m²</span>
                        </div>
                         <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.cropAge}</p>
                            <p class="text-2xl font-bold">${cropAge} <span class="text-base font-normal">${t.days}</span></p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.soilTexture}</p>
                            <p class="text-xl font-bold">${t.soilTypes[soilTextureKey]}</p>
                        </div>
                         <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.waterSaved}</p>
                            <p class="text-xl font-bold">${(selectedField.waterSaved / 1000).toFixed(1)} <span class="text-base font-normal">m³</span></p>
                        </div>
                         <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.carbonFootprint}</p>
                            <p class="text-xl font-bold">${selectedField.carbonSaved.toFixed(0)} <span class="text-base font-normal">kg CO₂e</span></p>
                        </div>
                    </div>
                </div>
            </details>
             <details class="bg-white rounded-lg shadow-md overflow-hidden" open>
                <summary class="p-6 cursor-pointer text-xl font-semibold text-green-700">Yield & Location</summary>
                <div class="p-6 pt-0">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${renderChartCard(t.cropYieldPotential, 'field-yield-chart', t.tooltips.cropYield, waterData.predictedYield)}
                        <div class="bg-white p-4 rounded-lg shadow-inner">
                            <h4 class="font-semibold text-gray-800 mb-2">${t.fieldLocation}</h4>
                            <div id="field-location-map" class="bg-gray-200 h-64 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </details>
        `;
    }

    fieldsView.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Field List -->
            <div class="lg:col-span-1 bg-white rounded-lg shadow-md">
                <div class="p-4 border-b flex justify-between items-center">
                    <h3 class="text-xl font-semibold">${t.myFields}</h3>
                     <button id="refresh-fields-btn" class="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-700 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-wait flex items-center" ${state.isRefreshing ? 'disabled' : ''}>
                        <svg class="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${state.isRefreshing ? 'animate-spin' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" />
                        </svg>
                        <span>${state.isRefreshing ? t.refreshing : t.refreshData}</span>
                    </button>
                </div>
                <ul id="field-list" class="max-h-[70vh] overflow-y-auto">
                    ${fieldsListHtml}
                </ul>
                <div class="p-4 border-t">
                    <div class="mb-4">
                        <h4 class="text-sm font-semibold text-gray-600 mb-2">${t.healthLegend}</h4>
                        <div class="space-y-1 text-xs text-gray-600">
                            <div class="legend-item"><span class="health-indicator bg-green-500"></span> ${t.healthy} (NDVI &ge; 0.7)</div>
                            <div class="legend-item"><span class="health-indicator bg-yellow-500"></span> ${t.moderate} (0.4 &ndash; 0.7)</div>
                            <div class="legend-item"><span class="health-indicator bg-red-500"></span> ${t.poor} (NDVI &lt; 0.4)</div>
                        </div>
                    </div>
                    <button id="add-field-btn" class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">${t.addNewField}</button>
                </div>
            </div>

            <!-- Field Details -->
            <div id="field-detail-content" class="lg:col-span-2 space-y-6">
                ${selectedFieldDetailsHtml}
            </div>
        </div>
    `;
    
    // Render charts and map for the selected field
    if (selectedField) {
        renderFieldMap(selectedField, 'field-location-map');
        setTimeout(() => {
            renderFieldCharts(selectedField);
            
            // Trigger AI Analysis with debouncing
            const analysisContent = document.getElementById('ai-field-analysis-content');
            if (analysisContent) {
                // Clear any pending analysis request from a previous selection
                if (aiAnalysisDebounceTimer) {
                    clearTimeout(aiAnalysisDebounceTimer);
                }
                
                // The loading spinner is already in the HTML from the main render pass.
                // We set a timer to fetch the analysis. If the user clicks another field
                // quickly, this timer will be cancelled.
                aiAnalysisDebounceTimer = setTimeout(() => {
                    getAIFieldAnalysis(selectedField, state.lang)
                        .then(analysisText => {
                            // Ensure the response is for the currently selected field, preventing race conditions.
                            const currentSelectedField = state.currentUser.fields.find(f => f.id === state.selectedFieldId);
                            if (currentSelectedField && currentSelectedField.id === selectedField.id) {
                                if (analysisText.startsWith('RATE_LIMIT_ERROR:')) {
                                    const message = analysisText.replace('RATE_LIMIT_ERROR:', '');
                                    analysisContent.innerHTML = `<p class="text-yellow-700 p-4 bg-yellow-100 rounded-md">${message}</p>`;
                                } else {
                                    analysisContent.innerHTML = `<div class="text-gray-700 whitespace-pre-wrap">${markdownToHtml(analysisText)}</div>`;
                                }
                            }
                        })
                        .catch(error => {
                            console.error("AI Analysis Error:", error);
                            const currentSelectedField = state.currentUser.fields.find(f => f.id === state.selectedFieldId);
                            if (currentSelectedField && currentSelectedField.id === selectedField.id) {
                                analysisContent.innerHTML = `<p class="text-red-500">${t.aiError}</p>`;
                            }
                        });
                }, 500); // Debounce for 500ms
            }
        }, 0);
    }
    
    // Add event listeners
    document.getElementById('field-list')?.querySelectorAll('.field-item').forEach(item => {
        item.addEventListener('click', handleFieldSelect);
    });
    document.getElementById('add-field-btn')?.addEventListener('click', showAddFieldModal);
    document.getElementById('edit-field-btn')?.addEventListener('click', handleEditField);
    document.getElementById('delete-field-btn')?.addEventListener('click', handleDeleteField);
    document.getElementById('refresh-fields-btn')?.addEventListener('click', handleRefreshData);
}

function renderFieldReportDetail(field) {
    if (!field) return '';

    const t = translations[state.lang];
    const isPremium = state.currentUser.plan !== 'Free';
    const { status, color, textClass } = getNdviStatus(field.ndvi);
    const fieldAlerts = generateCriticalAlertsForField(field);
    const currentMoisture = field.moistureHistory[field.moistureHistory.length - 1];
    const cropAge = calculateCropAge(field.plantingDate);
    const waterData = getWaterAndFootprintData(field);
    const soilTextureKey = getSoilTexture(field);
    const soilHealthData = getSoilHealthScore(field);

    let locationText = '';
    if (typeof field.location === 'string') {
        locationText = field.location;
    } else if (field.location && typeof field.location.lat === 'number') {
        locationText = `Lat: ${field.location.lat.toFixed(5)}, Lon: ${field.location.lng.toFixed(5)}`;
    }

    return `
        <div id="printable-report-area" class="space-y-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-2xl font-bold text-green-800">${field.name}</h3>
                        <div class="mt-2 flex items-center">
                            <span class="health-indicator ${color} mr-2 rtl:ml-2 rtl:mr-0"></span>
                            <span class="font-semibold ${textClass}">${t.healthStatus}: ${status}</span>
                        </div>
                        <div class="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-gray-600">
                            <span><strong>${t.fieldDetails.crop}:</strong> ${field.crop}</span>
                            <span><strong>${t.fieldDetails.size}:</strong> ${displaySize(field.size)}</span>
                            <span><strong>${t.fieldDetails.location}:</strong> ${locationText}</span>
                            <span><strong>${t.fieldDetails.irrigation}:</strong> ${field.irrigation}</span>
                        </div>
                    </div>
                </div>
                ${renderFieldAlerts(fieldAlerts)}
            </div>
             <details class="bg-white rounded-lg shadow-md overflow-hidden" open>
                <summary class="p-6 cursor-pointer text-xl font-semibold text-green-700">${t.healthStatus} & Vigor</summary>
                <div class="p-6 pt-0">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${renderChartCard(t.ndviHealth, 'report-ndvi-chart', t.tooltips.ndvi, field.ndvi, 'ndvi')}
                        ${isPremium ? renderChartCard(t.gndvi, 'report-gndvi-chart', t.tooltips.gndvi, field.gndvi, 'gndvi') : renderDisabledCard(t.gndvi, t.tooltips.gndvi)}
                        ${isPremium ? renderChartCard(t.evi, 'report-evi-chart', t.tooltips.evi, field.evi, 'evi') : renderDisabledCard(t.evi, t.tooltips.evi)}
                        ${isPremium ? renderChartCard(t.gci, 'report-gci-chart', t.tooltips.gci, field.gci, 'gci') : renderDisabledCard(t.gci, t.tooltips.gci)}
                        ${isPremium ? renderChartCard(t.ndre, 'report-ndre-chart', t.tooltips.ndre, field.ndre, 'ndre') : renderDisabledCard(t.ndre, t.tooltips.ndre)}
                        <div class="bg-white p-6 rounded-lg shadow-inner md:col-span-2">
                            <h3 class="text-xl font-semibold mb-4 text-green-700">${t.aiFieldAnalysis}</h3>
                            <div id="report-ai-analysis-content" class="min-h-[100px]">
                                <div class="flex flex-col items-center justify-center text-gray-500">
                                    <div class="loader-spinner-small"></div>
                                    <span class="mt-2">${t.analyzingData}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
             <details class="bg-white rounded-lg shadow-md overflow-hidden" open>
                <summary class="p-6 cursor-pointer text-xl font-semibold text-green-700">${t.waterManagement}</summary>
                <div class="p-6 pt-0">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div class="md:col-span-3 lg:col-span-3">
                            ${renderWeatherWidget(field.weather)}
                         </div>
                        <div class="col-span-full p-4 rounded-lg shadow-inner ${soilHealthData.colorClass}">
                            <p class="text-sm font-semibold text-center">${t.soilHealthScore}</p>
                            <div class="flex items-baseline justify-center text-center mt-1">
                                <p class="text-4xl font-bold">${soilHealthData.score}</p>
                                <p class="text-lg ml-1 rtl:mr-1 rtl:ml-0">/ 10</p>
                            </div>
                            <p class="text-center font-medium">${soilHealthData.rating}</p>
                        </div>
                        ${renderChartCard(t.soilMoisture, 'report-soil-moisture-chart', t.tooltips.soilMoisture, currentMoisture, 'soilMoisture')}
                        ${isPremium ? renderChartCard(t.ndwi, 'report-ndwi-chart', t.tooltips.ndwi, field.ndwi, 'ndwi') : renderDisabledCard(t.ndwi, t.tooltips.ndwi)}
                        ${isPremium ? renderChartCard(t.msi, 'report-msi-chart', t.tooltips.msi, field.msi, 'msi') : renderDisabledCard(t.msi, t.tooltips.msi)}
                        ${isPremium ? renderChartCard(t.npkLevels, 'report-npk-chart', t.tooltips.npk) : renderDisabledCard(t.npkLevels, t.tooltips.npk)}
                        <div class="bg-green-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.nextIrrigation}</p>
                            <p class="text-2xl font-bold text-blue-700">${waterData.nextIrrigationDate}</p>
                             <span class="text-sm font-medium text-gray-700">~${waterData.nextIrrigationAmount} L/m²</span>
                        </div>
                         <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.cropAge}</p>
                            <p class="text-2xl font-bold">${cropAge} <span class="text-base font-normal">${t.days}</span></p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.soilTexture}</p>
                            <p class="text-xl font-bold">${t.soilTypes[soilTextureKey]}</p>
                        </div>
                         <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.waterSaved}</p>
                            <p class="text-xl font-bold">${(field.waterSaved / 1000).toFixed(1)} <span class="text-base font-normal">m³</span></p>
                        </div>
                         <div class="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
                            <p class="text-sm text-gray-600">${t.carbonFootprint}</p>
                            <p class="text-xl font-bold">${field.carbonSaved.toFixed(0)} <span class="text-base font-normal">kg CO₂e</span></p>
                        </div>
                    </div>
                </div>
            </details>
             <details class="bg-white rounded-lg shadow-md overflow-hidden" open>
                <summary class="p-6 cursor-pointer text-xl font-semibold text-green-700">Yield & Location</summary>
                <div class="p-6 pt-0">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${renderChartCard(t.cropYieldPotential, 'report-yield-chart', t.tooltips.cropYield, waterData.predictedYield)}
                        <div class="bg-white p-4 rounded-lg shadow-inner">
                            <h4 class="font-semibold text-gray-800 mb-2">${t.fieldLocation}</h4>
                            <div id="report-location-map" class="bg-gray-200 h-64 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    `;
}


function renderAllReportCharts(field) {
    const t = translations[state.lang];
    const isPremium = state.currentUser.plan === 'Premium';

    renderLineChart('report-ndvi-chart', 'NDVI', field.ndviHistory);
    renderLineChart('report-soil-moisture-chart', 'Moisture', field.moistureHistory);
    renderLineChart('report-yield-chart', 'Yield', field.yieldHistory, 'blue');

    if (isPremium) {
        if (field.npkLevels) renderBarChart('report-npk-chart', ['N', 'P', 'K'], field.npkLevels);
        if (field.eviHistory) renderLineChart('report-evi-chart', 'EVI', field.eviHistory, 'purple');
        if (field.gciHistory) renderLineChart('report-gci-chart', 'GCI', field.gciHistory, 'teal');
        if (field.ndreHistory) renderLineChart('report-ndre-chart', 'NDRE', field.ndreHistory, 'orange');
        if (field.gndviHistory) renderLineChart('report-gndvi-chart', 'GNDVI', field.gndviHistory, 'lime');
        if (field.ndwiHistory) renderLineChart('report-ndwi-chart', 'NDWI', field.ndwiHistory, 'cyan');
        if (field.msiHistory) renderLineChart('report-msi-chart', 'MSI', field.msiHistory, 'brown');
    }
}

function renderReports() {
    const reportsView = document.getElementById('reports-view');
    const { fields } = state.currentUser;
    const t = translations[state.lang];
    const isPremium = state.currentUser.plan !== 'Free';

    // Calculations for overall analytics
    const totalFields = fields.length;
    const totalAcreage = fields.reduce((sum, field) => sum + field.size, 0);
    const totalNdvi = fields.reduce((sum, field) => sum + (field.ndvi || 0), 0);
    const avgNdvi = totalFields > 0 ? (totalNdvi / totalFields).toFixed(2) : 'N/A';
    const totalYield = fields.reduce((sum, field) => sum + (getWaterAndFootprintData(field).predictedYield * field.size), 0);
    
    const selectedField = fields.find(f => f.id === state.reportSelectedFieldId);

    reportsView.innerHTML = `
        <h2 class="text-2xl font-bold mb-6 no-print">${t.reportsTitle}</h2>
        
        <div class="mb-8 no-print">
            <h3 class="text-xl font-semibold mb-4">${t.overallAnalytics}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${renderStatCard('🏞️', t.totalFields, totalFields, t.tooltips.totalFields)}
                ${renderStatCard('🗺️', t.totalAcreage, displaySize(totalAcreage), t.tooltips.totalAcreage)}
                ${renderStatCard('🌿', t.avgPlantHealth, avgNdvi, t.tooltips.avgNdvi)}
                ${renderStatCard('🌾', t.totalEstYield, `${totalYield.toFixed(2)} ${t.yieldUnit}`, t.tooltips.cropYield)}
            </div>
        </div>

        <!-- Field Specific Analysis -->
        <div class="bg-white p-6 rounded-lg shadow-md">
             <div class="flex flex-wrap justify-between items-center mb-6 no-print">
                <div>
                    <h3 class="text-xl font-semibold">${t.fieldSpecificAnalysis}</h3>
                    <p class="text-gray-600">${t.selectFieldPrompt}</p>
                </div>
                 <div class="flex items-center space-x-2 rtl:space-x-reverse mt-4 sm:mt-0 download-buttons-container">
                    <button id="download-pdf-btn" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors" ${!selectedField ? 'disabled' : ''}>
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>${t.downloadPDF}</span>
                    </button>
                    <button id="download-csv-btn" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors" ${!selectedField ? 'disabled' : ''}>
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>${t.downloadCSV}</span>
                    </button>
                </div>
            </div>
            
            <select id="report-field-select" class="w-full max-w-sm p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 mb-6 no-print">
                <option value="" disabled ${!state.reportSelectedFieldId ? 'selected' : ''}>${t.selectFieldPrompt}</option>
                ${fields.map(f => `<option value="${f.id}" ${state.reportSelectedFieldId === f.id ? 'selected' : ''}>${f.name}</option>`).join('')}
            </select>
            
            <div id="report-detail-container">
                ${selectedField ? renderFieldReportDetail(selectedField) : ''}
            </div>
        </div>
    `;

    document.getElementById('report-field-select')?.addEventListener('change', handleReportFieldSelect);
    document.getElementById('download-pdf-btn')?.addEventListener('click', handleDownloadPDF);
    document.getElementById('download-csv-btn')?.addEventListener('click', handleDownloadCSV);

    if (selectedField) {
        renderFieldMap(selectedField, 'report-location-map');
        setTimeout(() => {
            renderAllReportCharts(selectedField);
            
            // Trigger AI analysis for the report view
            const analysisContent = document.getElementById('report-ai-analysis-content');
            if(analysisContent) {
                if (reportAiAnalysisDebounceTimer) {
                    clearTimeout(reportAiAnalysisDebounceTimer);
                }

                analysisContent.innerHTML = `
                    <div class="flex flex-col items-center justify-center text-gray-500">
                        <div class="loader-spinner-small"></div>
                        <span class="mt-2">${t.analyzingData}</span>
                    </div>
                `;

                reportAiAnalysisDebounceTimer = setTimeout(() => {
                    getAIFieldAnalysis(selectedField, state.lang).then(analysisText => {
                        const currentSelectedField = state.currentUser.fields.find(f => f.id === state.reportSelectedFieldId);
                         if (currentSelectedField && currentSelectedField.id === selectedField.id) {
                             if (analysisText.startsWith('RATE_LIMIT_ERROR:')) {
                                const message = analysisText.replace('RATE_LIMIT_ERROR:', '');
                                analysisContent.innerHTML = `<p class="text-yellow-700 p-4 bg-yellow-100 rounded-md">${message}</p>`;
                            } else {
                                analysisContent.innerHTML = `<div class="text-gray-700 whitespace-pre-wrap">${markdownToHtml(analysisText)}</div>`;
                            }
                         }
                    }).catch(err => {
                        console.error("AI Report Analysis Error:", err);
                        analysisContent.innerHTML = `<p class="text-red-500">${t.aiError}</p>`;
                    });
                }, 500);
            }
        }, 100);
    }
}

function renderCommunity() {
    const communityView = document.getElementById('community-view');
    const t = translations[state.lang];
    const postsHtml = allPosts
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .map(renderPostCard)
        .join('');

    communityView.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">${t.communityTitle}</h2>
            <button id="ask-question-btn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                ${t.askQuestion}
            </button>
        </div>
        <div class="space-y-6">
            ${postsHtml || `<div class="text-center p-8 bg-white rounded-lg shadow-md"><p>${t.noPosts}</p></div>`}
        </div>
    `;

    document.getElementById('ask-question-btn').addEventListener('click', showNewPostModal);
    
    // Add delegated event listeners for dynamic content
    communityView.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const postCard = target.closest('.post-card');
        if (!postCard) return;

        // Toggle replies
        const toggleBtn = target.closest('[data-action="toggle-replies"]');
        if (toggleBtn) {
            handleToggleReplies(parseInt(toggleBtn.getAttribute('data-post-id')));
        }
        
        // Start editing post or reply
        const editBtn = target.closest('[data-action="edit"]');
        if (editBtn) {
            const type = editBtn.getAttribute('data-type');
            const id = parseInt(editBtn.getAttribute('data-id'));
            const content = editBtn.getAttribute('data-content');
            handleStartEdit(type, id, content);
        }

        // Cancel editing
        if (target.closest('[data-action="cancel-edit"]')) {
            handleCancelEdit();
        }
    });

    communityView.addEventListener('submit', (e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;

        // Add a new reply
        if (target.id === 'reply-form') {
            handleReplySubmit(target);
        }
        
        // Save an edit
        if (target.id === 'edit-form') {
            handleSaveEdit(target);
        }
    });
}

function formatTimeAgo(date) {
    const t = translations[state.lang];
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return t.justNow;
    
    const intervals = {
        [t.days]: 86400, [t.day]: 86400,
        [t.hours]: 3600, [t.hour]: 3600,
        [t.minutes]: 60, [t.minute]: 60,
    };
    
    let counter;
    for (const key in intervals) {
        counter = Math.floor(seconds / intervals[key]);
        if (counter > 0) {
            const singularKey = key.endsWith('s') ? key.slice(0, -1) : key;
            const correctKey = counter === 1 ? singularKey : key;
            if (state.lang === 'ar') {
                 // Arabic grammar for time is complex, simple format for now
                 return `${t.ago} ${counter} ${correctKey}`;
            }
            return `${counter} ${correctKey} ${t.ago}`;
        }
    }
    return t.justNow;
}

function renderEditView() {
    const t = translations[state.lang];
    return `
        <form id="edit-form" class="mt-2">
            <textarea class="w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" rows="4" required>${state.editText}</textarea>
            <div class="flex items-center justify-end space-x-2 rtl:space-x-reverse mt-2">
                <button type="button" data-action="cancel-edit" class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">${t.cancel}</button>
                <button type="submit" class="px-3 py-1 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">${t.save}</button>
            </div>
        </form>
    `;
}

function renderReplyCard(reply) {
    const t = translations[state.lang];
    const isEditing = state.editingContent.type === 'reply' && state.editingContent.id === reply.id;
    const isAuthor = reply.author === state.currentUser.name;

    return `
        <div class="group relative py-3">
            <div class="flex justify-between items-start">
                <div>
                    <span class="font-semibold text-sm">${reply.author}</span>
                    <span class="text-xs text-gray-500 ml-2 rtl:mr-2 rtl:ml-0">${formatTimeAgo(reply.timestamp)}</span>
                </div>
                 ${isAuthor && !isEditing ? `
                    <button data-action="edit" data-type="reply" data-id="${reply.id}" data-content="${reply.content}" class="edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                    </button>
                ` : ''}
            </div>
            <div class="mt-1 text-gray-700">
                ${isEditing ? renderEditView() : `<p class="whitespace-pre-wrap text-sm">${reply.content}</p>`}
            </div>
        </div>
    `;
}

function renderRepliesSection(post) {
    const t = translations[state.lang];
    return `
        <div class="replies-section">
            ${post.replies.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()).map(renderReplyCard).join('') || ''}
            <form id="reply-form" data-post-id="${post.id}" class="mt-4">
                 <textarea name="reply-content" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" rows="2" placeholder="${t.yourReply}"></textarea>
                 <div class="text-right mt-2">
                     <button type="submit" class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">${t.addReply}</button>
                 </div>
            </form>
        </div>
    `;
}

function renderPostCard(post) {
    const t = translations[state.lang];
    const isRepliesOpen = state.communitySelectedPostId === post.id;
    const isEditing = state.editingContent.type === 'post' && state.editingContent.id === post.id;
    const isAuthor = post.author === state.currentUser.name;

    return `
        <div class="post-card bg-white p-6 rounded-lg shadow-md">
            <div class="group relative">
                <h3 class="text-xl font-bold text-green-800 mb-2">${post.title}</h3>
                <div class="text-sm text-gray-500 mb-4">
                    <span>${t.postedBy} <strong>${post.author}</strong></span>
                    <span class="mx-2">|</span>
                    <span>${formatTimeAgo(post.timestamp)}</span>
                </div>
                ${isAuthor && !isEditing ? `
                    <button data-action="edit" data-type="post" data-id="${post.id}" data-content="${post.content}" class="edit-btn absolute top-0 ${state.lang === 'ar' ? 'left-0' : 'right-0'}">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                       <span class="sr-only">${t.edit}</span>
                    </button>
                ` : ''}
            </div>
            
            <div class="text-gray-700 mb-4">
                 ${isEditing ? renderEditView() : `<p class="whitespace-pre-wrap">${post.content}</p>`}
            </div>

            <div class="flex items-center text-gray-600">
                <button data-action="toggle-replies" data-post-id="${post.id}" class="flex items-center text-sm font-medium text-blue-600 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>${isRepliesOpen ? t.hideReplies : `${t.viewReplies} (${post.replies.length})`}</span>
                </button>
            </div>
            
            ${isRepliesOpen ? renderRepliesSection(post) : ''}
        </div>
    `;
}

// FIX: Add renderProfile function to render the user profile view.
function renderProfile() {
    const profileView = document.getElementById('profile-view');
    const t = translations[state.lang];
    const user = state.currentUser;

    if (!user) {
        profileView.innerHTML = `<p>Error: No user found.</p>`;
        return;
    }

    const isEditing = state.isEditingProfile;

    profileView.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">${t.profileTitle}</h2>
                ${!isEditing ? `<button id="edit-profile-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">${t.editProfile}</button>` : ''}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1 flex flex-col items-center text-center">
                    <img src="${user.profilePicture}" alt="${user.name}" class="w-32 h-32 rounded-full object-cover mb-4 border-2 border-gray-200">
                    <h3 class="text-xl font-semibold">${user.name}</h3>
                    <span class="px-3 py-1 mt-2 text-sm font-semibold ${user.plan === 'Premium' ? 'text-green-800 bg-green-200' : 'text-gray-800 bg-gray-200'} rounded-full">${user.plan === 'Premium' ? t.premiumPlan : t.freePlan}</span>
                </div>

                <div class="md:col-span-2">
                    ${isEditing ? `
                        <form id="profile-edit-form">
                            <div class="space-y-4">
                                <div>
                                    <label for="profile-pic-url" class="block text-sm font-medium text-gray-700">${t.profilePictureURL}</label>
                                    <input type="url" id="profile-pic-url" value="${user.profilePicture || ''}" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                                </div>
                                <div>
                                    <label for="profile-bio" class="block text-sm font-medium text-gray-700">${t.bio}</label>
                                    <textarea id="profile-bio" rows="4" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">${user.bio || ''}</textarea>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">${t.preferredUnits}</label>
                                    <div class="mt-2 space-y-2">
                                        <div class="flex items-center">
                                            <input id="units-metric" name="preferred-units" type="radio" ${user.preferredUnits === 'metric' ? 'checked' : ''} value="metric" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                                            <label for="units-metric" class="ml-3 rtl:mr-3 rtl:ml-0 block text-sm font-medium text-gray-700">${t.metric}</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input id="units-imperial" name="preferred-units" type="radio" ${user.preferredUnits === 'imperial' ? 'checked' : ''} value="imperial" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                                            <label for="units-imperial" class="ml-3 rtl:mr-3 rtl:ml-0 block text-sm font-medium text-gray-700">${t.imperial}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                                <button type="button" id="cancel-edit-profile-btn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">${t.cancel}</button>
                                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">${t.saveChanges}</button>
                            </div>
                        </form>
                    ` : `
                        <div class="space-y-6">
                            <div>
                                <h4 class="font-semibold text-gray-600">${t.bio}</h4>
                                <p class="text-gray-800 mt-1 whitespace-pre-wrap">${user.bio || 'Not provided.'}</p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-600">${t.preferredUnits}</h4>
                                <p class="text-gray-800 mt-1">${user.preferredUnits === 'metric' ? t.metric : t.imperial}</p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-600">${t.emailLabel}</h4>
                                <p class="text-gray-800 mt-1">${state.currentUserEmail}</p>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    if (isEditing) {
        document.getElementById('profile-edit-form')?.addEventListener('submit', handleSaveProfile);
        document.getElementById('cancel-edit-profile-btn')?.addEventListener('click', handleCancelEditProfile);
    } else {
        document.getElementById('edit-profile-btn')?.addEventListener('click', handleEditProfileClick);
    }
}

function renderStatCard(icon, title, value, tooltipText) {
    const tooltipHtml = tooltipText ? renderInfoTooltip(tooltipText) : '';
    return `
        <div class="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4 rtl:space-x-reverse">
            <div class="text-3xl bg-green-100 p-3 rounded-full">${icon}</div>
            <div>
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <h4 class="text-gray-500">${title}</h4>
                    ${tooltipHtml}
                </div>
                <p class="text-2xl font-bold">${value}</p>
            </div>
        </div>
    `;
}

function renderDisabledStatCard(title, tooltipText, icon) {
    const t = translations[state.lang];
    const tooltipHtml = tooltipText ? renderInfoTooltip(tooltipText) : '';
    return `
        <div class="bg-white p-6 rounded-lg shadow-md relative">
            <div class="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <div class="text-center p-4">
                    <span class="text-3xl">🔒</span>
                    <p class="font-bold text-gray-700 mt-2">${t.premiumFeature}</p>
                    <button class="upgrade-button-small mt-2">${t.upgradeNow}</button>
                </div>
            </div>
            <div class="flex items-start space-x-4 rtl:space-x-reverse opacity-40">
                <div class="text-3xl bg-gray-200 p-3 rounded-full">${icon}</div>
                <div>
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                        <h4 class="text-gray-500">${title}</h4>
                        ${tooltipHtml}
                    </div>
                    <p class="text-2xl font-bold text-gray-400">--</p>
                </div>
            </div>
        </div>
    `;
}

function renderInfoTooltip(text) {
    return `
        <div class="group relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="tooltip-content">
                ${text}
            </div>
        </div>
    `;
}


function getIndexStatus(indexName, value) {
    const status = {
        good: { textClass: 'text-green-600 font-bold' },
        moderate: { textClass: 'text-yellow-600 font-bold' },
        poor: { textClass: 'text-red-600 font-bold' },
    };

    switch (indexName.toLowerCase()) {
        case 'ndvi':
        case 'gndvi':
            if (value >= 0.7) return status.good;
            if (value >= 0.4) return status.moderate;
            return status.poor;
        case 'soilmoisture':
            if (value >= 40 && value <= 75) return status.good;
            if (value >= 25 && value < 40) return status.moderate;
            return status.poor;
        case 'evi':
            if (value >= 0.6) return status.good;
            if (value >= 0.35) return status.moderate;
            return status.poor;
        case 'gci':
            if (value >= 7) return status.good;
            if (value >= 4) return status.moderate;
            return status.poor;
        case 'ndre':
            if (value >= 0.5) return status.good;
            if (value >= 0.3) return status.moderate;
            return status.poor;
        case 'ndwi':
             if (value >= 0.3) return status.good;
             if (value >= 0.1) return status.moderate;
             return status.poor;
        case 'msi': // Lower is better for MSI
            if (value <= 1.0) return status.good;
            if (value <= 1.3) return status.moderate;
            return status.poor;
        default:
            return null;
    }
}

function renderChartCard(title, canvasId, tooltipText = '', value = null, indexName = '') {
    const tooltipHtml = tooltipText ? renderInfoTooltip(tooltipText) : '';
    let valueHtml = '';

    if (value !== null && typeof value === 'number') {
        const status = getIndexStatus(indexName, value);
        if (status) {
            valueHtml = `<span class="text-lg ${status.textClass}">${value.toFixed(2)}</span>`;
        } else {
            // For values without color coding like yield, or if indexName is not provided
            valueHtml = `<span class="text-lg text-gray-800 font-bold">${value.toFixed(2)}</span>`;
        }
    }
    
    return `
        <div class="bg-white p-4 rounded-lg shadow-md">
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-800">${title}</h4>
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  ${valueHtml}
                  ${tooltipHtml}
                </div>
            </div>
            <canvas id="${canvasId}"></canvas>
        </div>
    `;
}

function renderDisabledCard(title, tooltipText = '') {
    const t = translations[state.lang];
    const tooltipHtml = tooltipText ? renderInfoTooltip(tooltipText) : '';
    return `
        <div class="bg-white p-4 rounded-lg shadow-md relative opacity-60">
             <div class="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10">
                <div class="text-center">
                    <span class="text-2xl">🔒</span>
                    <p class="font-bold text-gray-700">${t.premiumFeature}</p>
                    <button class="upgrade-button-small mt-2">${t.upgradeNow}</button>
                </div>
            </div>
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold">${title}</h4>
                ${tooltipHtml}
            </div>
            <div class="h-48 bg-gray-100 rounded-md"></div>
        </div>
    `;
}

function renderRecommendation(title, text, type) {
    const colors = {
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        critical: 'red'
    };
    const color = colors[type] || 'gray';
    return `
        <div class="border-l-4 border-${color}-500 pl-4 py-2 rtl:border-l-0 rtl:border-r-4 rtl:pr-4 rtl:pl-0">
            <h5 class="font-bold">${title}</h5>
            <p class="text-sm text-gray-600">${text}</p>
        </div>
    `;
}

function renderWeatherWidget(weather, title = null) {
    const t = translations[state.lang];
    const { current, forecast } = weather;

    const titleHtml = title ? `<h3 class="text-xl font-semibold mb-4">${title}</h3>` : '';

    const containerClass = title ? 'bg-white p-6 rounded-lg shadow-md' : 'border-t pt-4';

    return `
        <div class="${containerClass}">
            ${titleHtml}
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-gray-600">${t.today}</p>
                    <p class="text-5xl font-bold">${displayTemp(current.temp)}</p>
                    <p class="text-gray-500">${current.condition}</p>
                </div>
                <div class="text-6xl">${current.icon}</div>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-4">
                <span>${t.precipitation}: ${current.precipitation}%</span>
                <span>${t.wind}: ${current.wind} km/h</span>
            </div>
            <div class="mt-4 pt-4 border-t flex justify-around text-center">
                ${forecast.map(day => `
                    <div>
                        <p class="font-medium">${day.day}</p>
                        <p class="text-2xl my-1">${day.icon}</p>
                        <p class="text-gray-700">${displayTemp(day.temp)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}


function renderLineChart(canvasId, label, data, color = 'green') {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    // Check if a chart instance already exists on the canvas and destroy it
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const colorConfig = {
        green: { border: 'rgba(46, 125, 50, 1)', background: 'rgba(46, 125, 50, 0.1)' },
        red: { border: 'rgba(211, 47, 47, 1)', background: 'rgba(211, 47, 47, 0.1)' },
        blue: { border: 'rgba(25, 118, 210, 1)', background: 'rgba(25, 118, 210, 0.1)' },
        purple: { border: 'rgba(128, 0, 128, 1)', background: 'rgba(128, 0, 128, 0.1)' },
        teal: { border: 'rgba(0, 128, 128, 1)', background: 'rgba(0, 128, 128, 0.1)' },
        orange: { border: 'rgba(255, 165, 0, 1)', background: 'rgba(255, 165, 0, 0.1)' },
        lime: { border: 'rgba(50, 205, 50, 1)', background: 'rgba(50, 205, 50, 0.1)' },
        cyan: { border: 'rgba(0, 255, 255, 1)', background: 'rgba(0, 255, 255, 0.1)' },
        brown: { border: 'rgba(139, 69, 19, 1)', background: 'rgba(139, 69, 19, 0.1)' },
    };

    const selectedColor = colorConfig[color] || colorConfig.green;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: label,
                data: data,
                borderColor: selectedColor.border,
                backgroundColor: selectedColor.background,
                tension: 0.3,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            animation: false
        }
    });
}

function renderBarChart(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    // Check if a chart instance already exists on the canvas and destroy it
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Levels',
                data: data,
                backgroundColor: ['rgba(46, 125, 50, 0.7)', 'rgba(25, 118, 210, 0.7)', 'rgba(245, 124, 0, 0.7)'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            animation: false
        }
    });
}


function updateUIForUser() {
    const t = translations[state.lang];

    // Update static text that doesn't live in a view
    logoutButton.textContent = t.logout;
    langSwitcher.textContent = t.switchLanguage;
    document.querySelector('[data-view="dashboard"]').innerHTML = `<span class="mr-2 rtl:ml-2 rtl:mr-0">📊</span> ${t.dashboard}`;
    document.querySelector('[data-view="fields"]').innerHTML = `<span class="mr-2 rtl:ml-2 rtl:mr-0">🏞️</span> ${t.myFields}`;
    document.querySelector('[data-view="reports"]').innerHTML = `<span class="mr-2 rtl:ml-2 rtl:mr-0">📄</span> ${t.reports}`;
    document.querySelector('[data-view="community"]').innerHTML = `<span class="mr-2 rtl:ml-2 rtl:mr-0">👥</span> ${t.community}`;
    document.querySelector('[data-view="profile"]').innerHTML = `<span class="mr-2 rtl:ml-2 rtl:mr-0">👤</span> ${t.profile}`;

    if (state.currentUser) {
        welcomeMessage.textContent = `${t.welcome}, ${state.currentUser.name}`;
        let planHtml = '';
        if (state.currentUser.plan === 'Free') {
            planHtml = `
                <span class="text-sm text-gray-600 mr-2 rtl:ml-2 rtl:mr-0">${t.freePlan}</span>
                <button id="upgrade-button" class="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-full hover:bg-yellow-600">${t.upgrade}</button>
            `;
        } else {
            planHtml = `<span class="px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded-full">${t.premiumPlan}</span>`;
        }
        planStatusContainer.innerHTML = planHtml;
        
        // Add event listener to potentially new upgrade buttons
        document.getElementById('upgrade-button')?.addEventListener('click', showUpgradeModal);
        document.querySelectorAll('.upgrade-button-small').forEach(btn => btn.addEventListener('click', showUpgradeModal));
        welcomeMessage.addEventListener('click', () => navigateTo('profile'));


        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        navigateTo(state.currentView);
    } else {
        // Update login screen translations
        document.querySelector('#auth-section h1').textContent = t.appTitle;
        document.querySelector('#auth-section p').textContent = t.appSubtitle;
        document.querySelector('label[for="email"]').textContent = t.emailLabel;
        document.querySelector('label[for="password"]').textContent = t.passwordLabel;
        document.querySelector('#login-form button[type="submit"]').textContent = t.login;
        document.querySelector('#login-form p').innerHTML = `${t.registerPrompt} <a href="#" class="font-medium text-blue-600 hover:underline">${t.registerLink}</a>`;
        
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
    }
}

function showUpgradeModal() {
    // Implement modal logic here
    alert('Upgrade plan functionality would be shown here!');
}

function showNewPostModal() {
    const t = translations[state.lang];
    newPostModal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
            <form id="new-post-form">
                <div class="p-6">
                    <h3 class="text-2xl font-semibold text-gray-800">${t.newPostTitle}</h3>
                </div>
                <div class="px-6 pb-6 space-y-4">
                    <div>
                        <label for="post-title" class="block text-sm font-medium text-gray-700">${t.postTitleLabel}</label>
                        <input type="text" id="post-title" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                        <p id="post-title-error" class="text-red-500 text-sm mt-1 hidden"></p>
                    </div>
                    <div>
                        <label for="post-content" class="block text-sm font-medium text-gray-700">${t.postContentLabel}</label>
                        <textarea id="post-content" rows="6" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"></textarea>
                        <p id="post-content-error" class="text-red-500 text-sm mt-1 hidden"></p>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rtl:space-x-reverse">
                     <button type="button" id="cancel-new-post" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">${t.cancel}</button>
                     <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">${t.submitPost}</button>
                </div>
            </form>
        </div>
    `;
    newPostModal.classList.remove('hidden');
    newPostModal.classList.add('flex');
    document.getElementById('cancel-new-post').addEventListener('click', closeNewPostModal);
    document.getElementById('new-post-form').addEventListener('submit', handleNewPostSubmit);
}

function closeNewPostModal() {
    newPostModal.classList.add('hidden');
    newPostModal.classList.remove('flex');
    newPostModal.innerHTML = '';
}

function showAddFieldModal() {
    const t = translations[state.lang];
    const isEditMode = state.editingFieldId !== null;
    const fieldToEdit = isEditMode ? state.currentUser.fields.find(f => f.id === state.editingFieldId) : null;
    
    const modalTitle = isEditMode ? t.editFieldModalTitle : t.addFieldModalTitle;
    const saveButtonText = isEditMode ? t.saveChanges : t.saveField;
    const sizeUnit = state.currentUser.preferredUnits === 'imperial' ? t.fieldDetails.acresUnit : t.fieldDetails.feddanUnit;


    const cropOptions = Object.entries(t.cropTypes).map(([key, value]) => {
        const isSelected = fieldToEdit && (fieldToEdit.crop === value || fieldToEdit.crop.toLowerCase() === key);
        return `<option value="${value}" ${isSelected ? 'selected' : ''}>${value}</option>`;
    }).join('');

    const irrigationOptions = ['Drip', 'Flood', 'Sprinkler', 'Pivot'].map(type => {
        const isSelected = fieldToEdit && fieldToEdit.irrigation === type;
        return `<option ${isSelected ? 'selected' : ''}>${type}</option>`;
    }).join('');

    let locationString = '';
    if (fieldToEdit) {
        if (typeof fieldToEdit.location === 'string') {
            locationString = fieldToEdit.location;
        } else if (fieldToEdit.location && typeof fieldToEdit.location.lat === 'number') {
            locationString = `Lat: ${fieldToEdit.location.lat.toFixed(5)}, Lon: ${fieldToEdit.location.lng.toFixed(5)}`;
        }
    }

    addFieldModal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-7xl transform transition-all">
            <form id="field-form">
                <div class="p-6">
                    <h3 class="text-2xl font-semibold text-gray-800">${modalTitle}</h3>
                </div>
                <div class="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Map Side -->
                    <div class="md:col-span-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">${t.selectFieldLocation}</label>
                        <div id="map-container" class="bg-gray-300 h-96 rounded-md relative flex items-center justify-center">
                             <p>${t.gettingLocation}</p>
                        </div>
                        <button type="button" id="clear-drawing-btn" class="mt-2 w-full px-3 py-1 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700 ${isEditMode ? 'hidden' : ''}">${t.clearDrawing}</button>
                    </div>
                    <!-- Form Side -->
                    <div class="space-y-4 md:col-span-1">
                        <div id="ai-validation-error" class="hidden p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            <!-- AI error message will be injected here -->
                        </div>
                        <div>
                            <label for="field-name" class="block text-sm font-medium text-gray-700">${t.fieldName}</label>
                            <input type="text" id="field-name" value="${fieldToEdit?.name || ''}" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                            <p id="field-name-error" class="text-red-500 text-sm mt-1 hidden"></p>
                        </div>
                        ${isEditMode ? `
                            <div>
                                <label for="field-size" class="block text-sm font-medium text-gray-700">${t.fieldSize} (${sizeUnit})</label>
                                <input type="number" id="field-size" value="${displaySize(fieldToEdit?.size, false)}" step="0.01" min="0" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                                <p id="field-size-error" class="text-red-500 text-sm mt-1 hidden"></p>
                            </div>
                        ` : `
                             <div>
                                <label class="block text-sm font-medium text-gray-700">${t.fieldSize}</label>
                                <p id="calculated-field-size" class="mt-1 text-lg font-semibold text-gray-900">0.00 ${sizeUnit}</p>
                                <p id="field-size-error" class="text-red-500 text-sm mt-1 hidden"></p>
                            </div>
                        `}
                        
                        ${!isEditMode ? `
                            <div>
                                <button type="button" id="detect-location-btn" class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <svg class="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <span>${t.detectLocation}</span>
                                </button>
                            </div>
                        ` : ''}
                        <input type="hidden" id="field-location" value="${locationString}">

                        <div>
                            <label for="crop-type" class="block text-sm font-medium text-gray-700">${t.cropType}</label>
                            <select id="crop-type" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                                <option value="" disabled ${!fieldToEdit ? 'selected' : ''}>${t.selectCrop}</option>
                                ${cropOptions}
                            </select>
                        </div>
                        <div>
                            <label for="irrigation-type" class="block text-sm font-medium text-gray-700">${t.irrigationType}</label>
                            <select id="irrigation-type" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                                ${irrigationOptions}
                            </select>
                        </div>
                         <div>
                            <label for="planting-date" class="block text-sm font-medium text-gray-700">${t.plantingDate}</label>
                            <input type="date" id="planting-date" value="${fieldToEdit?.plantingDate || new Date().toISOString().split('T')[0]}" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rtl:space-x-reverse">
                     <button type="button" id="cancel-add-field" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">${t.cancel}</button>
                     <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center justify-center">${saveButtonText}</button>
                </div>
            </form>
        </div>
    `;
    addFieldModal.classList.remove('hidden');
    addFieldModal.classList.add('flex');

    const fieldNameInput = document.getElementById('field-name') as HTMLInputElement;
    const fieldNameError = document.getElementById('field-name-error');
    
    const clearValidationOnChange = (input, error) => {
        if(input && error) {
            input.addEventListener('input', () => {
                input.classList.remove('border-red-500');
                error.classList.add('hidden');
                error.textContent = '';
            });
        }
    }
    
    clearValidationOnChange(fieldNameInput, fieldNameError);
    if(isEditMode) {
        clearValidationOnChange(document.getElementById('field-size'), document.getElementById('field-size-error'));
    }


    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    
    setTimeout(() => {
        mapContainer.innerHTML = ''; 
        mapContainer.classList.remove('flex', 'items-center', 'justify-center');

        const initialCenter = (isEditMode && fieldToEdit?.location) ? fieldToEdit.location : [26.8206, 30.8025];
        const initialZoom = isEditMode ? 16 : 6;
        const map = L.map(mapContainer).setView(initialCenter, initialZoom);
        
        // Create a pane for labels to ensure they appear on top
        map.createPane('labels');
        map.getPane('labels').style.zIndex = 650;
        map.getPane('labels').style.pointerEvents = 'none';

        // Satellite Layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        }).addTo(map);

        // Labels Layer on the new pane
        L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Labels &copy; Esri',
            pane: 'labels'
        }).addTo(map);

        if (isEditMode) {
             if (fieldToEdit && fieldToEdit.boundary) {
                const polygon = L.polygon(fieldToEdit.boundary, { color: '#2E7D32', weight: 2 }).addTo(map);
                map.fitBounds(polygon.getBounds().pad(0.1));
            }
        } else {
             document.getElementById('detect-location-btn')?.addEventListener('click', () => {
                handleDetectLocation(map);
            });

            const fieldLocationInput = document.getElementById('field-location') as HTMLInputElement;
            const calculatedSizeP = document.getElementById('calculated-field-size');
            const clearDrawingBtn = document.getElementById('clear-drawing-btn');
            const saveButton = addFieldModal.querySelector('button[type="submit"]') as HTMLButtonElement;
            const validationErrorDiv = document.getElementById('ai-validation-error');
            
            const drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            const drawControl = new L.Control.Draw({
                position: 'topright',
                edit: { 
                    featureGroup: drawnItems,
                    remove: false
                },
                draw: {
                    polygon: { 
                        allowIntersection: false, 
                        showArea: true,
                        shapeOptions: { color: '#2E7D32' }
                    },
                    polyline: false, rectangle: false, circle: false, marker: false, circlemarker: false
                }
            });
            map.addControl(drawControl);
            
            let drawnPolygonLayer: any = null;

            const handleAILandValidation = async (layer) => {
                const boundary = layer.getLatLngs()[0].map(l => [l.lat, l.lng]);
                const validationResult = await getAILandValidation(boundary, state.lang);

                if (validationResult.startsWith('INVALID:')) {
                    const reason = validationResult.replace('INVALID:', '').trim();
                    validationErrorDiv.textContent = `${t.aiLandValidationError} (${reason})`;
                    validationErrorDiv.classList.remove('hidden');
                    saveButton.innerHTML = saveButtonText;
                    // Button remains disabled
                } else if (validationResult === 'VALID') {
                    saveButton.disabled = false;
                    saveButton.innerHTML = saveButtonText;
                } else if (validationResult === 'RATE_LIMIT_ERROR') {
                    const userFriendlyError = state.lang === 'ar' 
                        ? "خدمة التحقق من الأرض غير متاحة مؤقتًا بسبب كثرة الطلبات. يرجى المحاولة مرة أخرى لاحقًا."
                        : "Land validation service is temporarily unavailable due to high demand. Please try again later.";
                    validationErrorDiv.textContent = userFriendlyError;
                    validationErrorDiv.classList.remove('hidden');
                    saveButton.disabled = false; // Allow user to try saving anyway
                    saveButton.innerHTML = saveButtonText;
                } else { // Handle API error
                    showToast('AI validation service failed. Please try again.', 'error');
                    saveButton.disabled = false; // Allow user to try saving anyway
                    saveButton.innerHTML = saveButtonText;
                }
            };

            const debouncedLandValidation = (layer) => {
                if (landValidationDebounceTimer) {
                    clearTimeout(landValidationDebounceTimer);
                }
                saveButton.disabled = true;
                saveButton.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                `;
                validationErrorDiv.classList.add('hidden');

                landValidationDebounceTimer = setTimeout(() => {
                    handleAILandValidation(layer);
                }, 1500); // 1.5 second debounce
            };

            const updatePolygonData = (layer: any) => {
                const latlngs = layer.getLatLngs()[0];
                const center = layer.getBounds().getCenter();
                if(fieldLocationInput) {
                    fieldLocationInput.value = `Lat: ${center.lat.toFixed(5)}, Lon: ${center.lng.toFixed(5)}`;
                }

                const areaInMeters = L.GeometryUtil.geodesicArea(latlngs);
                const areaInFeddans = areaInMeters / 4200.83;
                calculatedSizeP.textContent = displaySize(areaInFeddans);
                
                // Clear any "please draw" error
                const sizeErrorP = document.getElementById('field-size-error');
                if (sizeErrorP) sizeErrorP.classList.add('hidden');
                
                newFieldBoundary = latlngs.map((l: any) => [l.lat, l.lng]);
                debouncedLandValidation(layer);
            };

            map.on(L.Draw.Event.CREATED, (event) => {
                if (drawnPolygonLayer) {
                    drawnItems.removeLayer(drawnPolygonLayer);
                }
                const layer = event.layer;
                drawnPolygonLayer = layer;
                drawnItems.addLayer(layer);
                updatePolygonData(layer);
            });

            map.on('draw:edited', (event) => {
                event.layers.eachLayer((layer: any) => {
                    drawnPolygonLayer = layer;
                    updatePolygonData(layer);
                });
            });

            clearDrawingBtn.addEventListener('click', () => {
                if (drawnPolygonLayer) {
                    drawnItems.removeLayer(drawnPolygonLayer);
                    drawnPolygonLayer = null;
                }
                calculatedSizeP.textContent = `0.00 ${sizeUnit}`;
                if (fieldLocationInput) fieldLocationInput.value = '';
                newFieldBoundary = null;
                validationErrorDiv.classList.add('hidden');
                saveButton.disabled = false;
                saveButton.innerHTML = saveButtonText;
            });
        }
    }, 150);

    document.getElementById('cancel-add-field').addEventListener('click', closeAddFieldModal);
    document.getElementById('field-form').addEventListener('submit', handleSaveField);
}


function closeAddFieldModal() {
    state.editingFieldId = null; // Clear editing state on close
    newFieldBoundary = null;
    addFieldModal.classList.add('hidden');
    addFieldModal.classList.remove('flex');
    addFieldModal.innerHTML = '';
}

function showDeleteConfirmationModal(field) {
    const t = translations[state.lang];
    confirmationModal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all text-left rtl:text-right">
            <div class="p-6">
                <div class="flex items-start space-x-4 rtl:space-x-reverse">
                    <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">${t.confirmDeletionTitle}</h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                ${t.confirmDeletionText} <strong>"${field.name}"</strong>? ${t.confirmDeletionWarning}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rtl:space-x-reverse">
                <button type="button" id="cancel-delete-btn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">${t.cancel}</button>
                <button type="button" id="confirm-delete-btn" data-field-id="${field.id}" class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">${t.confirmDelete}</button>
            </div>
        </div>
    `;
    confirmationModal.classList.remove('hidden');
    confirmationModal.classList.add('flex');

    document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteConfirmationModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', handleConfirmDelete);
}

function closeDeleteConfirmationModal() {
    confirmationModal.classList.add('hidden');
    confirmationModal.classList.remove('flex');
    confirmationModal.innerHTML = '';
}

// --- UTILITY FUNCTIONS ---

/**
 * Converts Celsius to Fahrenheit.
 * @param {number} celsius - Temperature in Celsius.
 * @returns {number} Temperature in Fahrenheit.
 */
function celsiusToFahrenheit(celsius) {
    return Math.round(celsius * 9/5 + 32);
}

/**
 * Converts Feddans to Acres.
 * @param {number} feddans - Area in Feddans.
 * @returns {number} Area in Acres.
 */
function feddansToAcres(feddans) {
    return feddans * 1.038;
}

/**
 * Converts Acres to Feddans.
 * @param {number} acres - Area in Acres.
 * @returns {number} Area in Feddans.
 */
function acresToFeddans(acres) {
    return acres / 1.038;
}

/**
 * Displays temperature formatted according to user's preferred units.
 * @param {number} celsius - The temperature in Celsius.
 * @returns {string} The formatted temperature string (e.g., "34°C" or "93°F").
 */
function displayTemp(celsius) {
    if (state.currentUser?.preferredUnits === 'imperial') {
        return `${celsiusToFahrenheit(celsius)}°F`;
    }
    return `${celsius}°C`;
}

/**
 * Displays area size formatted according to user's preferred units.
 * @param {number} feddans - The area in feddans.
 * @param {boolean} includeUnit - Whether to include the unit name in the string.
 * @returns {string} The formatted area string (e.g., "1.5 feddan" or "1.56 acres").
 */
function displaySize(feddans, includeUnit = true) {
    const t = translations[state.lang];
    if (state.currentUser?.preferredUnits === 'imperial') {
        const acres = feddansToAcres(feddans);
        return `${acres.toFixed(2)}${includeUnit ? ` ${t.fieldDetails.acresUnit}` : ''}`;
    }
    return `${feddans.toFixed(2)}${includeUnit ? ` ${t.fieldDetails.feddanUnit}` : ''}`;
}


/**
 * Calculates the age of a crop in days from its planting date.
 * @param {string} plantingDate - The planting date in 'YYYY-MM-DD' format.
 * @returns {number} The age of the crop in days.
 */
function calculateCropAge(plantingDate: string): number {
    if (!plantingDate) return 0;
    const pDate = new Date(plantingDate);
    // Set time to 0 to avoid timezone issues affecting day count
    pDate.setUTCHours(0, 0, 0, 0);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const diffTime = today.getTime() - pDate.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Estimates soil texture based on moisture and NPK levels.
 * This is a simplified agronomic model.
 * @param {object} field - The field data object.
 * @returns {string} A key representing the soil type (e.g., 'sandy', 'loam').
 */
function getSoilTexture(field) {
    if (!field.moistureHistory || !field.npkLevels) {
        return 'unknown';
    }
    const currentMoisture = field.moistureHistory[field.moistureHistory.length - 1];
    const totalNpk = field.npkLevels.reduce((a, b) => a + b, 0);

    // Clay soils: high moisture retention, high nutrient capacity
    if (currentMoisture > 65 && totalNpk > 220) {
        return 'clay';
    } 
    // Clay Loam: good moisture and nutrient retention
    else if (currentMoisture > 55 && totalNpk > 190) {
        return 'clayLoam';
    } 
    // Sandy soils: low moisture and nutrient retention
    else if (currentMoisture < 40 && totalNpk < 150) {
        return 'sandy';
    } 
    // Sandy Loam: slightly better than sandy
    else if (currentMoisture < 50 && totalNpk < 170) {
        return 'sandyLoam';
    } 
    // Loam: balanced, the ideal average
    else {
        return 'loam';
    }
}

/**
 * Calculates a composite soil health score based on moisture, NPK, and texture.
 * @param {object} field - The field data object.
 * @returns {{score: string, rating: string, colorClass: string}} An object with the score, rating text, and color class.
 */
function getSoilHealthScore(field) {
    const t = translations[state.lang];
    const texture = getSoilTexture(field);
    const currentMoisture = field.moistureHistory[field.moistureHistory.length - 1];
    const [n, p, k] = field.npkLevels;

    let score = 0;

    // 1. Moisture Score (Max 4 points)
    if (currentMoisture >= 40 && currentMoisture <= 75) {
        score += 4; // Optimal range
    } else if (currentMoisture > 75) {
        score += 2.5 - Math.min(1.5, (currentMoisture - 75) * 0.1); // Penalize for waterlogging
    } else {
        score += 2.5 - Math.min(2.5, (40 - currentMoisture) * 0.1); // Penalize for dryness
    }

    // 2. NPK Score (Max 3 points)
    let npkScore = 0;
    if (n > 65) npkScore += 1;
    if (p > 55) npkScore += 1;
    if (k > 60) npkScore += 1;
    score += npkScore;

    // 3. Texture Score (Max 3 points)
    switch (texture) {
        case 'loam':
        case 'clayLoam':
            score += 3;
            break;
        case 'sandyLoam':
            score += 2;
            break;
        case 'sandy':
        case 'clay':
            score += 1; // Sandy and heavy clay are harder to manage
            break;
        default:
            score += 1.5;
    }

    score = Math.max(1, Math.min(10, score)); // Clamp score between 1 and 10

    let rating, colorClass;
    if (score >= 8) {
        rating = t.healthRatings.good;
        colorClass = 'bg-green-100 text-green-800';
    } else if (score >= 5) {
        rating = t.healthRatings.moderate;
        colorClass = 'bg-yellow-100 text-yellow-800';
    } else {
        rating = t.healthRatings.poor;
        colorClass = 'bg-red-100 text-red-800';
    }

    return {
        score: score.toFixed(1),
        rating: rating,
        colorClass: colorClass,
    };
}


/**
 * A sophisticated model to calculate water needs, schedule irrigation, and predict crop yield.
 * This model uses agronomic principles like growth stages, evapotranspiration, and soil moisture depletion.
 * @param {object} field - The field data object.
 * @returns {object} An object containing irrigation data and the predicted yield.
 */
function getWaterAndFootprintData(field) {
    const cropGrowthProfiles = {
        // duration in days, waterNeeds are L/day/m^2 for [germination, vegetative, flowering, maturity]
        Wheat: { duration: 120, waterNeeds: [2.5, 4.5, 6.0, 3.0] },
        Corn: { duration: 100, waterNeeds: [3.0, 5.0, 7.5, 4.0] },
        Tomato: { duration: 90, waterNeeds: [2.0, 4.0, 6.5, 5.0] },
        Cucumber: { duration: 70, waterNeeds: [3.5, 5.5, 7.0, 6.0] },
        Cotton: { duration: 160, waterNeeds: [3.0, 5.0, 7.0, 4.5] },
        Sugarcane: { duration: 365, waterNeeds: [4.0, 6.0, 8.0, 5.0] },
        Potato: { duration: 120, waterNeeds: [2.5, 4.5, 6.5, 5.0] },
        Rice: { duration: 130, waterNeeds: [8.0, 10.0, 12.0, 9.0] }, // Higher values for flooding
        Onion: { duration: 110, waterNeeds: [2.0, 3.5, 5.0, 3.0] },
        Citrus: { duration: 365, waterNeeds: [4.0, 5.5, 6.5, 5.0] }, // Perennial
        Barley: { duration: 100, waterNeeds: [2.5, 4.0, 5.5, 3.0] },
    };
    
    // --- IRRIGATION & WATER MODEL ---
    const REFILL_POINT_MOISTURE = 40; // % - Trigger irrigation when moisture drops to this level
    const WATER_PER_MOISTURE_PERCENT = 0.6; // L/m² - Liters of water per m² to raise soil moisture by 1%

    const profile = cropGrowthProfiles[field.crop] || cropGrowthProfiles['Wheat'];
    const cropAge = calculateCropAge(field.plantingDate);

    // 1. Determine current growth stage
    const ageRatio = Math.min(cropAge / profile.duration, 1.0);
    let stageIndex;
    if (ageRatio < 0.1) stageIndex = 0;      // Germination
    else if (ageRatio < 0.5) stageIndex = 1; // Vegetative
    else if (ageRatio < 0.8) stageIndex = 2; // Flowering/Fruiting
    else stageIndex = 3;                     // Maturity

    // 2. Calculate daily water need (Crop Evapotranspiration - ETc)
    const baseWaterNeed = profile.waterNeeds[stageIndex];
    const tempFactor = field.weather.current.temp > 30 
        ? 1.0 + ((field.weather.current.temp - 30) * 0.05) 
        : Math.max(0.8, 1.0 - ((30 - field.weather.current.temp) * 0.04));
    const adjustedWaterNeed = baseWaterNeed * tempFactor; // in L/day/m²

    // 3. Schedule next irrigation based on soil moisture deficit
    const currentMoisture = field.moistureHistory[field.moistureHistory.length - 1];
    let daysUntilNextIrrigation = 0;

    if (currentMoisture > REFILL_POINT_MOISTURE) {
        const moistureBuffer = currentMoisture - REFILL_POINT_MOISTURE;
        const dailyMoistureLoss = adjustedWaterNeed / WATER_PER_MOISTURE_PERCENT;
        daysUntilNextIrrigation = (dailyMoistureLoss > 0) ? Math.floor(moistureBuffer / dailyMoistureLoss) : 10;
    }

    // 4. Adjust schedule for rain
    const nextRain = field.weather.forecast.find(day => (day.precipitation || 0) > 40);
    if (nextRain) {
        const daysToRain = ['Tomorrow', 'Fri', 'Sat'].indexOf(nextRain.day) + 1;
        if (daysToRain > 0 && daysToRain <= daysUntilNextIrrigation) {
            daysUntilNextIrrigation = daysToRain + 2; 
        }
    }

    const nextIrrigationAmount = Math.round(adjustedWaterNeed * (daysUntilNextIrrigation + 1));
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysUntilNextIrrigation);
    const nextIrrigationDate = daysUntilNextIrrigation < 4 
        ? nextDate.toLocaleDateString(state.lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long' }) 
        : nextDate.toLocaleDateString(state.lang === 'ar' ? 'ar-EG' : 'en-CA');

    // --- CROP YIELD PREDICTION MODEL ---
    let predictedYield = field.yield; // Default to last known yield
    if (field.yieldHistory && field.yieldHistory.length > 0) {
        // 1. Baseline Yield from historical performance
        const baselineYield = field.yieldHistory.reduce((a, b) => a + b, 0) / field.yieldHistory.length;

        // 2. Growth Stage Factor (0 to 1) - using a sine curve for natural progression
        const growthProgress = Math.min(cropAge / (profile.duration * 0.85), 1.0); // Reach peak potential around 85% of duration
        const growthFactor = Math.sin(growthProgress * (Math.PI / 2));

        // 3. Health Factor based on NDVI (e.g., 0.8-1.2)
        const ndviFactor = Math.max(0.5, Math.min(1.5, 1 + ((field.ndvi - 0.7) * 1.2)));

        // 4. Moisture Stress Factor (e.g., 0.8-1.0)
        let moistureFactor = 1.0;
        if (currentMoisture < 40) moistureFactor = 1 - ((40 - currentMoisture) * 0.015); // Penalty for dryness
        else if (currentMoisture > 85) moistureFactor = 1 - ((currentMoisture - 85) * 0.01); // Penalty for waterlogging
        moistureFactor = Math.max(0.7, moistureFactor);

        // 5. Weather Stress Factor from forecast (e.g., 0.9-1.0)
        let weatherFactor = 1.0;
        const heatWaveTempC = 38;
        const heatwaveDays = field.weather.forecast.filter(day => day.temp > heatWaveTempC).length;
        if (heatwaveDays > 0) weatherFactor = 1 - (heatwaveDays * 0.03); // 3% penalty per forecasted heatwave day

        // Final Calculation
        predictedYield = baselineYield * growthFactor * ndviFactor * moistureFactor * weatherFactor;
    }

    return {
        nextIrrigationDate,
        nextIrrigationAmount,
        daysUntilNextIrrigation,
        predictedYield: Math.max(0, predictedYield) // Ensure yield is not negative
    };
}


/**
 * A simple markdown to HTML converter for AI responses.
 * Supports **bold** and preserves line breaks.
 * @param {string} text - The text from the AI.
 * @returns {string} - HTML formatted string.
 */
function markdownToHtml(text) {
    if (!text) return '';
    // Escape basic HTML tags to prevent injection, just in case.
    const escapedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Convert **bold** markdown to <strong> tags.
    return escapedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

/**
 * Simulates updating the mock data to show that a refresh occurred.
 */
function updateMockData() {
    if (!state.currentUser || !state.currentUser.fields) return;

    state.currentUser.fields.forEach(field => {
        // Randomize last NDVI reading
        const lastNdvi = field.ndviHistory[field.ndviHistory.length - 1];
        const newNdvi = Math.max(0.1, Math.min(0.95, lastNdvi + (Math.random() - 0.5) * 0.05));
        field.ndviHistory.push(parseFloat(newNdvi.toFixed(2)));
        field.ndviHistory.shift();
        field.ndvi = field.ndviHistory[field.ndviHistory.length - 1];

        // Randomize last moisture reading
        const lastMoisture = field.moistureHistory[field.moistureHistory.length - 1];
        const newMoisture = Math.max(20, Math.min(85, lastMoisture + (Math.random() - 0.5) * 5));
        field.moistureHistory.push(Math.round(newMoisture));
        field.moistureHistory.shift();

        // Randomize current weather temp
        field.weather.current.temp += Math.round((Math.random() - 0.5) * 2);

        // Randomize new indices if they exist
        if (field.eviHistory) {
            const lastEvi = field.eviHistory[field.eviHistory.length - 1];
            const newEvi = Math.max(0.1, Math.min(0.9, lastEvi + (Math.random() - 0.5) * 0.05));
            field.eviHistory.push(parseFloat(newEvi.toFixed(2)));
            field.eviHistory.shift();
            field.evi = field.eviHistory[field.eviHistory.length - 1];
        }
        if (field.gciHistory) {
            const lastGci = field.gciHistory[field.gciHistory.length - 1];
            const newGci = Math.max(2, Math.min(12, lastGci + (Math.random() - 0.5) * 0.5));
            field.gciHistory.push(parseFloat(newGci.toFixed(2)));
            field.gciHistory.shift();
            field.gci = field.gciHistory[field.gciHistory.length - 1];
        }
        if (field.ndreHistory) {
            const lastNdre = field.ndreHistory[field.ndreHistory.length - 1];
            const newNdre = Math.max(0.1, Math.min(0.8, lastNdre + (Math.random() - 0.5) * 0.04));
            field.ndreHistory.push(parseFloat(newNdre.toFixed(2)));
            field.ndreHistory.shift();
            field.ndre = field.ndreHistory[field.ndreHistory.length - 1];
        }
        if (field.gndviHistory) {
            const lastGndvi = field.gndviHistory[field.gndviHistory.length - 1];
            const newGndvi = Math.max(0.1, Math.min(0.9, lastGndvi + (Math.random() - 0.5) * 0.05));
            field.gndviHistory.push(parseFloat(newGndvi.toFixed(2)));
            field.gndviHistory.shift();
            field.gndvi = field.gndviHistory[field.gndviHistory.length - 1];
        }
        if (field.ndwiHistory) {
            const lastNdwi = field.ndwiHistory[field.ndwiHistory.length - 1];
            const newNdwi = Math.max(0, Math.min(0.7, lastNdwi + (Math.random() - 0.5) * 0.06));
            field.ndwiHistory.push(parseFloat(newNdwi.toFixed(2)));
            field.ndwiHistory.shift();
            field.ndwi = field.ndwiHistory[field.ndwiHistory.length - 1];
        }
        if (field.msiHistory) {
            const lastMsi = field.msiHistory[field.msiHistory.length - 1];
            const newMsi = Math.max(0.7, Math.min(1.6, lastMsi + (Math.random() - 0.5) * 0.1));
            field.msiHistory.push(parseFloat(newMsi.toFixed(2)));
            field.msiHistory.shift();
            field.msi = field.msiHistory[field.msiHistory.length - 1];
        }
    });
}

function sendEmailAlert(user, field, alert) {
    const t = translations[state.lang];
    // This is a simulation. In a real app, this would be a backend call.
    console.log(`
        ========================================
        SIMULATING EMAIL ALERT:
        ----------------------------------------
        To: ${user.name} <${Object.keys(allUsers).find(email => allUsers[email].name === user.name)}>
        From: Agri-Optimize Alerts <no-reply@agri-optimize.com>
        Subject: ⚠️ Critical Alert for your field: ${field.name}
        
        Hello ${user.name},
        
        This is a critical alert regarding your field "${field.name}".
        
        Alert Type: ${alert.type.replace('_', ' ').toUpperCase()}
        Message: ${alert.message.replace(/\*\*/g, '')}
        
        Please take action immediately.
        
        Thank you,
        The Agri-Optimize Team
        ========================================
    `);
    
    // Show a toast notification to the user
    showToast(t.emailAlertSent.replace('{fieldName}', field.name).replace('{email}', state.currentUserEmail), 'info');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const icons = {
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icons[type]}" />
            </svg>
        </div>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}


// --- EVENT HANDLERS & NAVIGATION ---

// --- START: ADDED EVENT HANDLERS TO FIX ERRORS ---

/**
 * Handles the click event for the "Refresh Data" button.
 * Simulates fetching new data for the current user's fields.
 */
function handleRefreshData() {
    if (state.isRefreshing) return;

    state.isRefreshing = true;
    navigateTo(state.currentView); // Re-render to show spinner

    setTimeout(() => {
        updateMockData();
        state.aiAnalysisCache = {}; // Invalidate AI cache
        state.isRefreshing = false;
        
        // Find the user object in allUsers and update it
        if (state.currentUserEmail) {
            allUsers[state.currentUserEmail] = JSON.parse(JSON.stringify(state.currentUser));
        }
        
        saveAppData();
        navigateTo(state.currentView); // Re-render with new data
        showToast('Data refreshed successfully!', 'success');
    }, 1500); // Simulate network delay
}

/**
 * Handles the change event for the field selector in the reports view.
 * @param {Event} e The change event.
 */
function handleReportFieldSelect(e) {
    const fieldId = parseInt((e.target as HTMLSelectElement).value);
    if (fieldId) {
        state.reportSelectedFieldId = fieldId;
        updateCurrentUserSetting('lastReportSelectedFieldId', fieldId);
        renderReports();
    }
}

/**
 * Handles the click event for the "Download PDF" button.
 * Triggers the browser's print functionality.
 */
function handleDownloadPDF() {
    const selectedField = state.currentUser.fields.find(f => f.id === state.reportSelectedFieldId);
    if (!selectedField) {
        showToast('Please select a field to download a report.', 'error');
        return;
    }
    window.print();
}

/**
 * Handles the click event for the "Download CSV" button.
 * Generates and downloads a CSV report for the selected field.
 */
function handleDownloadCSV() {
    const selectedField = state.currentUser.fields.find(f => f.id === state.reportSelectedFieldId);
    if (!selectedField) {
        showToast('Please select a field to download a report.', 'error');
        return;
    }

    const t = translations[state.lang];
    const headers = [
        'Metric', 'Value', 'Unit',
        'History 1', 'History 2', 'History 3', 'History 4', 'History 5', 'History 6', 'History 7'
    ];
    
    const data = [
        ['Field Name', selectedField.name],
        ['Crop', selectedField.crop],
        ['Size', displaySize(selectedField.size, false), state.currentUser.preferredUnits === 'imperial' ? 'acres' : 'feddan'],
        ['NDVI', selectedField.ndvi, '', ...selectedField.ndviHistory],
        ['Soil Moisture', selectedField.moistureHistory[selectedField.moistureHistory.length - 1], '%', ...selectedField.moistureHistory],
        ['EVI', selectedField.evi, '', ...(selectedField.eviHistory || [])],
        ['GCI', selectedField.gci, '', ...(selectedField.gciHistory || [])],
        ['NDRE', selectedField.ndre, '', ...(selectedField.ndreHistory || [])],
        ['GNDVI', selectedField.gndvi, '', ...(selectedField.gndviHistory || [])],
        ['NDWI', selectedField.ndwi, '', ...(selectedField.ndwiHistory || [])],
        ['MSI', selectedField.msi, '', ...(selectedField.msiHistory || [])],
        ['Yield Estimate', getWaterAndFootprintData(selectedField).predictedYield.toFixed(2), 'tons/' + (state.currentUser.preferredUnits === 'imperial' ? 'acre' : 'feddan'), ...selectedField.yieldHistory]
    ];

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + data.map(e => `"${e.join('","')}"`).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const safeFieldName = selectedField.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute("download", `report_${safeFieldName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Toggles the visibility of replies for a community post.
 * @param {number} postId The ID of the post.
 */
function handleToggleReplies(postId) {
    if (state.communitySelectedPostId === postId) {
        state.communitySelectedPostId = null; // Close if already open
    } else {
        state.communitySelectedPostId = postId;
    }
    updateCurrentUserSetting('lastCommunitySelectedPostId', state.communitySelectedPostId);
    renderCommunity();
}

/**
 * Sets the state to start editing a post or reply.
 * @param {string} type 'post' or 'reply'.
 * @param {number} id The ID of the post or reply.
 * @param {string} content The current content to edit.
 */
function handleStartEdit(type, id, content) {
    state.editingContent = { type, id };
    state.editText = content;
    renderCommunity(); // Re-render to show the edit form
}

/**
 * Cancels the current edit operation.
 */
function handleCancelEdit() {
    state.editingContent = { type: null, id: null };
    state.editText = '';
    renderCommunity();
}

/**
 * Handles the submission of a new reply to a post.
 * @param {HTMLFormElement} form The reply form element.
 */
function handleReplySubmit(form) {
    const postId = parseInt(form.getAttribute('data-post-id'));
    const content = (form.querySelector('textarea[name="reply-content"]') as HTMLTextAreaElement).value.trim();

    if (!content) return;

    const post = allPosts.find(p => p.id === postId);
    if (post) {
        const newReply = {
            id: Date.now(), // Simple unique ID
            author: state.currentUser.name,
            content: content,
            timestamp: new Date()
        };
        post.replies.push(newReply);
        saveAppData();
        renderCommunity(); // Re-render to show the new reply
    }
}

/**
 * Saves the edited content of a post or reply.
 * @param {HTMLFormElement} form The edit form element.
 */
function handleSaveEdit(form) {
    const newContent = (form.querySelector('textarea') as HTMLTextAreaElement).value.trim();
    if (!newContent) return;

    const { type, id } = state.editingContent;
    if (type === 'post') {
        const post = allPosts.find(p => p.id === id);
        if (post) {
            post.content = newContent;
        }
    } else if (type === 'reply') {
        for (const post of allPosts) {
            const reply = post.replies.find(r => r.id === id);
            if (reply) {
                reply.content = newContent;
                break;
            }
        }
    }
    
    saveAppData();
    handleCancelEdit(); // This resets state and re-renders
}

/**
 * Handles the submission of a new post from the modal.
 * @param {Event} e The form submission event.
 */
function handleNewPostSubmit(e) {
    e.preventDefault();
    const t = translations[state.lang];
    const titleInput = document.getElementById('post-title') as HTMLInputElement;
    const contentInput = document.getElementById('post-content') as HTMLTextAreaElement;
    const titleError = document.getElementById('post-title-error');
    const contentError = document.getElementById('post-content-error');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    let isValid = true;

    titleError.classList.add('hidden');
    contentError.classList.add('hidden');

    if (!title) {
        titleError.textContent = t.titleRequired;
        titleError.classList.remove('hidden');
        isValid = false;
    }
    if (!content) {
        contentError.textContent = t.contentRequired;
        contentError.classList.remove('hidden');
        isValid = false;
    }

    if (!isValid) return;

    const newPost = {
        id: Date.now(),
        author: state.currentUser.name,
        title: title,
        content: content,
        timestamp: new Date(),
        replies: []
    };

    allPosts.push(newPost);
    saveAppData();
    closeNewPostModal();
    renderCommunity();
}

// --- END: ADDED EVENT HANDLERS TO FIX ERRORS ---

function handleDetectLocation(mapInstance) {
    const t = translations[state.lang];
    if (navigator.geolocation) {
        const detectBtn = document.getElementById('detect-location-btn') as HTMLButtonElement;
        if (detectBtn) {
            detectBtn.disabled = true;
            detectBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Detecting...</span>
            `;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const userLocation = L.latLng(latitude, longitude);
                mapInstance.setView(userLocation, 15);
                const userMarker = L.marker(userLocation).addTo(mapInstance);
                setTimeout(() => {
                    if (mapInstance.hasLayer(userMarker)) {
                        mapInstance.removeLayer(userMarker);
                    }
                }, 3000);

                if (detectBtn) {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = `
                         <svg class="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>${t.detectLocation}</span>
                    `;
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                showToast(t.geolocationError, 'error');
                 if (detectBtn) {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = `
                         <svg class="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>${t.detectLocation}</span>
                    `;
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        showToast(t.geolocationNotSupported, 'error');
    }
}


function navigateTo(view) {
    state.currentView = view;
    updateCurrentUserSetting('lastView', view);
    ['dashboard', 'fields', 'reports', 'community', 'profile'].forEach(v => {
        const el = document.getElementById(`${v}-view`);
        if (v === view) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('data-view') === view) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    switch(view) {
        case 'dashboard': renderDashboard(); break;
        case 'fields': renderFields(); break;
        case 'reports': 
            // Default to first field if none is selected
            if (!state.reportSelectedFieldId && state.currentUser.fields.length > 0) {
                state.reportSelectedFieldId = state.currentUser.fields[0].id;
            }
            renderReports(); 
            break;
        case 'community': renderCommunity(); break;
        case 'profile': renderProfile(); break;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const user = allUsers[email];

    if (user) {
        state.currentUser = user;
        state.currentUserEmail = email;
        
        applyUserSettings(email);

        document.documentElement.lang = state.lang;
        document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';

        saveAppData();
        updateUIForUser();
    } else {
        alert('User not found. Try one of the demo accounts.');
    }
}

function handleLogout() {
    state.currentUser = null;
    state.currentUserEmail = null;
    state.currentView = 'dashboard'; // Reset to default view
    saveAppData();
    updateUIForUser();
}

function handleLangSwitch() {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';

    if (state.currentUserEmail) {
        updateCurrentUserSetting('lang', state.lang);
    }
    
    saveAppData(); // Also update the global session lang for next time app opens before login
    updateUIForUser(); // This will re-render the current view with the new language
}

function handleFieldSelect(e) {
    const fieldId = parseInt(e.currentTarget.getAttribute('data-field-id'));
    if (fieldId !== state.selectedFieldId) {
        state.selectedFieldId = fieldId;
        updateCurrentUserSetting('lastSelectedFieldId', fieldId);
        renderFields(); // Re-render the fields view
    }
}

function handleEditField() {
    if (state.selectedFieldId === null) return;
    state.editingFieldId = state.selectedFieldId;
    showAddFieldModal();
}

function handleDeleteField() {
    if (state.selectedFieldId === null) return;
    const fieldToDelete = state.currentUser.fields.find(f => f.id === state.selectedFieldId);
    if (fieldToDelete) {
        showDeleteConfirmationModal(fieldToDelete);
    }
}

function handleConfirmDelete(e) {
    const fieldId = parseInt(e.currentTarget.getAttribute('data-field-id'));
    state.currentUser.fields = state.currentUser.fields.filter(f => f.id !== fieldId);
    
    // If the deleted field was the selected one, select the first field if available
    if (state.selectedFieldId === fieldId) {
        state.selectedFieldId = state.currentUser.fields.length > 0 ? state.currentUser.fields[0].id : null;
        updateCurrentUserSetting('lastSelectedFieldId', state.selectedFieldId);
    }
    
    saveAppData();
    closeDeleteConfirmationModal();
    renderFields(); // Re-render the view
}

// FIX: Add event handlers for the profile page.
function handleEditProfileClick() {
    state.isEditingProfile = true;
    renderProfile();
}

function handleCancelEditProfile() {
    state.isEditingProfile = false;
    renderProfile();
}

function handleSaveProfile(e) {
    e.preventDefault();
    const newBio = (document.getElementById('profile-bio') as HTMLTextAreaElement).value.trim();
    const newPicUrl = (document.getElementById('profile-pic-url') as HTMLInputElement).value.trim();
    const newUnits = (document.querySelector('input[name="preferred-units"]:checked') as HTMLInputElement).value;

    // Update the user object in the global state
    state.currentUser.bio = newBio;
    state.currentUser.profilePicture = newPicUrl;
    state.currentUser.preferredUnits = newUnits;

    // Persist the changes
    saveAppData();

    // Exit edit mode and re-render
    state.isEditingProfile = false;
    renderProfile();
    showToast('Profile updated successfully!', 'success');
}

function handleSaveField(e) {
    e.preventDefault();
    const t = translations[state.lang];
    const isEditMode = state.editingFieldId !== null;
    
    let isValid = true;
    const fieldNameInput = document.getElementById('field-name') as HTMLInputElement;
    const fieldNameError = document.getElementById('field-name-error');
    const validationErrorDiv = document.getElementById('ai-validation-error');
    
    const fieldName = fieldNameInput.value.trim();
    let fieldSizeInFeddans = 0;

    // Reset general error div
    if(validationErrorDiv) {
        validationErrorDiv.classList.add('hidden');
        validationErrorDiv.innerHTML = '';
    }
    
    if(fieldNameError) {
        fieldNameError.classList.add('hidden');
    }

    // Name validation
    if (!fieldName) {
        fieldNameInput.classList.add('border-red-500');
        fieldNameError.textContent = t.fieldNameRequired;
        fieldNameError.classList.remove('hidden');
        isValid = false;
    } else if (!/^[a-zA-Z0-9\s\u0600-\u06FF]+$/.test(fieldName)) {
        fieldNameInput.classList.add('border-red-500');
        fieldNameError.textContent = t.fieldNameInvalid;
        fieldNameError.classList.remove('hidden');
        isValid = false;
    }

    // Size calculation and validation
    if (isEditMode) {
        const fieldSizeInput = document.getElementById('field-size') as HTMLInputElement;
        const fieldSizeError = document.getElementById('field-size-error');
        if(fieldSizeError) fieldSizeError.classList.add('hidden');
        let sizeFromInput = parseFloat(fieldSizeInput.value);
        if (isNaN(sizeFromInput) || sizeFromInput <= 0) {
            fieldSizeInput.classList.add('border-red-500');
            fieldSizeError.textContent = t.fieldSizeInvalid;
            fieldSizeError.classList.remove('hidden');
            isValid = false;
        } else {
             fieldSizeInFeddans = state.currentUser.preferredUnits === 'imperial' ? acresToFeddans(sizeFromInput) : sizeFromInput;
        }
    } else { // New field mode
        const fieldSizeError = document.getElementById('field-size-error');
        if(fieldSizeError) fieldSizeError.classList.add('hidden');

        if (newFieldBoundary && newFieldBoundary.length > 2) {
            const areaInMeters = L.GeometryUtil.geodesicArea(newFieldBoundary.map(p => L.latLng(p[0], p[1])));
            fieldSizeInFeddans = areaInMeters / 4200.83;
        }
        
        if (fieldSizeInFeddans <= 0) {
            fieldSizeError.textContent = t.drawBoundaryPrompt;
            fieldSizeError.classList.remove('hidden');
            isValid = false;
        }
    }

    if (!isValid) return;

    // Check plan limits for new fields
    const FREE_PLAN_LIMIT_FEDDANS = 2.0;
    if (!isEditMode && state.currentUser.plan === 'Free' && fieldSizeInFeddans > FREE_PLAN_LIMIT_FEDDANS) {
        if(validationErrorDiv) {
            const sizeString = displaySize(fieldSizeInFeddans);
            const limitString = displaySize(FREE_PLAN_LIMIT_FEDDANS);
            validationErrorDiv.innerHTML = t.planLimitError
                .replace('{size}', sizeString)
                .replace('{limit}', limitString);
            validationErrorDiv.classList.remove('hidden');
        }
        return; // Stop submission
    }

    const fieldData = {
        name: fieldName,
        size: fieldSizeInFeddans,
        crop: (document.getElementById('crop-type') as HTMLSelectElement).value,
        irrigation: (document.getElementById('irrigation-type') as HTMLSelectElement).value,
        plantingDate: (document.getElementById('planting-date') as HTMLInputElement).value,
    };

    if (isEditMode) {
        // Find the field and update it
        const fieldIndex = state.currentUser.fields.findIndex(f => f.id === state.editingFieldId);
        if (fieldIndex > -1) {
            const existingField = state.currentUser.fields[fieldIndex];
            state.currentUser.fields[fieldIndex] = { ...existingField, ...fieldData };
        }
    } else {
        // Add a new field with generated data
        const center = L.polygon(newFieldBoundary).getBounds().getCenter();
        const newField = {
            id: Date.now(),
            ...fieldData,
            location: { lat: center.lat, lng: center.lng },
            boundary: newFieldBoundary,
            ndvi: 0.65 + Math.random() * 0.1, // Start with a reasonable NDVI
            yield: 2.0, // Initial yield guess
            waterSaved: 0,
            carbonSaved: 0,
            // Generate plausible starting history
            ndviHistory: Array(7).fill(0).map((_, i) => (0.60 + i * 0.01 + (Math.random()-0.5)*0.02)),
            moistureHistory: Array(7).fill(0).map((_, i) => (50 + i * 1 + (Math.random()-0.5)*5)),
            yieldHistory: Array(7).fill(2.0),
            // Default weather and NPK
            weather: { current: { temp: 32, condition: 'Sunny', icon: '☀️', precipitation: 5, wind: 15 }, forecast: [{ day: 'Tomorrow', temp: 33, icon: '☀️' }, { day: 'Fri', temp: 34, icon: '☀️' }, { day: 'Sat', temp: 32, icon: '⛅' }] },
            npkLevels: [60, 50, 55],
             evi: 0.55, gci: 4.5, ndre: 0.4, gndvi: 0.6, ndwi: 0.2, msi: 1.1, 
            eviHistory: Array(7).fill(0).map((_, i) => (0.50 + i * 0.01)),
            gciHistory: Array(7).fill(0).map((_, i) => (4.0 + i * 0.1)),
            ndreHistory: Array(7).fill(0).map((_, i) => (0.35 + i * 0.01)),
            gndviHistory: Array(7).fill(0).map((_, i) => (0.55 + i * 0.01)),
            ndwiHistory: Array(7).fill(0).map((_, i) => (0.15 + i * 0.01)),
            msiHistory: Array(7).fill(0).map((_, i) => (1.15 - i * 0.01)),
        };
        state.currentUser.fields.push(newField);
        state.selectedFieldId = newField.id; // Auto-select the new field
    }

    saveAppData();
    closeAddFieldModal();
    renderFields();
}

/**
 * Attaches initial event listeners when the script loads.
 */
function initEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    langSwitcher.addEventListener('click', handleLangSwitch);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(e.currentTarget.getAttribute('data-view'));
        });
    });

    // Close modals when clicking on the background overlay
    [addFieldModal, confirmationModal, newPostModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal === addFieldModal) closeAddFieldModal();
                if (modal === confirmationModal) closeDeleteConfirmationModal();
                if (modal === newPostModal) closeNewPostModal();
            }
        });
    });
}

/**
 * Initializes the application.
 */
function init() {
    loadAppData();
    
    const lastUser = allUsers[state.currentUserEmail];
    if (lastUser) {
        state.currentUser = lastUser;
        applyUserSettings(state.currentUserEmail);
    }
    
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    
    updateUIForUser();
    initEventListeners();
}

// --- APP START ---
init();
