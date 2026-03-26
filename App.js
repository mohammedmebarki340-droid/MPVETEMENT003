import React, { useState, useEffect } from 'react';
import './App.css';

const PRESET_COLORS = [
  { name: 'أسود', code: '#000000' },
  { name: 'أبيض', code: '#ffffff' },
  { name: 'أحمر', code: '#ef4444' },
  { name: 'أزرق', code: '#3b82f6' },
  { name: 'أخضر', code: '#22c55e' },
  { name: 'رمادي', code: '#64748b' },
  { name: 'بني', code: '#78350f' },
  { name: 'كحلي', code: '#1e3a8a' }
];

const DELIVERY_FEES = {
  home: 600,
  office: 400
};

function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalSize, setModalSize] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);

  const [newProd, setNewProd] = useState({
    name: '',
    price: '',
    image: '',
    sizes: 'S, M, L, XL',
    selectedColors: ['#000000']
  });

  const [deliveryType, setDeliveryType] = useState('home');

  const slides = [
    { url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200", title: "مجموعة الصيف الجديدة", sub: "اكتشف الأناقة العصرية" },
    { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200", title: "تخفيضات تصل لـ 30%", sub: "لفترة محدودة فقط" },
    { url: "https://images.unsplash.com/photo-1472417583565-62e7bdeda490?w=1200", title: "جودة بريميوم", sub: "صنعت لتدوم طويلاً" }
  ];

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('mp_products_vsc_v3');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'تيشيرت بريميوم قطن', price: 2500, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', sizes: ['S', 'M', 'L', 'XL'], colors: ['#000000', '#ffffff', '#3b82f6'] },
      { id: 2, name: 'هودي شتوي عصري', price: 4500, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', sizes: ['M', 'L', 'XL'], colors: ['#64748b', '#000000'] },
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('mp_orders_vsc_v3');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('mp_products_vsc_v3', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('mp_orders_vsc_v3', JSON.stringify(orders)); }, [orders]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalSize(product.sizes?.[0] || '');
    setModalColor(product.colors?.[0] || '');
    setModalQuantity(1);
  };

  const addToCart = (product, size, color, qty) => {
    setCart([...cart, { ...product, selectedSize: size, selectedColor: color, quantity: qty, cartId: Date.now() }]);
    setSelectedProduct(null);
  };

  const subtotal = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
  const shippingFee = DELIVERY_FEES[deliveryType];
  const finalTotal = subtotal + shippingFee;

  return (
    <div className="min-h-screen relative text-right" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-slate-900">MP VÊTEMENTS</span>
              <span className="text-[10px] font-bold text-orange-600 tracking-widest uppercase">By Amine</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button onClick={() => setIsLoggedIn(false)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">خروج</button>
            ) : (
              <button onClick={() => setView('login')} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">دخول</button>
            )}
            <button onClick={() => setView('cart')} className="relative p-3 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition-all">
              سلة ({cart.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'home' && (
          <div>
            <h1 className="text-3xl font-black mb-6 text-slate-900">مرحبا بكم في MP VÊTEMENTS</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow p-4">
                  <img src={product.image} className="w-full h-48 object-cover rounded-lg mb-2" />
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-orange-600 font-black">{product.price.toLocaleString()} د.ج</p>
                  <button onClick={() => openModal(product)} className="bg-slate-900 text-white px-4 py-2 rounded-xl mt-2 hover:bg-orange-600 transition-all">شراء</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full">
              <h3 className="text-xl font-black mb-2">{selectedProduct.name}</h3>
              <p className="text-orange-600 font-bold mb-4">{selectedProduct.price.toLocaleString()} د.ج</p>
              <button onClick={() => addToCart(selectedProduct, modalSize, modalColor, modalQuantity)} className="bg-orange-600 text-white px-4 py-2 rounded-xl w-full">إضافة للسلة</button>
              <button onClick={() => setSelectedProduct(null)} className="mt-2 text-red-500 w-full">إلغاء</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;