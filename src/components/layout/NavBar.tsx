import { Link, useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { truncateEmail } from '../../utils/formatters';

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-slate-900">
            ShopFlow
          </Link>
          <Link
            to="/products"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Products
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? '/cart' : '/login')}
            className="relative inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cart
            <span className="absolute -right-1 -top-1">
              <Badge count={itemCount} data-testid="cart-item-count" />
            </span>
          </button>

          {isAuthenticated && user ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:block">{truncateEmail(user.email)}</span>
              <Button type="button" variant="ghost" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
