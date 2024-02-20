import MainFeatures from "../../components/Landing/MainFeatures";
import Footer from "../../components/Landing/Footer";
import Header from "../../components/Landing/Header";
import ThemeSelect from "../../components/Landing/ThemeSelect";

const Landing = () => {
  return (
    <div className="theme-props-container flex flex-col overflow-y-auto h-full">
      <Header />
      <main>
        <ThemeSelect />
        <MainFeatures />
        <Footer />
      </main>
    </div>
  );
};

export default Landing;
