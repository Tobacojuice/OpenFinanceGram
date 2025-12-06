import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center space-y-6 border-2 border-foreground p-12">
        <h1 className="text-8xl mono">404</h1>
        <p className="text-2xl mono">ERROR: PAGE NOT FOUND</p>
        <a href="/" className="text-primary hover:text-foreground mono inline-block text-xl">
          &gt; RETURN TO HOME
        </a>
      </div>
    </div>
  );
};

export default NotFound;
