# RU Nourished

RU Nourished is an innovative platform that leverages artificial intelligence to transform your culinary experience. Whether you're looking to create delicious recipes from the ingredients you have on hand or generate a complete ingredient list based on a recipe name or image, RU Nourished is designed to help you cook smarter and reduce food waste.

## Features

- **User Authentication:** Standard and guest login options for seamless access.
- **Recipe Generation:** AI-powered recipe creation that transforms your available ingredients into cohesive, nutritionally balanced meals.
- **Cookbook Management:** Easily save and organize your favorite recipes in your personal digital cookbook.
- **Responsive Design:** Fully optimized for both desktop and mobile devices, ensuring you can access your recipes anytime, anywhere.

## How It Works

- **Smart Ingredient Analysis:**  
  When you input ingredients (e.g., peanut butter, jelly, bread, and chicken), our custom KNN and vectorizer model analyzes the context to determine which ingredients belong together. For example, it identifies that peanut butter, jelly, and bread naturally group together while filtering out ingredients that don't fit (like chicken). This refined input is then sent to the Hugging Face API, ensuring that the generated recipes are both logical and nutritionally balanced.
  
- **Nutritional Customization:**  
  Tailor your recipes to meet specific dietary goals by adjusting macronutrient profiles such as protein, carbohydrates, and fats.

- **Image & Text Inputs:**  
  Generate recipes effortlessly by simply uploading an image or typing a description. Our platform uses advanced image recognition (YOLOv8) and natural language processing (Hugging Face) to bring your culinary ideas to life.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js with Express (primary), Flask for AI operations
- **AI/ML:** SciKit-Learn, YOLOv8 (image recognition), Hugging Face (NLP)
- **Infrastructure:** MongoDB, AWS, Cloudflare
- **Security:** JWT authentication, HTTPS encryption

## About the Project

Developed during the HackRU Spring 2025 Hackathon, RU Nourished is more than just a recipe generator—it’s a step towards minimizing food waste and promoting healthier eating habits, especially among college students. The project earned awards for **Best Security Hack** (sponsored by Nord Security) and **Best Use of Gen AI** (sponsored by Major League Hacking).

The hackathon was an intensive 24-hour experience that challenged our team to integrate multiple technologies in a short period. Moving forward, we plan to expand the platform with features such as meal planning, community recipe sharing, and integration with grocery stores for ingredient recommendations and ordering.

## Get Started

Ready to revolutionize your culinary experience? Visit [RUNourished.co](https://RUNourished.co) to try out our AI-powered recipe generation and start cooking smarter today!

---

We welcome contributions and feedback as we continue to enhance RU Nourished. Feel free to open issues or submit pull requests to help us improve the platform. Happy cooking!
