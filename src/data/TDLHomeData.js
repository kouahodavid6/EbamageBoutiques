// 
import { Store, ShoppingBag, CreditCard } from "lucide-react";

export const raisonData = [
    {
        icon: Store,
        title: 'Vitrine professionnelle clé en main',
        description: 'Créez votre boutique en ligne en quelques minutes avec nos templates optimisés pour le mobile.',
    },
    {
        icon: ShoppingBag,
        title: 'Gestion simplifiée des stocks',
        description: 'Suivez vos produits, gérez vos variantes et recevez des alertes de rupture automatiquement.',
    },
    {
        icon: CreditCard,
        title: 'Paiements sécurisés via TDLPay',
        description: 'Acceptez tous les modes de paiement avec notre solution intégrée et sécurisée.',
    },
];


// Témoignages
import Judi from "../assets/images/judi.jpg";
import Emmanuel from "../assets/images/emmanuel.jpg";
import David from "../assets/images/david.jpg";

export const temoignageData = [
    {
        testimonial: "TDL a révolutionné ma façon de vendre. En 3 mois, j'ai doublé mon chiffre d'affaires !",
        avatar: Judi,
        name: 'Judicael Cakpo',
        role: 'Boutique de mode'
    },
    {
        testimonial: "Interface intuitive et support client exceptionnel. Je recommande vivement !",
        avatar: Emmanuel,
        name: 'Emmanuel Bamidélé',
        role: 'Épicerie fine'
    },
    {
        testimonial: "Les outils de gestion sont parfaits pour mon petit commerce. Très facile à utiliser !",
        avatar: David,
        name: 'David Kouaho',
        role: 'Artisanat local'
    }
];