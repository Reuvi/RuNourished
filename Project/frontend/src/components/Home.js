import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Filter, Github, Linkedin } from 'lucide-react';

const HomePage = () => {
  const developers = [
    {
      name: 'Oluwatomisin Abiola',
      role: 'Team Member',
      image: '/images/tomisin.webp',
      github: 'https://github.com/oluwatomisinabiola',
      linkedin: 'https://www.linkedin.com/in/oluwatomisin-abiola'
    },
    {
      name: 'Reuvi Israeli',
      role: 'Team Member',
      image: '/images/reuvi.webp',
      github: 'https://github.com/Reuvi',
      linkedin: 'https://www.linkedin.com/in/reuven-israeli-7a865520b/'
    },
    {
      name: 'Krish Kuber',
      role: 'Team Member',
      image: '/images/krish.jpg',
      github: 'https://github.com/KrishKuber',
      linkedin: 'https://www.linkedin.com/in/krish-kuber-324a932a1'
    },
    {
      name: 'Ikey Sasson',
      role: 'Team Member',
      image: '/images/ikeysasson.jpg',
      github: 'https://github.com/IsaacSasson',
      linkedin: 'https://www.linkedin.com/in/isaac-sasson/'
    }
  ];

  const Feature = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg transition-transform duration-300 hover:transform hover:scale-105">
      <div className="p-3 rounded-full bg-purple-100 mb-4">
        <Icon size={24} style={{ color: '#4B0082' }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: '#4B0082' }}>{title}</h3>
      <p className="text-center" style={{ color: '#4B0082' }}>{description}</p>
    </div>
  );

  const DeveloperCard = ({ developer }) => (
    <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg transition-transform duration-300 hover:transform hover:scale-105">
      <img
        src={developer.image}
        alt={developer.name}
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />
      <h3 className="text-lg font-semibold mb-1" style={{ color: '#4B0082' }}>{developer.name}</h3>
      <p className="text-sm mb-3" style={{ color: '#4B0082' }}>{developer.role}</p>
      <div className="flex space-x-3">
        <a href={developer.github} className="text-purple-600 hover:text-purple-800">
          <Github size={20} />
        </a>
        <a href={developer.linkedin} className="text-purple-600 hover:text-purple-800">
          <Linkedin size={20} />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{
           background: `radial-gradient(circle at 70% 20%, #9370DB 0%, transparent 25%),
                        radial-gradient(circle at 30% 80%, #9370DB 0%, transparent 25%),
                        linear-gradient(45deg, #A7E8D0, #ADD8E6, #B8B5E1, #F5E6CA)`
         }}>
      
      {/* Combined Hero & About Section */}
      <section className="py-12 bg-white bg-opacity-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <img
              src="/images/logo_light_background.png"
              alt="RU Nourished"
              className="h-20"
            />
          </div>
          <p className="text-2xl text-darkerPurple mb-4">
            Welcome to RU Nourished – Your journey to healthy recipes starts here.
          </p>
          <p className="text-lg text-darkerPurple max-w-3xl mx-auto">
            RU Nourished is an innovative platform that leverages artificial intelligence to transform your culinary experience. Generate unique recipes based on your preferred ingredients and nutritional facts, discover the ingredients behind your favorite dishes, or simply upload an image and let our AI detect the ingredients for you. Embrace a personalized journey to healthier eating.
          </p>
        </div>
      </section>

      {/* Features Section: Transparent overlay */}
      <section className="py-16 bg-white bg-opacity-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={Search}
              title="Ingredient-Based Search"
              description="Find recipes based on ingredients you have or want to use"
            />
            <Feature
              icon={Filter}
              title="Nutritional Filtering"
              description="Filter recipes by calories, protein, carbs, and more"
            />
            <Feature
              icon={Heart}
              title="AI-Driven Insights"
              description="Generate recipes, extract ingredients from recipes or images"
            />
          </div>
        </div>
      </section>

      {/* Meet Our Team Section: Transparent overlay */}
      <section className="py-12 bg-white bg-opacity-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-darkerPurple">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((developer, index) => (
              <DeveloperCard key={index} developer={developer} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section: Less transparent overlay for strong contrast */}
      <section className="py-8 bg-darkerPurple bg-opacity-90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Start Your Healthy Cooking Journey
          </h2>
          <p className="text-lg mb-6 text-white">
            Join RU Nourished today and explore recipes tailored to your nutritional needs.
          </p>
          <Link to="/recipe/generate">
            <button className="bg-white text-darkerPurple px-8 py-3 rounded-full hover:bg-gray-200 transition-colors duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;