import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

// import user1 from "../../../assets/profile-pictures/user1.jpg";
// import user2 from "../../../assets/profile-pictures/user2.jpg";
// import user3 from "../../../assets/profile-pictures/user3.jpg";
// import user4 from "../../../assets/profile-pictures/user4.jpg";
// import user5 from "../../../assets/profile-pictures/user5.jpg";
// import user6 from "../../../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Clinics", href: "/all/clinics" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];

export const testimonials = [
  {
    user: "Dr. Emily Ross",
    company: "Sunrise Health Clinic",
    text: "Switching to Clinic Net has been one of the best decisions for our clinic. The platform is user-friendly, and the efficiency it brings to our daily operations allows us to dedicate more time to patient care.",
  },
  {
    user: "Paul Roberts",
    company: "HealthFirst Services",
    text: "Clinic Net's digital innovation is truly remarkable. The automated appointment reminders have drastically reduced our missed appointments, making our scheduling process seamless. Our patients appreciate it, and so do we!",
  },
  {
    user: "Nancy Patel",
    company: "Community Care Center",
    text: "The transition to Clinic Net was smooth and hassle-free. The training and support provided were excellent, and now our entire team is fully onboard and reaping the benefits of this incredible platform.",
  },
  {
    user: "Dr. Liam Thompson",
    company: "Precision Health Institute",
    text: "With Clinic Net, we have seen a noticeable boost in patient satisfaction. The ability to track health records digitally allows us to provide personalized care that our patients love. It's truly revolutionizing our practice!",
  },
  {
    user: "Sophia Williams",
    company: "Family Wellness Clinic",
    text: "The insights provided by Clinic Net have empowered us to make data-driven decisions in our practice. We've improved patient outcomes and streamlined our processes, all thanks to this fantastic platform!",
  },
  {
    user: "David Lee",
    company: "Optimal Health Solutions",
    text: "Clinic Net has enhanced our clinic's operational efficiency tremendously. From electronic patient records to easy appointment management, this platform has become an invaluable asset to our team.",
  },
];

export const features = [
  {
    icon: <PlugZap />,
    text: "Real-Time AI Tutoring & Engagement Analysis",
    description:
      "Get instant AI-powered learning assistance and engagement tracking to optimize student performance.",
  },
  {
    icon: <ShieldHalf />,
    text: "Advanced Security",
    description:
      "Protect student data and privacy with enterprise-grade security measures.",
  },
  {
    icon: <BatteryCharging />,
    text: "Emergency Alerts",
    description:
      "Instant notification system for campus safety and urgent communications.",
  },
  {
    icon: <BotMessageSquare />,
    text: "Smart Classroom Management",
    description:
      "Effortlessly manage classes, assignments, and student interactions in one platform.",
  },
  {
    icon: <Fingerprint />,
    text: "Personalized Learning Paths",
    description:
      "Adaptive learning technology that customizes content to each student's needs.",
  },
  {
    icon: <GlobeLock />,
    text: "Mindfulness & Focus Tools",
    description:
      "Integrated meditation and focus exercises to enhance learning concentration.",
  },
];

export const checklistItems = [
  {
    title: "Efficient Patient Record Management",
    description:
      "Manage and access patient records digitally to streamline clinic operations.",
  },
  {
    title: "Seamless Appointment Scheduling",
    description: "Schedule, modify, and manage patient appointments with ease.",
  },
  {
    title: "Enhanced Security Features",
    description:
      "Protect sensitive patient data with advanced security protocols.",
  },
  {
    title: "Instant Data Sharing",
    description:
      "Share patient information quickly to improve communication and care.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "Rs 0",
    features: [
      "Basic record management",
      "Appointment scheduling",
      "Standard analytics",
    ],
  },
  {
    title: "Pro",
    price: "Rs 3000",
    features: [
      "Advanced record management",
      "Priority support",
      "Enhanced analytics",
      "Additional security features",
    ],
  },
  {
    title: "Enterprise",
    price: "Rs 20000",
    features: [
      "Full record management suite",
      "Dedicated support",
      "Custom analytics solutions",
      "Advanced security and compliance",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
