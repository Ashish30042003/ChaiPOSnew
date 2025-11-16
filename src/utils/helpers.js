import React from 'react';
import { 
  Coffee, Pizza, Sandwich, Cake, IceCream, Donut, Croissant, Soup, 
  Cookie, CupSoda, Utensils, Package 
} from 'lucide-react';

export const getItemIcon = (name) => {
  if (!name) return <Package size={20} />;
  const n = name.toLowerCase();
  
  if (n.includes('pizza')) return <Pizza size={20} />;
  if (n.includes('burger') || n.includes('sandwich') || n.includes('bun') || n.includes('pav')) return <Sandwich size={20} />;
  if (n.includes('cake') || n.includes('pastry') || n.includes('brownie') || n.includes('muffin') || n.includes('cream roll')) return <Cake size={20} />;
  if (n.includes('ice') || n.includes('cream') || n.includes('kulfi') || n.includes('dessert')) return <IceCream size={20} />;
  if (n.includes('donut') || n.includes('vada') || n.includes('doughnut') || n.includes('samosa') || n.includes('kachori') || n.includes('pattie')) return <Donut size={20} />; 
  if (n.includes('puff') || n.includes('croissant')) return <Croissant size={20} />;
  if (n.includes('soup') || n.includes('maggi') || n.includes('noodle') || n.includes('pasta') || n.includes('bowl') || n.includes('curry')) return <Soup size={20} />;
  if (n.includes('bisc') || n.includes('cookie') || n.includes('cracker') || n.includes('rusk') || n.includes('khari') || n.includes('toast') || n.includes('bread') || n.includes('maska')) return <Cookie size={20} />;
  if (n.includes('lassi') || n.includes('shake') || n.includes('juice') || n.includes('soda') || n.includes('cold') || n.includes('water') || n.includes('mojito') || n.includes('coke') || n.includes('pepsi') || n.includes('drink') || n.includes('milk')) return <CupSoda size={20} />;
  if (n.includes('snack') || n.includes('snak') || n.includes('chaat') || n.includes('bhel') || n.includes('roll') || n.includes('fry') || n.includes('fries') || n.includes('momos') || n.includes('meal') || n.includes('thali') || n.includes('poha') || n.includes('upma') || n.includes('breakfast')) return <Utensils size={20} />;
  if (n.includes('coffee') || n.includes('coffe') || n.includes('espresso') || n.includes('latte') || n.includes('cappuccino') || n.includes('mocha')) return <Coffee size={20} />;
  if (n.includes('chai') || n.includes('tea') || n.includes('kadha') || n.includes('hot')) return <Coffee size={20} />;

  return <Package size={20} />; 
};
