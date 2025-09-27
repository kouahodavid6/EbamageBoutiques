import Navbar from "./components/Navbar";
import { ArrowRight, Store, Sparkles, TrendingUp } from "lucide-react";
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

  // Variants pour les animations (conservées)
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

    const floatingVariants = {
        animate: {
            y: [0, -15, 0],
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50">
            <Navbar />

            {/* Section Hero */}
            <section className="relative bg-gradient-to-br from-emerald-100/80 via-green-50 to-emerald-50 py-20 overflow-hidden">
                {/* Effets de fond décoratifs */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent"></div>
                <div className="absolute top-10 right-10 w-20 h-20 bg-emerald-300/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 left-10 w-16 h-16 bg-green-300/10 rounded-full blur-xl"></div>
                
                {/* Contenu principal */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                >
                    <motion.div 
                        variants={itemVariants}
                        className="flex justify-center mb-4"
                    >
                        <div className="bg-emerald-100 border border-emerald-200 rounded-full px-4 py-2 flex items-center space-x-2">
                            <Store className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">Solution e-commerce écologic</span>
                        </div>
                    </motion.div>

                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                    >
                        Développez votre commerce{' '}
                        <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">durablement</span>
                    </motion.h1>
                
                    <motion.p 
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-emerald-700/80 mb-8 max-w-3xl mx-auto leading-relaxed"
                    >
                        Une vitrine professionnelle, des outils puissants et une croissance responsable pour votre entreprise
                    </motion.p>
                
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <motion.div
                            variants={floatingVariants}
                            animate="animate"
                        >
                            <Link to="/inscriptionBoutique">
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-200/50 transition-all duration-300"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Créer ma boutique
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </motion.div>
                        
                        <motion.p 
                            variants={itemVariants}
                            className="text-sm text-emerald-600/70 flex items-center"
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Rejoignez +500 commerçants déjà satisfaits
                        </motion.p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Section Pourquoi nous ? */}
            <Section className="bg-gradient-to-b from-white to-emerald-50/30">
                <EnteteSections 
                    title="Pourquoi choisir Ebamage ?"
                    text="Des outils innovants pour une croissance responsable et durable"
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
            <Section className="bg-gradient-to-b from-emerald-50/50 to-white">
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

            {/* Section CTA finale */}
            <Section className="bg-gradient-to-r from-emerald-600 to-green-500 text-center relative overflow-hidden">
                {/* Effets de fond */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent"></div>
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Prêt pour une croissance verte ?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                        Rejoignez la communauté des commerçants qui allient performance et responsabilité écologique
                    </p>
                    <Link to="/inscriptionBoutique">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="bg-white hover:bg-emerald-50 text-emerald-700 text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200"
                        >
                            <div className="flex items-center gap-2">
                                <Store className="w-5 h-5" />
                                Commencer maintenant
                            </div>
                        </motion.button>
                    </Link>
                </motion.div>
            </Section>

            <Footer />
        </div>
    );
};

export default Home;