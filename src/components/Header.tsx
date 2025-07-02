interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-6 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700">{title}</h1>
      <h2 className="text-lg md:text-xl text-gray-600 mt-1">{subtitle}</h2>
    </header>
  );
};
