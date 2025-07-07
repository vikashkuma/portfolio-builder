import { motion } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';

const Preview = () => {
  const { portfolio } = usePortfolioStore();

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-foreground">
        <p className="text-foreground/60">Start building your portfolio to see a preview</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-background text-foreground"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Preview</h2>
        <div className="flex space-x-2">
          <button className="p-2 text-foreground/60 hover:text-blue-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button className="p-2 text-foreground/60 hover:text-blue-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <button className="p-2 text-foreground/60 hover:text-blue-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            {portfolio.about?.name || 'Your Name'}
          </h3>
          <p className="text-lg text-foreground/60">
            {portfolio.about?.role || 'Your Role'}
          </p>
          <p className="text-foreground/60">{portfolio.about?.bio || 'Your Bio'}</p>
        </div>

        {/* Experience Section */}
        {portfolio.experiences?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Experience</h3>
            {portfolio.experiences.map((exp, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-foreground">{exp.company}</h4>
                <p className="text-foreground/60">{exp.position}</p>
                <p className="text-sm text-foreground/50">
                  {exp.startDate} - {exp.endDate}
                </p>
                <p className="text-foreground/60">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {portfolio.skills?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {portfolio.contact && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <p className="text-foreground/60">{portfolio.contact.email}</p>
              {portfolio.contact.phone && (
                <p className="text-foreground/60">{portfolio.contact.phone}</p>
              )}
              {portfolio.contact.linkedin && (
                <p className="text-foreground/60">{portfolio.contact.linkedin}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Preview; 