import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";
import { useNavigate } from "react-router-dom"; // NEW: Import useNavigate

export const HeroSection = () => {
  const navigate = useNavigate(); // NEW: Initialize useNavigate

  const handleShopNowClick = () => {
    navigate("/"); // Navigate to the main product catalog (homepage)
  };

  const handleViewCollectionsClick = () => {
    navigate("/men"); // UPDATED: Navigate to the Men's Collection page
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fashion Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Premium Fashion
          <br />
          <span className="text-accent">For Everyone</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200">
          Discover the latest trends in men's, women's, and kids' clothing.
          Quality fabrics, modern designs, unbeatable prices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold"
            onClick={handleShopNowClick}
          >
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold"
            onClick={handleViewCollectionsClick}
          >
            View Collections
          </Button>
        </div>

        <div className="mt-12 flex justify-center space-x-8 text-sm text-gray-300">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-accent rounded-full mr-2" />
            Free Shipping Over 3,000
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-accent rounded-full mr-2" />
            30-Day Returns
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-accent rounded-full mr-2" />
            Premium Quality
          </div>
        </div>
      </div>
    </section>
  );
};
