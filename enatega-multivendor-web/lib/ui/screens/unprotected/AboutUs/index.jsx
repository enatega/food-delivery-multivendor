import Image from "next/image";
import OnePara from "@/lib/ui/screen-components/un-protected/TermsConditions/OnePara";

const AboutUsData = [
  {
    number: "1.",
    head: "Our Mission",
    paras: [
      "At Enatega, our mission is to revolutionize the online food delivery experience by empowering local vendors and offering customers a seamless, efficient, and enjoyable way to order food. We connect people with the best flavors in their city—quickly, safely, and reliably.",
    ],
  },
  {
    number: "2.",
    head: "Who We Are",
    paras: [
      "Enatega is a multivendor food delivery platform built to serve both customers and restaurant partners. We provide a powerful and scalable solution where restaurants can sign up, manage their listings, and reach thousands of customers through one centralized platform.",
    ],
  },
  {
    number: "3.",
    head: "What Makes Us Different",
    paras: [
      "Unlike traditional food delivery services, Enatega puts vendors first by offering full control over their restaurant operations. With features like real-time order management, customizable menus, dynamic delivery options, and customer feedback tools, we ensure our partners thrive in a competitive market.",
    ],
  },
  {
    number: "4.",
    head: "Our Technology",
    paras: [
      "Our platform is powered by robust and scalable modern technology. From AI-driven delivery assignment to real-time tracking, we've integrated cutting-edge tools to deliver not just food—but peace of mind. The Enatega stack is designed for performance, scalability, and vendor flexibility.",
    ],
  },
  {
    number: "5.",
    head: "How It Works",
    paras: [],
    list: [
      {
        text: "Customers browse through a wide range of restaurants and cuisines in their area.",
        subList: [],
      },
      {
        text: "Place an order with real-time updates and secure online payments.",
        subList: [],
      },
      {
        text: "Vendors prepare and manage the order through our restaurant portal.",
        subList: [],
      },
      {
        text: "Orders are delivered either by Enatega riders or vendor's own delivery personnel.",
        subList: [],
      },
    ],
  },
  {
    number: "6.",
    head: "Our Commitment",
    paras: [
      "We are committed to transparency, fairness, and inclusivity. Whether you're a small local eatery or a national chain, Enatega offers equal opportunity for growth and exposure. Our team works tirelessly to ensure timely deliveries, great user experience, and constant improvement through feedback.",
    ],
  },
  {
    number: "7.",
    head: "Join Us",
    paras: [
      "Are you a vendor looking to grow your food business? Or a hungry customer looking for your next favorite meal? Enatega is the place for you. Join our growing community and be part of the food delivery future.",
    ],
  },
];

const AboutUs = () => {
  return (
    <div>
      <div className="relative w-screen h-[400px]">
        <Image
          alt="about-us-image"
          src="https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=2000&height=500"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
            About Enatega
          </h1>
        </div>
      </div>

      <div className="w-[90%] mx-auto">
        {AboutUsData.map((item) => (
          <OnePara Para={item} key={item.head} />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
