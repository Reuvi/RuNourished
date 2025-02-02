import React from 'react';
import { ChefHat, Search, Heart, Filter, Github, Linkedin } from 'lucide-react';

const HomePage = () => {
  const developers = [
    {
      name: 'Oluwatomisin Abiola',
      role: 'Full Stack Developer',
      image: '/api/placeholder/150/150',
      github: '#',
      linkedin: '#'
    },
    {
      name: 'Reuvi Israeli',
      role: 'Full Stack Developer',
      image: '/api/placeholder/150/150',
      github: '#',
      linkedin: '#'
    },
    {
      name: 'Krish Kuber',
      role: 'Full Stack Developer',
      image: '/api/placeholder/150/150',
      github: '#',
      linkedin: '#'
    },
    {
      name: 'Ikey Sasson',
      role: 'Full Stack Developer',
      image: '/api/placeholder/150/150',
      github: '#',
      linkedin: '#'
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
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-12 pb-12 text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <img
            src="ru-nourished-logo.svg"
            alt="RU Nourished - Wellness Made Simple"
            className="h-40 mb-8"
          />
        </div>
        <p className="text-xl mb-8" style={{ color: '#4B0082' }}>
          Your personalized journey to healthier eating starts here
        </p>
        <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors duration-300">
          Explore Recipes
        </button>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#4B0082' }}>About RU Nourished</h2>
          <p className="text-lg leading-relaxed" style={{ color: '#4B0082' }}>
            RU Nourished is your ultimate recipe discovery platform, designed to help you find the perfect recipes 
            that match your unique nutritional needs and preferences. Whether you're tracking calories, 
            looking for high-protein meals, or searching for recipes with specific ingredients, our platform 
            makes it easy to discover dishes that align with your health goals.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
            title="Personalized Recommendations"
            description="Get recipe suggestions tailored to your dietary preferences"
          />
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#4B0082' }}>Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((developer, index) => (
              <DeveloperCard key={index} developer={developer} />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#4B0082' }}>
          Start Your Healthy Cooking Journey
        </h2>
        <p className="text-lg mb-8" style={{ color: '#4B0082' }}>
          Join RU Nourished today and discover recipes that match your nutritional goals
        </p>
        <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;