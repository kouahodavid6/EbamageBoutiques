import Navbar from "./components/Navbar";

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Section from "./components/Section";
import EnteteSections from "./components/EnteteSections";

import Card from "./components/Card";
import CartesRaisons from "./components/CartesRaisons";
import CartesTemoignages from "./components/CartesTemoignages";

import { raisonData } from '../../data/TDLHomeData';
import { temoignageData } from "../../data/TDLHomeData";

import Footer from "./components/Footer";

const Home = () => {

  // Variants pour les animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 100
            }
        }
    };

    const buttonVariants = {
        hover: {
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        tap: { scale: 0.95 }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Section Hero */}
            <section className="bg-gradient-to-br from-pink-50 to-white py-20">
                {/* Contenu principal */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                >
                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                    >
                        Boostez vos ventes avec{' '}
                        <span className="text-pink-500">TDL</span>
                    </motion.h1>
                
                    <motion.p 
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
                    >
                        Une vitrine pro, des clients en plus, et des outils puissants pour développer votre commerce
                    </motion.p>
                
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col items-center justify-center gap-2"
                        initial={{ y: -10 }}
                            animate={{ 
                                y: [0, -15, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                    >
                        <Link
                            to="/inscriptionBoutique"
                        >
                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl"
                            >
                                Créer ma boutique
                                <ArrowRight className="w-6 h-6" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Section Pourquoi nous ? */}
            <Section className="bg-gray-50">
                <EnteteSections 
                    title="Pourquoi choisir TDL ?"
                    text="Des outils simples et efficaces pour faire grandir votre business"
                />

                <Card>
                    {raisonData.map((carte, index) => (
                        <CartesRaisons 
                            key={index}
                            icon={carte.icon}
                            title={carte.title}
                            description={carte.description}
                        />
                    ))}
                </Card>
            </Section>

            {/* Section Témoignages */}
            <Section className="bg-white">
                <EnteteSections 
                    title="Ils nous font confiance"
                    text="Découvrez les témoignages de nos commerçants partenaires"
                />

                <Card>
                    {temoignageData.map((carte, index) => (
                        <CartesTemoignages
                            key={index}
                            testimonial={carte.testimonial}
                            avatar={carte.avatar}
                            name={carte.name}
                            role={carte.role}
                        />
                    ))}
                </Card>
            </Section>

            {/* Section Commerce */}
            <Section className="bg-pink-500 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Prêt à développer votre commerce ?
                </h2>
                <p className="text-xl text-pink-100 mb-8">
                    Rejoignez des milliers de commerçants qui ont choisi TDL
                </p>
                <Link
                    to="/inscriptionBoutique"
                >
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-white hover:bg-gray-100 text-pink-500 text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl"
                    >
                        Commencer maintenant
                    </motion.button>
                </Link>
            </Section>

            <Footer />
        </div>
    );
};

export default Home;