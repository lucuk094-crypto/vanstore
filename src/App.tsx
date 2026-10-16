import React, { useState, useEffect } from 'react';
import type { TabType, Product, Order, ActivityLog } from './types.ts';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_LOGS } from './data/initialData.ts';
import { Navbar } from './components/Navbar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { CatalogView } from './components/CatalogView.tsx';
import { DetailView } from './components/DetailView.tsx';
import { AdminView } from './components/AdminView.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { ExploreView } from './components/ExploreView.tsx';
import { LiveDemoModal } from './components/LiveDemoModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { FilterModal } from './components/FilterModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ThreeDBackground } from './components/ThreeDBackground.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Device layout mode: 'auto' (fluid responsive), 'laptop' (force wide layout), 'mobile' (device preview frame)
  const [deviceMode, setDeviceMode] = useState<'auto' | 'mobile' | 'laptop'>('auto');

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vanstore_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vanstore_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ORDERS;
  });

  // Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('vanstore_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LOGS;
  });

  // Cart state
  const [cartItems, setCartItems] = useState<Product[]>([
    INITIAL_PRODUCTS[0],
    INITIAL_PRODUCTS[1],
  ]);

  // Modals state
  const [demoProduct, setDemoProduct] = useState<Product | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vanstore_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('vanstore_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('vanstore_logs', JSON.stringify(activityLogs));
    } catch {}
  }, [activityLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleOpenDemo = (product: Product) => {
    setDemoProduct(product);
    setIsDemoOpen(true);
  };

  const handleOpenDemoLink = (url: string) => {
    const matched = products.find((p) => p.demoUrl === url) || products[0];
    setDemoProduct(matched);
    setIsDemoOpen(true);
  };

  const handleStartCheckout = (product: Product) => {
    setCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    setProducts((prev) =>
      prev.map((p) => (p.id === newOrder.productId ? { ...p, salesCount: p.salesCount + 1 } : p))
    );

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      title: 'Order',
      target: newOrder.id,
      detail: 'dikonfirmasi otomatis',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      title: 'Produk Baru',
      target: newProduct.title,
      detail: 'dipublikasikan ke katalog',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Produk dihapus dari keranjang');
  };

  const handleClaimCoupon = () => {
    showToast('Kupon "FLASH50" disalin! Gunakan saat checkout untuk ekstra diskon.');
    setIsCartOpen(true);
  };

  const handleChangeTab = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isForcedMobile = deviceMode === 'mobile';

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#dc2626] selection:text-white relative">
      {/* Realistic 3D Perspective Dot Grid Matrix Background */}
      <ThreeDBackground />

      {/* Top Navbar */}
      <Navbar
        activeTab={selectedProduct ? 'catalog' : activeTab}
        onChangeTab={handleChangeTab}
        cartCount={cartItems.length}
        notificationCount={activityLogs.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        deviceMode={deviceMode}
        onToggleDeviceMode={(mode) => {
          setDeviceMode(mode);
          showToast(
            mode === 'laptop'
              ? 'Mode Layar Laptop Aktif (Grid Penuh)'
              : mode === 'mobile'
              ? 'Mode Bingkai Smartphone Aktif'
              : 'Mode Otomatis Responsif Aktif'
          );
        }}
      />

      {/* Main Content Router with Mobile Frame Simulator Support */}
      <div className={`relative z-10 flex-1 flex justify-center ${isForcedMobile ? 'py-4' : ''}`}>
        <div
          className={`w-full transition-all duration-300 ${
            isForcedMobile
              ? 'max-w-[420px] my-6 rounded-[36px] border-4 border-[#27272a] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(220,38,38,0.2)] overflow-hidden bg-[#0a0a0a] min-h-[844px]'
              : 'w-full'
          }`}
        >
          {/* Simulated Mobile Dynamic Island / Speaker Notch if in forced mobile preview */}
          {isForcedMobile && (
            <div className="w-full flex justify-center pt-2 pb-1 bg-[#0a0a0a]">
              <div className="w-24 h-4 bg-black rounded-full border border-[#27272a] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#18181b] mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>
          )}

          <main className="flex-1">
            {selectedProduct ? (
              <DetailView
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                onOpenDemo={handleOpenDemo}
                onCheckout={handleStartCheckout}
                onShowToast={showToast}
                isForcedMobile={isForcedMobile}
              />
            ) : (
              <>
                {activeTab === 'catalog' && (
                  <CatalogView
                    products={products}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    onOpenDemo={handleOpenDemo}
                    onClaimCoupon={handleClaimCoupon}
                    onOpenFilterModal={() => setIsFilterOpen(true)}
                    isForcedMobile={isForcedMobile}
                  />
                )}

                {activeTab === 'explore' && (
                  <ExploreView
                    products={products}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    onOpenDemo={handleOpenDemo}
                    isForcedMobile={isForcedMobile}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersView
                    orders={orders}
                    onShowToast={showToast}
                    onOpenReceipt={(order) => {
                      setReceiptOrder(order);
                      setIsReceiptOpen(true);
                    }}
                    isForcedMobile={isForcedMobile}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminView
                    productsCount={products.length}
                    ordersCount={orders.length}
                    activityLogs={activityLogs}
                    onAddNewProduct={handleAddNewProduct}
                    onOpenDemoLink={handleOpenDemoLink}
                    onShowToast={showToast}
                    isForcedMobile={isForcedMobile}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar (Active in mobile mode and on mobile screens) */}
      {!selectedProduct && (deviceMode === 'mobile' || deviceMode === 'auto') && (
        <div className={deviceMode === 'mobile' ? 'block' : 'block md:hidden'}>
          <BottomNav
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
            ordersBadgeCount={orders.length}
          />
        </div>
      )}

      {/* Live Demo Modal */}
      <LiveDemoModal
        product={demoProduct}
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        product={checkoutProduct}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        onShowToast={showToast}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onShowToast={showToast}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        logs={activityLogs}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => showToast('Filter berhasil diterapkan!')}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutProduct={handleStartCheckout}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#16161a] border border-[#ef4444]/60 text-white px-4 py-2 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
