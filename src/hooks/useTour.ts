import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useNavigate } from "react-router-dom";

export const useTour = () => {
  const navigate = useNavigate();

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: '[data-tour="sidebar"]',
          popover: {
            title: 'Welcome to Financegram',
            description: 'Your all-in-one platform for finance career success. Let\'s explore the key features!',
            side: "right",
            align: 'start'
          }
        },
        {
          element: '[data-tour="jobsea"]',
          popover: {
            title: 'JobSea - Smart Job Matching',
            description: 'AI-powered job recommendations tailored to your profile. Find IB positions, optimize your CV, and track companies hiring in your target firms.',
            side: "right",
            align: 'start'
          },
          onHighlighted: () => navigate('/jobsea')
        },
        {
          element: '[data-tour="news"]',
          popover: {
            title: 'News - Financial Market Insights',
            description: 'Curated content from Wall Street Oasis, Expansión, and top finance creators. Stay updated with real-time market commentary.',
            side: "right",
            align: 'start'
          },
          onHighlighted: () => navigate('/news')
        },
        {
          element: '[data-tour="resources"]',
          popover: {
            title: 'Resources - Professional Training',
            description: 'Access industry-standard training: Financial Modeling, Wall Street Prep courses, and now detailed Bulge Bank report analysis.',
            side: "right",
            align: 'start'
          },
          onHighlighted: () => navigate('/resources')
        },
        {
          element: '[data-tour="study"]',
          popover: {
            title: 'Study Assistant - AI Finance Mentor',
            description: 'Get expert answers from our AI mentor who impersonates a veteran finance professional. Perfect for exam prep and concept mastery.',
            side: "right",
            align: 'start'
          },
          onHighlighted: () => navigate('/study')
        },
        {
          element: '[data-tour="community"]',
          popover: {
            title: 'Community - University Networks',
            description: 'Connect with peers from 50+ universities globally. Join regional channels, explore institutions on the interactive map.',
            side: "right",
            align: 'start'
          },
          onHighlighted: () => navigate('/community')
        },
        {
          element: '[data-tour="settings"]',
          popover: {
            title: 'Settings - Personalization',
            description: 'Customize your preferences, connect LinkedIn, update your career goals, and manage notifications.',
            side: "right",
            align: 'start'
          },
          onHighlighted: () => navigate('/settings')
        },
        {
          popover: {
            title: 'Ready to Explore!',
            description: 'You\'re all set! Start building your finance career with Financegram. Click "Start Tutorial" anytime from the help menu.',
          }
        }
      ],
      onDestroyed: () => {
        navigate('/jobsea');
      }
    });

    driverObj.drive();
  };

  return { startTour };
};
