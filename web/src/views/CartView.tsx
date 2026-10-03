import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  CreditCard,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CartViewProps {
  onNavigate: (view: string, courseId?: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, courses, clearCart, createOrder } = useApp();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  const cartCourses = cart.map(item => {
    const found = courses.find(c => c.id === item.courseId);
    return {
      ...item,
      course: found
    };
  }).filter(item => Boolean(item.course));

  const subtotal = cartCourses.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const clean = couponCode.trim().toUpperCase();
    if (clean === 'LEARNFY20') {
      setAppliedDiscount(0.20);
      setCouponSuccess('20% coupon applied successfully!');
    } else if (clean === 'WELCOME50') {
      setAppliedDiscount(0.50);
      setCouponSuccess('50% welcome discount applied!');
    } else {
      setCouponError('Invalid or expired promotional code.');
    }
  };

  const handleExecuteCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder(subtotal, discountAmount, total, couponSuccess ? couponCode : undefined);
      setIsProcessing(false);
      setOrderComplete(order);
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-lg mx-auto text-center border border-gray-200 rounded-2xl p-8 bg-[#FAF8F5] shadow-xs">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payment Verified</h1>
          <p className="text-xs text-gray-600 mt-1 mb-6">
            Order <strong className="text-gray-900">{orderComplete.id}</strong> processed successfully. Your digital entitlement has been issued and linked to your student account.
          </p>

          <div className="bg-white p-4 rounded-xl border border-gray-200 text-left mb-6 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono text-gray-800">{orderComplete.paymentReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-gray-900">${orderComplete.total.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Gateway Status</span>
              <span className="text-emerald-600 font-bold uppercase text-[10px]">Settled & Entitled</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Learning Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-600 mt-1">Review your selections and proceed with tokenized checkout.</p>
        </div>

        {cartCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
                {cartCourses.map(({ course, price }) => {
                  if (!course) return null;
                  return (
                    <div key={course.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={course.thumbnailUrl} 
                          alt="" 
                          className="w-20 h-14 object-cover rounded-lg shrink-0 cursor-pointer"
                          onClick={() => onNavigate('course-detail', course.id)}
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            {course.category}
                          </span>
                          <h4 
                            onClick={() => onNavigate('course-detail', course.id)}
                            className="text-sm font-bold text-gray-900 hover:text-red-600 cursor-pointer line-clamp-1 mt-1"
                          >
                            {course.title}
                          </h4>
                          <p className="text-xs text-gray-500">By {course.instructor.name} • {course.duration}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <span className="text-base font-bold text-gray-900">${price.toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(course.id)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Bar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. LEARNFY20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-[#FAF8F5] border border-gray-300 rounded-lg text-xs px-3 py-2 uppercase font-mono tracking-wider focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>

                <div className="text-xs text-right">
                  {couponSuccess && <span className="text-emerald-600 font-semibold">{couponSuccess}</span>}
                  {couponError && <span className="text-red-600 font-semibold">{couponError}</span>}
                  {!couponSuccess && !couponError && (
                    <span className="text-gray-400">Available: <strong>LEARNFY20</strong> or <strong>WELCOME50</strong></span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary & Tokenized Checkout Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Digital Taxes & VAT</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Security info */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit Encrypted Token Checkout</span>
                </div>
                <p>Card numbers are never held in server memory. Playback entitlement activates instantaneously upon settlement.</p>
              </div>

              <button
                onClick={handleExecuteCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Authorizing Digital Payment...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Complete Purchase & Enroll</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('catalog')}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-900 font-medium"
              >
                ← Continue Shopping
              </button>
            </div>

          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-dashed border-gray-300 rounded-2xl max-w-lg mx-auto p-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-base font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Select any program from the course catalog to begin checkout.
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
