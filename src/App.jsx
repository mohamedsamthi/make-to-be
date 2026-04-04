import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PaymentNotification from './components/common/PaymentNotification'
import RouteFallback from './components/common/RouteFallback'

/* Code-split page bundles — keeps initial JS small on mobile and improves TTI */
const HomePage = lazy(() => import('./pages/customer/HomePage'))
const ProductsPage = lazy(() => import('./pages/customer/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/customer/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/customer/CartPage'))
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'))
const ContactPage = lazy(() => import('./pages/customer/ContactPage'))
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'))
const OrderTrackingPage = lazy(() => import('./pages/customer/OrderTrackingPage'))
const AboutPage = lazy(() => import('./pages/customer/AboutPage'))
const PromoVideoPage = lazy(() => import('./pages/customer/PromoVideoPage'))
const WishlistPage = lazy(() => import('./pages/customer/WishlistPage'))
const FormsPage = lazy(() => import('./pages/customer/FormsPage'))
const NotFoundPage = lazy(() => import('./pages/customer/NotFoundPage'))

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))

const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'))
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'))
const AdminPromotionsPage = lazy(() => import('./pages/admin/AdminPromotionsPage'))
const AdminSalesPage = lazy(() => import('./pages/admin/AdminSalesPage'))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'))
const AdminVideoManagePage = lazy(() => import('./pages/admin/AdminVideoManagePage'))
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))

function CustomerLayout({ children }) {
  /* Offset matches fixed announcement (2.5rem) + header rows; scales at lg for category bar */
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <Navbar />
      <main className="min-w-0 flex-1 pb-20 pt-[calc(2.5rem+4rem)] max-lg:pb-[max(5rem,env(safe-area-inset-bottom,0px))] lg:pb-8 lg:pt-[calc(2.5rem+5rem+3rem)]">
        <Suspense fallback={<RouteFallback />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  )
}

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <Navbar />
      <main className="min-w-0 flex-1 pb-20 pt-[calc(2.5rem+4rem)] max-lg:pb-[max(5rem,env(safe-area-inset-bottom,0px))] lg:pb-8 lg:pt-[calc(2.5rem+5rem+3rem)]">
        <Suspense fallback={<RouteFallback />}>{children}</Suspense>
      </main>
    </div>
  )
}

const WhatsAppButton = () => {
  const { t } = useLanguage()
  const [show, setShow] = useState(!window.location.pathname.startsWith('/admin'))

  useEffect(() => {
    const handleLocationChange = () => {
      setShow(!window.location.pathname.startsWith('/admin'))
    }

    const interval = setInterval(handleLocationChange, 500)
    return () => clearInterval(interval)
  }, [])

  if (!show) return null

  return (
    <a
      href="https://wa.me/94759028379"
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 min-h-[3.5rem] min-w-[3.5rem] items-center justify-center rounded-2xl bg-white text-black shadow-2xl shadow-white/10 transition-transform hover:scale-110 hover:bg-gray-100"
      title={t('whatsapp.title')}
      id="whatsapp-float"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="absolute -top-8 right-0 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3 py-1.5 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {t('whatsapp.tooltip')}
      </span>
    </a>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <Router>
              <div className="min-h-screen min-w-0 max-w-full overflow-x-clip bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                <Routes>
                    <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
                    <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
                    <Route path="/products/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
                    <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
                    <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
                    <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
                    <Route path="/forms" element={<CustomerLayout><FormsPage /></CustomerLayout>} />
                    <Route path="/profile" element={<CustomerLayout><ProfilePage /></CustomerLayout>} />
                    <Route path="/orders" element={<CustomerLayout><OrderTrackingPage /></CustomerLayout>} />
                    <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
                    <Route path="/promo-video" element={<CustomerLayout><PromoVideoPage /></CustomerLayout>} />
                    <Route path="/wishlist" element={<CustomerLayout><WishlistPage /></CustomerLayout>} />

                    <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                    <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
                    <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
                    <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

                    <Route
                      path="/admin-login"
                      element={(
                        <Suspense fallback={<RouteFallback />}>
                          <AdminLoginPage />
                        </Suspense>
                      )}
                    />

                    <Route
                      path="/admin"
                      element={(
                        <Suspense fallback={<RouteFallback />}>
                          <AdminLayout />
                        </Suspense>
                      )}
                    >
                      <Route index element={<DashboardPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="customers" element={<AdminCustomersPage />} />
                      <Route path="reviews" element={<AdminReviewsPage />} />
                      <Route path="promotions" element={<AdminPromotionsPage />} />
                      <Route path="sales" element={<AdminSalesPage />} />
                      <Route path="messages" element={<AdminMessagesPage />} />
                      <Route path="promo-video" element={<AdminVideoManagePage />} />
                      <Route path="profile" element={<AdminProfilePage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                    </Route>

                    <Route path="*" element={<CustomerLayout><NotFoundPage /></CustomerLayout>} />
                  </Routes>

                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--color-surface-card)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 20px',
                      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(8px)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                      style: {
                        borderLeft: '4px solid #10b981',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                      style: {
                        borderLeft: '4px solid #ef4444',
                      },
                    },
                  }}
                />

                <WhatsAppButton />
                <PaymentNotification />
              </div>
            </Router>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
