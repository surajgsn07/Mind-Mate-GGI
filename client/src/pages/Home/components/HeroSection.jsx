import { useEffect, useState } from "react";
import InfiniteCarousel from "./verticalMarquee/InfiniteCrousal";

const HeroSection = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const install = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
          setDeferredPrompt(null);
          setIsInstallable(false);
        } else {
          console.log("User dismissed the install prompt");
        }
      } catch (err) {
        console.error("Failed to install the app", err);
      }
    }
  };

  return (
    <div className="flex gap-16 max-h-screen relative">
      <div className="flex flex-col pt-20 flex-1 min-w-xl">
        <h1 className="text-4xl font-bold sm:text-4xl lg:text-5xl ">
          Revolutionizing
          <span className="bg-gradient-to-r from-teal-600 to-teal-800 text-transparent bg-clip-text">
            {" "}
            Education
          </span>{" "}
          with
          <span className="bg-gradient-to-r from-teal-600 to-teal-800 text-transparent bg-clip-text">
            {" "}
            AI-Powered{" "}
          </span>
          Learning
          <span className=" bg-clip-text"> Solutions </span>
        </h1>
        <p className="mt-10 text-lg  text-gray-600 max-w-4xl">
          Say goodbye to outdated learning! Our cutting-edge digital platform
          offers interactive courses, personalized progress tracking, and smart
          tools to help students and educators achieve more. Elevate your
          education with the power of AI.
        </p>
        <div className="flex items-center flex-wrap md:my-10 my-8 gap-4">
          {/* <a
            href="/login"
            className="hover:opacity-55 bg-gradient-to-r from-teal-600 to-teal-800 text-white py-3 px-4 rounded-md"
          >
            Start for free
          </a> */}
          {isInstallable && (
            <button
              className="py-3 max-sm:my-3 hover:opacity-55 px-4 mx-3 rounded-md border"
              onClick={install}
            >
              Download as App
            </button>
          )}
        </div>
      </div>

      <div className="max-w-xl">
        <InfiniteCarousel />
      </div>
    </div>
  );
};

export default HeroSection;
