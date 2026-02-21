import { useEffect, useState } from "react";
import { Sprout, Leaf, Award, Flower, ArrowDown, ArrowRight, ArrowUpRight, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null); // No FAQ is initially open

  
  // FAQ data
  const faqData = [
    {
      question: "How do I prepare my soil for planting?",
      answer: "Preparing soil involves testing pH levels, removing weeds, adding organic matter like compost, and ensuring proper drainage. It's essential to till the soil to the appropriate depth and ensure good aeration for optimal plant growth."
    },
    {
      question: "What are the key factors for successful crop rotation?",
      answer: "Successful crop rotation requires planning different crop families in sequence, considering soil nutrients, disease prevention, and pest management. Key factors include varying root depths, alternating nitrogen-fixing and nitrogen-consuming plants, and timing rotations properly."
    },
    {
      question: "What is organic farming, and how does it differ from conventional farming?",
      answer: "Conventional farming uses chemical fertilizers to promote plant growth, while organic farming employs manure and compost to fertilize the soil. Conventional farming sprays pesticides to get rid of pests, while organic farmers turn to insects and birds."
    },
    {
      question: "How can I control weeds effectively without harming my crops?",
      answer: "Effective weed control includes mulching, hand weeding, using cover crops, proper spacing between plants, and implementing crop rotation. Organic herbicides and mechanical cultivation are also effective methods that don't harm your main crops."
    },
    {
      question: "What are the benefits of using cover crops?",
      answer: "Cover crops improve soil health by preventing erosion, adding organic matter, fixing nitrogen, suppressing weeds, and enhancing soil structure. They also provide habitat for beneficial insects and help break pest and disease cycles."
    },
    {
      question: "How do I manage irrigation efficiently to conserve water?",
      answer: "Efficient irrigation involves using drip systems, monitoring soil moisture, watering during cooler hours, mulching to reduce evaporation, and choosing drought-resistant varieties. Smart irrigation systems and proper scheduling can significantly reduce water usage."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }

    // Initialize AOS animations
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic'
      });
    }
  }, [navigate]);

  return (
    <div className="scroll-smooth overflow-x-hidden w-full mobile-safe-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-vanilla/60 via-arylide-yellow/20 to-vanilla/40 w-full max-w-full">
        <div className="max-w-6xl mx-auto text-center relative z-10" data-aos="fade-up">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight font-semibold text-gray-900 tracking-tight mb-4 sm:mb-6">
            Cultivating A 
            <span className="inline-flex items-center justify-center align-middle mx-1 sm:mx-2 h-8 w-16 sm:h-12 sm:w-24 md:h-16 md:w-32 rounded-full overflow-hidden border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop" 
                alt="Hands holding plant" 
                className="w-full h-full object-cover"
              />
            </span>
            Sustainable Future
            <br className="hidden sm:block" />
            <span className="block sm:inline">Through Modern Agriculture</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base mb-8 sm:mb-10 leading-relaxed px-4 sm:px-0">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={scrollToFeatures}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-transform duration-300 hover:scale-110 shadow-lg shadow-green-600/20 cursor-pointer"
            >
              <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid / Features */}
      <section id="features" className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-b from-vanilla/40 to-arylide-yellow/10 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full">
          
          {/* Left Card: Green */}
          <div className="md:col-span-4 bg-green-600 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px] sm:min-h-[400px] group" data-aos="fade-up" data-aos-delay="100">
            {/* Image Overlay */}
            <img 
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700" 
              alt="Farmer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 to-transparent"></div>
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 tracking-tight">Cultivating Growth Through Modern Agriculture</h3>
              <p className="text-green-100 text-xs leading-relaxed mb-4 sm:mb-6 opacity-80">There are many variations of passages of Lorem Ipsum available, but the majority.</p>
              <a href="#" className="inline-flex items-center text-sm font-medium hover:gap-2 transition-all">
                Learn More <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Middle Column: Quality Products with 2 sub-sections */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
            <div className="flex-1 bg-gradient-to-br from-vanilla to-arylide-yellow/30 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-jonquil/20 min-h-[180px] sm:min-h-auto" data-aos="fade-up" data-aos-delay="200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-green-600">
                <Award className="w-full h-full stroke-1" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Quality Products</h3>
              <p className="text-gray-500 text-xs max-w-[200px]">There are many variations of passages available.</p>
              <button className="mt-3 sm:mt-4 bg-green-600 text-white text-xs px-4 py-2 rounded-full hover:bg-green-700 transition">Learn More</button>
            </div>
            <div className="h-[150px] sm:h-[200px] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden relative" data-aos="fade-up" data-aos-delay="300">
              <img 
                src="/images/farmland.jpg" 
                className="w-full h-full object-cover" 
                alt="Agriculture"
              />
            </div>
          </div>

          {/* Right Card: Natural Farming with Background Image */}
          <div className="md:col-span-4 bg-green-600 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px] sm:min-h-[400px] group" data-aos="fade-up" data-aos-delay="400">
            {/* Background Image */}
            <img 
              src="/images/farmland.jpg" 
              className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700" 
              alt="Natural Farming"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 to-transparent"></div>
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 tracking-tight">Natural Farming</h3>
              <p className="text-green-100 text-xs leading-relaxed mb-4 sm:mb-6 opacity-80">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</p>
              <a href="#" className="inline-flex items-center text-sm font-medium hover:gap-2 transition-all">
                Learn More <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-arylide-yellow/20 via-vanilla to-vanilla/60 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12" data-aos="fade-up">
            <div className="max-w-xl">
              <span className="text-yellow-500 font-semibold text-xs tracking-wider uppercase mb-2 block">About Us</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
                Cultivating a Future of 
                Sustainable Agriculture <Leaf className="inline w-6 h-6 sm:w-8 sm:h-8 text-green-600 ml-2" />
              </h2>
            </div>
            <div className="max-w-md mt-6 md:mt-0 w-full md:w-auto">
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
              </p>
              <a href="#" className="text-green-600 font-medium text-sm flex items-center hover:gap-2 transition-all">
                Learn More <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden h-[250px] sm:h-[400px] md:h-[500px] relative w-full" data-aos="zoom-in">
            <img 
              src="/images/about-us.jpg" 
              alt="Watering Can" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 bg-vanilla/40 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {/* Stat 1 */}
          <div className="bg-gradient-to-br from-vanilla to-arylide-yellow/20 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-jonquil/20" data-aos="fade-up" data-aos-delay="0">
            <h3 className="text-3xl sm:text-4xl font-semibold mb-2 text-gray-900">95%</h3>
            <p className="text-sm font-semibold text-gray-900 mb-2">Clients Satisfaction</p>
            <p className="text-xs text-gray-500 leading-relaxed">There are many variations of passages of Lorem Ipsum available.</p>
          </div>
          {/* Stat 2 */}
          <div className="bg-green-600 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 text-white" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-3xl sm:text-4xl font-semibold mb-2">100+</h3>
            <p className="text-sm font-semibold mb-2">Farmers in the farms</p>
            <p className="text-xs text-green-100 leading-relaxed opacity-80">There are many variations of passages of Lorem Ipsum available.</p>
          </div>
          {/* Stat 3 */}
          <div className="bg-gradient-to-br from-vanilla to-arylide-yellow/20 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-jonquil/20" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-3xl sm:text-4xl font-semibold mb-2 text-gray-900">400+</h3>
            <p className="text-sm font-semibold text-gray-900 mb-2">Total Clients</p>
            <p className="text-xs text-gray-500 leading-relaxed">There are many variations of passages of Lorem Ipsum available.</p>
          </div>
          {/* Stat 4 */}
          <div className="bg-gradient-to-br from-vanilla to-arylide-yellow/20 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-jonquil/20" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-3xl sm:text-4xl font-semibold mb-2 text-gray-900">100%</h3>
            <p className="text-sm font-semibold text-gray-900 mb-2">Fresh Food</p>
            <p className="text-xs text-gray-500 leading-relaxed">There are many variations of passages of Lorem Ipsum available.</p>
          </div>
        </div>
      </section>

      {/* Comprehensive Offerings */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-arylide-yellow/10 to-vanilla/50 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12" data-aos="fade-up">
            <span className="text-yellow-500 font-semibold text-xs tracking-wider uppercase mb-2 inline-flex items-center gap-1">
              Why Choose Us <Sprout className="w-4 h-4" />
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">Comprehensive Agricultural Offerings</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full">
            {/* Left Image */}
            <div className="h-60 sm:h-80 lg:h-96 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden" data-aos="fade-right">
              <img 
                src="/images/why-choose1.jpg" 
                className="w-full h-full object-cover" 
                alt="Farmer in field"
              />
            </div>
            
            {/* Middle Text & Boxes */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="bg-white p-3 sm:p-4 rounded-lg" data-aos="fade-up">
                <p className="text-xs text-gray-500 leading-relaxed">Discover a wide range of high-quality farm products designed to enhance your agricultural endeavors. We take pride in offering innovative solutions that help you achieve optimal results.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                <div className="bg-green-700 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col justify-center text-white" data-aos="zoom-in">
                  <h4 className="text-2xl sm:text-3xl font-bold mb-1">25 Years</h4>
                  <p className="text-xs opacity-90">Of Experience In Agriculture.</p>
                </div>
                <div className="bg-gradient-to-br from-jonquil to-arylide-yellow rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col justify-center text-white shadow-md" data-aos="zoom-in" data-aos-delay="100">
                  <h4 className="text-lg sm:text-xl font-bold mb-1">100%</h4>
                  <p className="text-xs opacity-90">Natural Healthy Food</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="h-60 sm:h-80 lg:h-96 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden" data-aos="fade-left">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" 
                className="w-full h-full object-cover" 
                alt="Fields"
              />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full">
            {/* Large Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-vanilla to-arylide-yellow/30 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 relative overflow-hidden border border-jonquil/20" data-aos="fade-up">
              <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="bg-green-600 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white mb-4 absolute top-0 right-0">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <Flower className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mb-4 sm:mb-6 stroke-1" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Explore Our Farm Products</h3>
                <p className="text-xs text-gray-500 max-w-xs">Discover a wide range of high-quality farm products designed to enhance.</p>
              </div>
            </div>

            {/* List Items */}
            <div className="md:col-span-8 bg-gradient-to-r from-vanilla/80 to-arylide-yellow/10 border border-jonquil/20 rounded-[2rem] p-8 flex flex-col justify-center" data-aos="fade-up" data-aos-delay="100">
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">1</span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Seeds and Seedlings</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-md">Choose from a variety of premium seeds and healthy seedlings to ensure a strong start.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">2</span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Fertilizers and Soil Enhancers</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-md">Enhance soil fertility and promote healthy plant growth with our range of organic fertilizers.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">3</span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Crop Protection</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-md">Safeguard your crops from pests and diseases with our proven range of environmentally friendly solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section (Beige) */}
      <section id="products" className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-br from-arylide-yellow/20 via-vanilla to-vanilla/80 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <span className="text-yellow-500 font-semibold text-xs tracking-wider uppercase mb-4 block">Our Product Details</span>
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
            
            <div className="lg:w-1/2" data-aos="fade-right">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6 sm:mb-8">
                We're Top Agriculture &  Organic Enterprises
              </h2>
              <div className="rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden h-[250px] sm:h-[400px] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Farmer Portrait"
                />
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                  <button className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2" data-aos="fade-left">
              <p className="text-sm text-gray-500 mb-6 sm:mb-8">Discover a wide range of high-quality farm products designed to enhance your agricultural endeavors. We take pride in offering.</p>
              <Link to="/register">
                <button className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-full text-xs font-semibold hover:bg-gray-900 hover:text-white transition-colors mb-6 sm:mb-10">
                  Get Started
                </button>
              </Link>

              <div className="space-y-4 sm:space-y-6">
                {/* Product Item */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/80 hover:bg-vanilla/60 rounded-xl sm:rounded-2xl transition-colors border border-jonquil/10 shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                    <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Organic Corn</h4>
                    <p className="text-xs text-gray-500 mt-1">Natus error volupt ateme accus antium dolores.</p>
                  </div>
                </div>
                {/* Product Item */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/80 hover:bg-vanilla/60 rounded-xl sm:rounded-2xl transition-colors border border-jonquil/10 shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Organic Tomato</h4>
                    <p className="text-xs text-gray-500 mt-1">Explore our range of tractors and attachments designed.</p>
                  </div>
                </div>
                {/* Product Item */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/80 hover:bg-vanilla/60 rounded-xl sm:rounded-2xl transition-colors border border-jonquil/10 shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Fruits & Meats</h4>
                    <p className="text-xs text-gray-500 mt-1">Explore our range of tractors and attachments designed.</p>
                  </div>
                </div>
                {/* Product Item */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/80 hover:bg-vanilla/60 rounded-xl sm:rounded-2xl transition-colors border border-jonquil/10 shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Fresh Orange</h4>
                    <p className="text-xs text-gray-500 mt-1">Explore our range of tractors and attachments designed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-vanilla/80 to-arylide-yellow/20 w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12" data-aos="fade-up">
            <span className="text-yellow-500 font-semibold text-xs tracking-wider uppercase mb-2 inline-flex items-center gap-1">
              FAQ <Leaf className="w-4 h-4" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">Frequently Answer And Question</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`group rounded-xl sm:rounded-2xl transition-all duration-300 ease-in-out border ${
                  openFaqIndex === index
                    ? "bg-gradient-to-br from-arylide-yellow/30 to-jonquil/20 border-jonquil/30"
                    : "bg-vanilla/60 hover:bg-arylide-yellow/20 border-jonquil/10"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-4 sm:p-6 text-left"
                >
                  <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <span className={`ml-4 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full flex-shrink-0 transition-all duration-300 ${
                    openFaqIndex === index
                      ? "bg-green-600 text-white transform rotate-180"
                      : "border border-gray-300 group-hover:bg-vanilla transform rotate-0"
                  }`}>
                    {openFaqIndex === index ? (
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    )}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaqIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                    <p className="text-xs leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 pb-4 sm:pb-6 bg-gradient-to-br from-vanilla via-arylide-yellow/20 to-vanilla/60 relative overflow-hidden w-full">
        {/* Floating Leaves (Decor) */}
        <Leaf className="absolute top-6 left-6 sm:top-10 sm:left-10 text-green-800/10 w-12 h-12 sm:w-20 sm:h-20 -rotate-45" />
        <Leaf className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-green-800/10 w-16 h-16 sm:w-32 sm:h-32 rotate-12" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          {/* CTA Card */}
          <div className="bg-gradient-to-r from-arylide-yellow/40 to-jonquil/30 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 text-center mb-12 sm:mb-20 relative overflow-hidden border border-jonquil/20 shadow-xl" data-aos="zoom-in">
            {/* Decorative blurred circles */}
            <div className="absolute top-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-green-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Sprout className="text-yellow-600 w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight">Become a Part of Our Growing Community!</h2>
              <p className="text-gray-600 text-xs max-w-lg mb-6 sm:mb-8 leading-relaxed">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
              <Link to="/register">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all shadow-lg shadow-green-600/20">Get Started</button>
              </Link>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 border-b border-gray-200/50 pb-8 sm:pb-12 w-full">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Sprout className="text-green-700 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="font-bold text-base sm:text-lg text-gray-900">AgriSmart</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 sm:mb-6">20 W, New York, United States. House Name: Khangali Pal.</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                  <span>📞</span>
                </div>
                +096541565
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 sm:mb-6">Company Profile</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs text-gray-600">
                <li><a href="#" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About</a></li>
                <li><a href="#" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Help Center</a></li>
                <li><a href="#" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Career</a></li>
                <li><a href="#" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Plans & Pricing</a></li>
                <li><Link to="/contact" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 sm:mb-6">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs text-gray-600">
                <li><a href="#" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Browse AgriSmart</a></li>
                <li><a href="#" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Browse AgriSmart</a></li>
                <li><Link to="/register" className="hover:text-green-700 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Registrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 sm:mb-6">Follow Us</h4>
              <div className="flex gap-2 sm:gap-3">
                <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all text-xs">
                  <span>f</span>
                </a>
                <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all text-xs">
                  <span>i</span>
                </a>
                <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all text-xs">
                  <span>t</span>
                </a>
                <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all text-xs">
                  <span>in</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4 sm:gap-0">
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <a href="#" className="hover:text-gray-900">Terms And Condition</a>
              <span className="w-px h-3 bg-gray-300"></span>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            </div>
            <p className="text-center sm:text-right">© 2026 AgriSmart Company Limited</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
