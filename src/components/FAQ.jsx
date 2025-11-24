import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQ({ items }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-orange-200 bg-orange-50/50' : 'border-slate-200 bg-white hover:border-orange-200'
                        }`}
                >
                    <button
                        className="w-full flex justify-between items-center p-6 text-left"
                        onClick={() => toggleFAQ(index)}
                    >
                        <span className={`font-bold text-lg ${openIndex === index ? 'text-orange-800' : 'text-slate-800'}`}>
                            {item.question}
                        </span>
                        <span className={`ml-4 p-1 rounded-full transition-colors ${openIndex === index ? 'bg-orange-200 text-orange-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                        </span>
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                            {item.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
